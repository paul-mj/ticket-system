import { MuiOtpInput, MuiOtpInputProps } from 'mui-one-time-password-input'
import { useEffect, useState } from 'react'

interface OTPProps {
    config?: any,
    inputProps?: MuiOtpInputProps
}
const FormOTP = ({ config, inputProps }: OTPProps) => {
    const [otp, setOtp] = useState('')
    const handleChange = (newValue: any) => {
        setOtp(newValue)
    }
    useEffect(() => {
        if (config.hasOwnProperty('value')) {
            setOtp(config.value)
        }
    }, [config])
    return <MuiOtpInput autoFocus value={otp} onChange={handleChange} {...inputProps} />
}
export default FormOTP;