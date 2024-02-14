import { useLocation } from "react-router-dom";
import { decrypt } from "../../layouts/menu-utils";

const useURLParser = () => {
    const location = useLocation();
    const getQuery = () => {
        let query: any = {};
        const queryParams = new URLSearchParams(location.search);
        if (queryParams) {
            const queryParamValue = queryParams.get("query");
            if (queryParamValue) {
                try {
                    query = queryParamValue && JSON.parse(decrypt(queryParamValue))
                } catch (error) {

                };
            }
        }
        return query;
    }
    return { getQuery };
}
export default useURLParser;