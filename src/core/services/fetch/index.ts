interface APIPOST {
    url: string; apiData: any; token?: string;
}
class APIFetchService {
    static BaseURL = window['config']?.BASE_URL;
    static post({ url, apiData, token }: APIPOST):Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await fetch(`${this.BaseURL}${url}`, {
                    method: 'post',
                    body: JSON.stringify(apiData),
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token ? `Bearer ${token}` : ''
                    }
                })
                resolve(response.json());
            } catch (error) {
                reject(error);
            }

        })
    }
}
export default APIFetchService;