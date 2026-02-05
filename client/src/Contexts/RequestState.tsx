import requestContext from "./requestContext";
import { useContext, type PropsWithChildren } from 'react';
import alertContext from "./alertContext";
import type { apiResult } from "../Models/apiResult";
import type { reqData } from "../Models/reqData";
import { fetchAccessToken } from "../services/tokenService/fetchAccessToken";

function RequestState(props: PropsWithChildren) {
  const apiURL = import.meta.env.VITE_API_URL;
  const {handleAlert, handleApiResponse} = useContext(alertContext)!;

  const getRequests = async () => {
    try {
        const token = fetchAccessToken();
        const response = await fetch(`${apiURL}/api/requests/getRequests`, {
          method: "GET",
            headers: { 
              'content-type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            credentials: "include"
        });

        const data = await response.json();
        const result: apiResult = {ok: response.ok, status: response.status, data};
        handleApiResponse(result);
        return result;
    } 
    catch (error) {
        handleAlert({color: "red", msg: "Something went wrong"});
        const result: apiResult = {ok: false, status: 500, data: {}};
        return result;
    }
  }

  const createRequest = async (requestData: reqData) => {
    try {
        const token = fetchAccessToken();
        const response = await fetch(`${apiURL}/api/requests/createRequest`, {
            method: "POST",
            headers: { 
              'content-type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            credentials: "include",
            body: JSON.stringify({...requestData, userId: 123})
        });

        const data = await response.json();
        const result: apiResult = {ok: response.ok, status: response.status, data, success: "Request created successfully !"};
        handleApiResponse(result);
        return result;
    } 
    catch (error) {
        handleAlert({color: "red", msg: "Something went wrong"});
        const result: apiResult = {ok: false, status: 500, data: {}, success: "Request created successfully !"};
        return result;
    }
  }
  return (
    <requestContext.Provider value={{getRequests, createRequest}}>
        {props.children}
    </requestContext.Provider>
  )
}

export default RequestState