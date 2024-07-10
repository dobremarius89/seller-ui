import axios from 'axios';
import {getJwtToken} from "@/config/store.config";

export const GET = "get";
export const POST = "post";
export const DELETE = "delete";

export async function apiRequest(url, method, data) {
    const headers = {};
    const token = getJwtToken();
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    return axios({url, method, data, headers});
}