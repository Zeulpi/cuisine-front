import { baseUrl } from "./routes-constants"

export const getResource = (resourceRoute, resourceName) => {
    return baseUrl + resourceRoute + resourceName
}