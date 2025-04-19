import { baseUrl } from "./routes-constants"

export const getData = (apiRoute) => {
    return baseUrl + '/api' + apiRoute
}