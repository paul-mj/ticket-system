import { Col, Row } from "react-bootstrap";
import { ImageComponent } from "../../DocsView/docs";
import ViewIconButton from "../../Buttons/IconButtons/ViewIconButton";
import DeleteIconButton from "../../Buttons/IconButtons/DeleteIconButton";
import CommonUtils from "../../../../common/utils/common.utils";
import DownloadIconButton from "../../Buttons/IconButtons/DownloadIconButton";


interface ImageCard {
    isView?: boolean | null;
    image: any;
    index: number;
    handleImageView: (image: any) => void;
    removeImage?: (image: any) => void;
    colsize?:number;
}

const ImageShowCard = ({
    isView,
    image,
    index,
    handleImageView,
    removeImage,
    colsize
}: ImageCard) => {
    return (
        <Col md={colsize ? colsize : 12} className="animation my-0" style={{ animation: 'slowTransition 1s ease-out' }}> 
            <Row className="each-img align-items-center no-gutters py-2">
                <Col md={2}>
                    <ImageComponent image={image} />
                </Col>
                <Col md={7}>
                    <p className="m-0 filename">{image.DISPLAY_NAME}</p>
                </Col>
                <Col md={3}>
                    <Row className="justify-content-end align-items-center no-gutters">
                        <Col md={4} className="ech-action">
                            {!isView && removeImage && <DeleteIconButton onClick={() => removeImage(index)} />}
                        </Col>
                        <Col md={4} className="ech-action">
                            <ViewIconButton onClick={() => handleImageView(image)} />
                        </Col>
                        <Col md={4} className="ech-action">
                            <DownloadIconButton onClick={() => CommonUtils.downloadAttachment(image)} />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Col>
    );
};

export default ImageShowCard;

