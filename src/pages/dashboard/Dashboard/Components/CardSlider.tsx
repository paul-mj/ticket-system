import { useEffect, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import Slider from "react-slick";
import { EventIcon } from "../../../../assets/images/svgicons/svgicons";
import { Button, IconButton } from "@mui/material";
import NavigateNextOutlinedIcon from '@mui/icons-material/NavigateNextOutlined';
import NavigateBeforeOutlinedIcon from '@mui/icons-material/NavigateBeforeOutlined';
import './dashboard-components.scss'
import { RedirectUrl, encrypt } from "../../../../layouts/menu-utils";
import { useNavigate } from "react-router-dom";
import { MasterId } from "../../../../common/database/enums";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { OpenInWindow } from "../../../../common/application/shared-function";


const settingsObj = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
        {
            breakpoint: 1200,
            settings: {
                slidesToShow: 3,
            },
        },
        {
            breakpoint: 992,
            settings: {
                slidesToShow: 2,
            },
        },
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 1,
                infinite: true,
                autoplay: true,
                autoplaySpeed: 2000
            },
        },
    ],
};

export const CardSlider = (props: any) => {
    const { cardDatas } = props;
    const sliderRef = useRef<Slider>(null);
    const [settings, setSettings] = useState(settingsObj);

    useEffect(() => { 
        setSettings((prevState: any) => ({
            ...prevState,
            slidesToShow: (cardDatas?.length === 1) ? 1 : (cardDatas?.length === 2) ? 2 : 3
        }))
    }, [cardDatas]);

    const goToNextSlide = () => {
        sliderRef.current && sliderRef.current?.slickNext();
    };

    const goToPrevSlide = () => {
        sliderRef.current && sliderRef.current?.slickPrev();
    };
    return (
        <>
            {
                cardDatas?.length ?
                    <Row className="card-slider-wrapper">
                        <Col md={12}>
                            <div className="d-flex justify-content-end align-items-center arrow-btns">
                                <IconButton aria-label="NavigateBeforeOutlinedIcon" className="arrow-icon mx-1" onClick={goToPrevSlide}>
                                    <NavigateBeforeOutlinedIcon />
                                </IconButton>
                                <IconButton aria-label="NavigateNextOutlinedIcon" className="arrow-icon mx-1" onClick={goToNextSlide}>
                                    <NavigateNextOutlinedIcon />
                                </IconButton>
                            </div>
                        </Col>
                        <Col md={12}>
                            <Slider {...settings} ref={sliderRef} className="mail-count-slick">
                                {
                                    cardDatas.map((item: any, index: any) => {
                                        return <Cards cardData={item} cardLength={cardDatas?.length} key={index} />
                                    })
                                }
                            </Slider>
                        </Col>
                    </Row>
                    :
                    <></>
            }
        </>
    );
}

export const Cards = (data: any) => { 
    return (
        <Row className={`justify-content-between align-items-center each-corr-card bgWithImg carditem-${data?.cardLength && data?.cardLength}`}>
            {/* <Col md={12}>
                <img src={EventIcon} alt={EventIcon} />
            </Col> */}
            <Col md={12} className="p-0">
                <Row>
                    <Col md={2}>
                        <div className="d-flex icon-next-pg">
                            <OpenInWindow item={data}/>
                        </div>
                    </Col>
                    <Col md={10}>
                        <h3> {data?.cardData?.VALUE}</h3>
                    </Col>
                    <Col md={2}></Col>
                    <Col md={10}>
                        <span>{data?.cardData?.ARG}</span>
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}
