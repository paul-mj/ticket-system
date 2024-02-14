import React from 'react';
import './titleBox.scss';

const TitleBoxHtml = React.memo(({ header, content }: any) => {
    return (
        <div className="title-box-wrapper">
            <div className="title-box-header">{header}</div>
            <div className="title-box-body" dangerouslySetInnerHTML={{ __html: content }}></div>
        </div>
    )
})
export default TitleBoxHtml;