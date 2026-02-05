
export function fetchJsonApiInit(method: string, token: string, body?: object): RequestInit{
    return {
        method,
        headers: {
            'content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        credentials: "include",
        body: body ? JSON.stringify({...body}) : undefined
    };
}