import PrintIconButton from "../Buttons/IconButtons/PrintIconButton";

const PrintPage = ({ printWrapper, onClickFn, onAfterPrint }: any) => {
    const triggerPrint = () => {
        const wrapper = document.createElement('div');
        wrapper.id = 'printWrapper';
        document.body.appendChild(wrapper);
        if (wrapper && printWrapper) {
            const html = printWrapper.innerHTML;
            wrapper.innerHTML = html;
            wrapper.querySelectorAll('button:not([role="tab"])').forEach((x: any) => { x.style.display = 'none' })
            wrapper.querySelectorAll('.print-disable').forEach((x: any) => { x.style.display = 'none' })
            const otherDiv = document.querySelectorAll('body > div:not(#printWrapper)');
            otherDiv.forEach((el:any) => el.style.display = 'none')
            window.print();
            otherDiv.forEach((el:any) => el.style.display = 'block')
            document.body.removeChild(wrapper);
            onAfterPrint && onAfterPrint(false)
        }
    }
    const handleOnClick = async () => {
        await onClickFn();
        triggerPrint();
    }
    return (
        <PrintIconButton onClick={handleOnClick} />
    )
}
export default PrintPage;