import React from 'react';
import './titleBox.scss';


interface TitleBoxInterface {
    header: any;
    content: any;
    className?: any;
}

const TitleBox = React.memo(({ header, content, className }: TitleBoxInterface) => {
    return (
        <div className={`title-box-wrapper ${className || ''}`}>
            <div className="title-box-header">{header}</div>
            <div className="title-box-body">{content}</div>
        </div>
    )
})
export default TitleBox;