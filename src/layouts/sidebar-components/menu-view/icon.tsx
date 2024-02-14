import React, { useState, useEffect, useRef } from 'react';
import { ReactComponent as WidgetOutlined } from '../../../assets/images/menuicons/WidgetsOutlined.svg';
import {menuicons} from '../../../assets/images/menuicons/menuicons';
interface IconProps {
    name: string;
    size?: number;
    fill?: string;
}

const Icon = ({ name, size = 25, fill = '#000' }: IconProps) => {
    const [icon, setIcon] = useState();
    const importedIconRef = useRef<React.ComponentType<React.SVGProps<SVGSVGElement>> | null>(null);
return (
    <>
    </>
)
};

export default Icon;