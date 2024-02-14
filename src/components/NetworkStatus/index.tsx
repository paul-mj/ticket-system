import { useEffect, useState } from "react";
import './NetworkStatus.scss';
import SignalWifiOffIcon from '@mui/icons-material/SignalWifiOff';
import SignalWifiStatusbar4BarIcon from '@mui/icons-material/SignalWifiStatusbar4Bar';

const Online = () => {
    return (
        <div className="network-message network-message-success">
            <SignalWifiStatusbar4BarIcon />
            <p> Connected to Internet. Back to online</p>
        </div>
    )
}
const Offline = () => {
    return (
        <div className="network-message network-message-error">
            <SignalWifiOffIcon />
            <p>Connection lost! You are not connected to internet</p>
        </div>
    )
}
const NetworkStatus = () => {
    const [offline, setOffline] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const networkStatusOffline = () => {
        setShowMessage(true);
        setOffline(true)
    }
    const networkStatusOnline = () => {
        setShowMessage(true);
        setOffline(false);
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
    useEffect(() => {
        window.addEventListener("offline", networkStatusOffline);
        window.addEventListener("online", networkStatusOnline);
        return () => {
            window.removeEventListener("offline", networkStatusOffline);
            window.removeEventListener("online", networkStatusOnline);
        }
    }, [])
    return (
        <>
            {showMessage && <div className="network-wrapper">
                <div className="network-body">
                    {offline ? <Offline /> : <Online />}
                </div>
            </div>}
        </>
    )
}
export default NetworkStatus;