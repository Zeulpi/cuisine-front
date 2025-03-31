const baseUrl = 'http://localhost:8000'

export const getResource = (resourceRoute, resourceName) => {
    return baseUrl + resourceRoute + resourceName
}