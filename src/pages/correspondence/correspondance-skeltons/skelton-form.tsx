import { Col, Row } from "react-bootstrap"; 
import { Skeleton } from "@mui/material";

const CorrespondanceSkelton = () => {
    return (
        <>
            <Row>
                <Col md={4}> 
                    <Skeleton variant="rectangular" width={'100%'} height={40} sx={{ my: 1 }} />
                </Col>
                <Col md={4}>
                    <Skeleton variant="rectangular" width={'100%'} height={40} sx={{ my: 1 }} />
                </Col>
                <Col md={4}>
                    <Skeleton variant="rectangular" width={'100%'} height={40} sx={{ my: 1 }} />
                </Col>
            </Row>
            <Row>
                <Col md={4}>
                    <Skeleton variant="rectangular" width={'100%'} height={40} sx={{ my: 1 }} />
                </Col>
                <Col md={4}>
                    <Skeleton variant="rectangular" width={'100%'} height={40} sx={{ my: 1 }} />
                </Col>
                <Col md={4}>
                    <Skeleton variant="rectangular" width={'100%'} height={40} sx={{ my: 1 }} />
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                <Skeleton variant="rectangular" width={'100%'} height={420} sx={{ my: 1 }} />
                </Col> 
            </Row>
            <Row>
                <Col md={12}>
                    <Skeleton variant="rectangular" width={'100%'} height={40} sx={{ my: 1 }} />
                </Col> 
            </Row>
            <Row>
                <Col md={12}>
                    <Skeleton variant="rectangular" width={'100%'} height={40} sx={{ my: 1 }} />
                </Col> 
            </Row>
            <Row>
                <Col md={12}>
                    <Skeleton variant="rectangular" width={'100%'} height={40} sx={{ my: 1 }} />
                </Col> 
            </Row>
        </>
    )
}

export default CorrespondanceSkelton;

