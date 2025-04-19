import axios from 'axios'
import { baseUrl, ROUTES, RESOURCE_ROUTES } from '../resources/routes-constants'
import { getData } from '../resources/api-constants'
import { getResource } from '../resources/back-constants'

const CustomAxios = axios.create({
    baseURL: baseUrl,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 10000,
})

export async function customFetch(method = 'GET', data = {}, params = {}, route = '') {
    try {
        // Exécution de la requête avec les options fournies
        const response = await CustomAxios({
            method,
            url: route,
            data,  // Corps de la requête (pour POST, PUT, etc.)
            params, // Paramètres de l'URL (pour GET, etc.)
        });
        
        return response.data;
    } catch (error: any) {
        if (error.response) {
            return {
                status: error.response.status,
                message: error.response.data?.error || 'An error occurred.',
            };
        } else if (error.request) {
            return {
                message: 'No response received from the server.',
            };
        } else {
            return {
                message: `Error: ${error.message}`,
            };
        }
    }
}