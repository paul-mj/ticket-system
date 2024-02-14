import styled from "@emotion/styled";
 
export const TableNoData = (props: any) => {
    const { colSpan, message } = props;
    return <>

        <tr>
            <td colSpan={colSpan} style={{ textAlign: 'center', padding: '4rem', fontSize: '16px', fontWeight: '600' }}>
                {message}
            </td>
        </tr>

    </>
}