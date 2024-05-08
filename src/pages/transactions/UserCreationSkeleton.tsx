import { Col, Row } from "react-bootstrap";
import SkeletonLoader from "../../shared/components/UI/Loader/SkeletonLoader";
const UserCreateSkelton = () => {
    return (
        <>
            <Row className="p-4">
                <Row>
                    <Col md={4}>
                        <SkeletonLoader skeleton={{ variant: "rectangular", width: '100%', height: 40, sx: { my: 1 } }} />
                    </Col>
                    <Col md={4}>
                        <SkeletonLoader skeleton={{ variant: "rectangular", width: '100%', height: 40, sx: { my: 1 } }} />
                    </Col>
                    <Col md={4}>
                        <SkeletonLoader skeleton={{ variant: "rectangular", width: '100%', height: 40, sx: { my: 1 } }} />
                    </Col>
                    <Col md={4}>
                        <SkeletonLoader skeleton={{ variant: "rectangular", width: '100%', height: 40, sx: { my: 1 } }} />
                    </Col>
                    <Col md={4}>
                        <SkeletonLoader skeleton={{ variant: "rectangular", width: '100%', height: 40, sx: { my: 1 } }} />
                    </Col>
                    <Col md={4}>
                        <SkeletonLoader skeleton={{ variant: "rectangular", width: '100%', height: 40, sx: { my: 1 } }} />
                    </Col>
                    <Col md={4}>
                        <SkeletonLoader skeleton={{ variant: "rectangular", width: '100%', height: 40, sx: { my: 1 } }} />
                    </Col>
                    <Col md={4}>
                        <SkeletonLoader skeleton={{ variant: "rectangular", width: '100%', height: 40, sx: { my: 1 } }} />
                    </Col>
                    <Col md={4}>
                        <SkeletonLoader skeleton={{ variant: "rectangular", width: '100%', height: 40, sx: { my: 1 } }} />
                    </Col>
                </Row>
                <Col md={21}>
                    <SkeletonLoader skeleton={{ variant: "rectangular", width: '100%', height: 300, sx: { my: 1 } }} />
                </Col>
            </Row>
        </>
    )
}
export default UserCreateSkelton;