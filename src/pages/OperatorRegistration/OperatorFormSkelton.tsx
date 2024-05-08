import { Col, Row } from "react-bootstrap"; 
import SkeletonLoader from "../../shared/components/UI/Loader/SkeletonLoader";
const OperatorFormSkelton = () => {
    return (
        <Row className="p-4">
            <Col md={12}>
                <SkeletonLoader  skeleton={{ variant: "rectangular", width: '100%', height: 50, sx: { my: 1 } }} />
            </Col>
            <Col md={12}>
                <SkeletonLoader config={{iteration: 5}} skeleton={{ variant: "rectangular", width: '100%', height: 150, sx: { my: 1 } }} />
            </Col> 
        </Row>
    )
}
export default OperatorFormSkelton;