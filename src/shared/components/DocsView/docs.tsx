import { Doc, Jpg, Pdf, Png, Xlsx } from "../../../assets/images/file/fileicon";

export const ImageComponent = ({ image }: any) => {  
    return (
        <div className="sel-items-wrap">
            {image?.ext === 'pdf' && (
                <img src={Pdf} className="sel-items" alt="pdf" />
            )}
            {image?.ext === 'xlsx' && (
                <img src={Xlsx} className="sel-items" alt="xlxs" />
            )}
            {image?.ext === 'docx' && (
                <img src={Doc} className="sel-items" alt="doc" />
            )}
            {!['pdf', 'xlsx', 'docx'].includes(image?.ext) && (
                <>
                    {image?.isExist && (
                        <>
                            {image?.ext === 'jpg' && (
                                <img src={Jpg} className="sel-items" alt="jpg" />
                            )}
                            {image?.ext === 'jpeg' && (
                                <img src={Jpg} className="sel-items" alt="jpeg" />
                            )}
                            {image?.ext === 'png' && (
                                <img src={Png} className="sel-items" alt="png" />
                            )}
                        </>
                    )}
                    {!image?.isExist && (
                        <img src={image.src} className="sel-items" alt="imgs" />
                    )}
                </>
            )}
        </div>
    );
};