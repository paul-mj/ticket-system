import { MenuItem } from "@mui/material";
 

interface Props {
    masterMenusSub: any,
    onClickSubMenu: (menu: any) => void;
}


const SubMenuList = (props: Props) => {
    const { masterMenusSub, onClickSubMenu } = props;
    return (
        <>
            {(masterMenusSub && masterMenusSub.list?.length) ?
                <>
                    {masterMenusSub.list.map((menu: any) => (
                        <div key={menu.MenuId} onClick={() => onClickSubMenu(menu)}>
                            <MenuItem>{menu.MenuName}</MenuItem>
                        </div>
                    ))} 
                </> 
                :
                <>
                     
                </>
            }
        </>
    )
}

export default SubMenuList;

