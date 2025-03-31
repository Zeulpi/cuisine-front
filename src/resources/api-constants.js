const baseUrl = 'http://localhost:8000/api'

export const getData = (apiRoute) => {
    return baseUrl + apiRoute
}