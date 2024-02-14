import React from "react";
import * as MuiIcons from "@material-ui/icons";
import CasinoOutlinedIcon from '@mui/icons-material/CasinoOutlined';

const MuiIconsComponent: React.FC<any>  = ({ iconName }) => {
  const Icon = MuiIcons[iconName]; 
  return Icon ? <Icon /> : <CasinoOutlinedIcon />;
};


export default MuiIconsComponent;