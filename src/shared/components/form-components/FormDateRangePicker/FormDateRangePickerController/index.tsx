import { ClickAwayListener, Popper } from "@mui/material";
import React, { useEffect, useState } from "react";
import FormDateRangePicker from "..";
import FormatField from "../../../UI/FormatField";
import '../FormDateRangePicker.scss';

interface Range {
    startDate: Date;
    endDate: Date;
}
interface RangePickerControllerProps {
    onChange: (arg: { startDate: Date, endDate: Date }) => void;
    range: Range
}
const FormDateRangePickerController = ({ onChange, range }: RangePickerControllerProps) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [selectedRange, setSelectedRange] = useState<any>(null)
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };
    const open = Boolean(anchorEl);
    const id = open ? 'popper-dateRanger' : undefined;

    const onSelectionChange = (range: any) => {
        setSelectedRange(range)
        const { startDate, endDate } = range;
        if (startDate !== endDate) {
            onChange({ startDate, endDate });
            setTimeout(() => {
                setAnchorEl(null)
            }, 500);
        }
    }
    useEffect(() => {
        setSelectedRange({
            ...range,
            key: 'selection'
        });
    }, [range])
    return (
        <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
            <div className="mx-3">
                <button aria-describedby={id} type="button" className={`dateRange-picker`} onClick={handleClick}>
                    <span>
                        <FormatField type='date' format="dd-mmm-yyyy" delimiter="-" value={selectedRange?.startDate} />
                    </span>
                    <span className="mx-2">To</span>
                    <span>
                        <FormatField type='date' format="dd-mmm-yyyy" delimiter="-" value={selectedRange?.endDate} />
                    </span>
                </button>
                <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-start">
                    <div className="poper-wrapper-range">
                        <FormDateRangePicker onChange={onSelectionChange} initialRange={selectedRange} />
                    </div>
                </Popper>
            </div>
        </ClickAwayListener>
    )
}
export default FormDateRangePickerController;