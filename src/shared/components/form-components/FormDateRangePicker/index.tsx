import { useState } from "react";
import { DateRangePicker } from "react-date-range";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const FormDateRangePicker = ({ onChange, initialRange }: any) => {
    const [selectedRange, setSelectedRange] = useState(initialRange)
    const handleSelect = (ranges: any) => {
        setSelectedRange(ranges.selection)
        onChange(ranges.selection)
    }
    return (
        <DateRangePicker
            ranges={[selectedRange]}
            onChange={handleSelect} 
        />
    )
}
export default FormDateRangePicker;