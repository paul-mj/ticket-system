import { Container } from "react-bootstrap"
import "../login/login.scss";
import "./Acknowledgement.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import ApiService from "../../../core/services/axios/api";
import { cancelRedBig, loadingDots, tickGreenBig } from "../../../assets/images/svgicons/svgicons";

const SuccessMsg = ({ msg }: any) => {
    return (
        <div className="message-wrapper message-wrapper-success">
            <div className="message-wrapper-image"><img src={tickGreenBig} alt="" /></div>
            <div><h3>{msg}</h3></div>
        </div>
    )
}
const ErrorMsg = ({ msg }: any) => {
    return (
        <div className="message-wrapper message-wrapper-failed">
            <div className="message-wrapper-image"><img src={cancelRedBig} alt="" /></div>
            <div><h3>{msg}</h3></div>
        </div>
    )
}
const LoadingMsg = () => {
    return (
        <div className="message-wrapper message-wrapper-loading">
            <div className="message-wrapper-image"><img src={loadingDots} alt="" /></div>
            <div><h3>Loading Please Wait...</h3></div>
        </div>
    )
}

const Acknowledgement = () => {
    const [viewMode, setViewMode] = useState(-1);
    const [msg, setMsg] = useState("Loading");
    const { search } = useLocation();
    const navigate = useNavigate();
    const getAck = useCallback(async () => {
        const searchParams = new URLSearchParams(search);
        const guid: string = (searchParams.get('guid') || searchParams.get('GUID')) ?? '';
        try {
            const user = localStorage.getItem('frmAccessToken')
            const apiData = { guid }
            const param = new URLSearchParams(apiData).toString();
            setViewMode(-1)
            const { Id, Message } = await ApiService.httpGet(`trans/acknowledgeMail?${param}`);
            const state = Id < 1 ? 0 : 1;
            setViewMode(state);
            setMsg(Message)
            if (state === 1 && user) {
                setTimeout(() => {
                    navigate('/dashboard')
                }, 5000);
            }
        } catch (error) {

        }
    }, [navigate, search])
    useEffect(() => {
        getAck();
    }, [getAck])
    return (
        <div className="login-wrapper h-100">
            <Container className="h-100">
                <div className="login-form">
                    {viewMode === 1 ? <SuccessMsg msg={msg} /> : viewMode === 0 ? <ErrorMsg msg={msg} /> : <LoadingMsg />}
                </div>
            </Container>
        </div>
    )
}
export default Acknowledgement