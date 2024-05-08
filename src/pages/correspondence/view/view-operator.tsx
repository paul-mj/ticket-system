import { useTranslation } from "react-i18next";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { FcLibrary } from "react-icons/fc";
import TitleBox from "../../../shared/components/TitleBox";
import { relative } from "path";
import { AddedTask } from "../../../assets/images/png/pngimages";
import { Eye, EyeCross } from "../../../assets/images/svgicons/svgicons";
import { ApartmentOutlined } from "@material-ui/icons";



interface OperatorInterface {
    editFormattedresponse: any;
    showMore: boolean,
    editOperators: any,
    handleSearch: (event: any) => void;
    //showMoreToggle: () => void;
}


const ViewOperator = ({ editFormattedresponse, showMore, editOperators, handleSearch }: OperatorInterface) => {
    const { t } = useTranslation();

    return (
        <>
            {editFormattedresponse?.NewSetOperators?.length > 0 &&
                <TitleBox header={<div className="oper-top-sec">
                    <div>{t('Operators')}</div>
                    <div className="search-sec">
                        <div className="search-wrapper">
                            <div className="search-ip-wrap position-relative">
                                <input type="text" placeholder={t("Search") ?? 'Search'} className="w-100" onChange={(event) => handleSearch(event)} style={{ backgroundColor: "white" }} />
                                <div className="search-icon">
                                    <SearchOutlinedIcon fontSize="inherit" />
                                </div>
                            </div>
                            <div className="search-result-wrap">
                            </div>
                        </div>
                    </div>
                </div>}
                    content={<div className="aditional-role" style={{ minHeight: "auto" }}>
                        <div className="additional-role-sec">
                            {(editOperators?.length) ? editOperators.map((item: any, index: any) => (
                                <div className="each-role-sections" key={index}>
                                    <div className="icon-wrap">
                                        <ApartmentOutlined />
                                        {/* <div className="additional-role" title={item.OBJECT_NAME}>{item.OBJECT_NAME}</div> */}
                                    </div>
                                    <div className="det-sec">
                                        <div className="additional-role" title={item.OBJECT_NAME}>{item.OBJECT_NAME}</div>
                                        <div className="icon-sec">
                                            {item.SHOW_VIEW_ICON === 1 &&
                                                <img className={`opr-full-img`} src={item.IS_VIEWED ? Eye : EyeCross} alt="" style={{ filter: item.IS_VIEWED ? "invert(35%) sepia(96%) saturate(471%) hue-rotate(72deg) brightness(99%) contrast(88%)" : "invert(34%) sepia(31%) saturate(3607%) hue-rotate(336deg) brightness(94%) contrast(102%)" }} />}
                                            {item.SHOW_TASK_ICON === 1 && <>
                                                <img className={`opr-full-img`} src={AddedTask} alt="" />
                                                <div className="additional-role" title={item.TASK_COMPLETED_COUNT} style={{ color: item.TASK_COMPLETED_COLOR }}>{item.TASK_COMPLETED_COUNT}{item.TASK_TOTAL_COUNT}</div></>
                                            }
                                        </div>
                                    </div>
                                </div>
                            )) : <div className="nodata">{("No Data")}</div>}
                        </div>

                        {/* {editFormattedresponse?.Operator?.length > 20 && <button className="show-operator" onClick={showMoreToggle}>
                            {t("Show")} {showMore ? t('Less') : t('More')}
                        </button>} */}
                    </div>

                    }
                />
            }
        </>
    )
}

export default ViewOperator;
