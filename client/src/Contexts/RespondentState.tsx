import type { apiResult } from "../Models/apiResult";
import type { respondent } from "../Models/respondent";
import { fetchAccessToken } from "../services/tokenService/fetchAccessToken";
import alertContext from "./alertContext";
import respondentContext from "./respondentContext";
import { useContext, type PropsWithChildren } from 'react';

function RespondentState(props: PropsWithChildren) {
  const apiURL = import.meta.env.VITE_API_URL;

  const {handleAlert, handleApiResponse} = useContext(alertContext)!;

  const getRespondentGroup = async (id: string) => {
    try {
        const token = fetchAccessToken();
        const response = await fetch(`${apiURL}/api/groups/getGroup/${id}`, {
          method: "GET",
            headers: { 
              'content-type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            credentials: "include"
        });

        const data = await response.json();
        const result: apiResult = {ok: response.ok, status: response.status, data, success: "Respondent group fetched successfully !"};
        handleApiResponse(result);
        return result;
    } 
    catch (error) {
        handleAlert({color: "red", msg: "Something went wrong"});
        const result: apiResult = {ok: false, status: 500, data: {}, success: "Respondent group fetched successfully !"};
        return result;
    }
  }

  const getRespondentGroups = async () => {
    try {
        const token = fetchAccessToken();
        const response = await fetch(`${apiURL}/api/groups/getGroups`, {
          method: "GET",
            headers: { 
              'content-type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            credentials: "include"
        });

        const data = await response.json();
        const result: apiResult = {ok: response.ok, status: response.status, data, success: "Respondent groups fetched successfully !"};
        handleApiResponse(result);
        return result;
    } 
    catch (error) {
        handleAlert({color: "red", msg: "Something went wrong"});
        const result: apiResult = {ok: false, status: 500, data: {}, success: "Respondent groups fetched successfully !"};
        return result;
    }
  }

  const getRespondents = async (id: string) => {
    try {
      const token = fetchAccessToken();
      const response = await fetch(`${apiURL}/api/respondents/getRespondents/${id}`, {
        method: "GET",
            headers: { 
              'content-type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            credentials: "include"
      });

      const data = await response.json();
      const result: apiResult = {ok: response.ok, status: response.status, data, success: "Respondents fetched successfully !"};
      handleApiResponse(result);
      return result;
  } 
  catch (error) {
      handleAlert({color: "red", msg: "Something went wrong"});
      const result: apiResult = {ok: false, status: 500, data: {}, success: "Respondents fetched successfully !"};
      return result;
  }
  }

  const createRespondentGroup = async (name: string) => {
    try {
        const token = fetchAccessToken();
        const response = await fetch(`${apiURL}/api/groups/createGroup`, {
            method: "POST",
            headers: { 
              'content-type': 'application/json',
              'Authorization': `Bearer ${token}` 
            },
            credentials: "include",
            body: JSON.stringify({name, userId: 123})
        });

        const data = await response.json();
        const result: apiResult = {ok: response.ok, status: response.status, data, success: "Respondent group created successfully !"};
        handleApiResponse(result);
        return result;
    } 
    catch (error) {
        handleAlert({color: "red", msg: "Something went wrong"});
        const result: apiResult = {ok: false, status: 500, data: {}, success: "Respondent group created successfully !"};
        return result;
    }
  }

  const addRespondent = async (respondentData: respondent) => {
    try {
        const token = fetchAccessToken();
        const response = await fetch(`${apiURL}/api/respondents/createRespondent`, {
            method: "POST",
            headers: { 
              'content-type': 'application/json',
              'Authorization': `Bearer ${token}`  
            },
            credentials: "include",
            body: JSON.stringify(respondentData)
        });
        
        const data = await response.json();
        const result = {ok: response.ok, status: response.status, data, success: "Respondent added to group successfully !"};
        handleApiResponse(result);
        return result;
    } 
    catch (error) {
        handleAlert({color: "red", msg: "Something went wrong"});
        const result: apiResult = {ok: false, status: 500, data: {}, success: "Respondent added to group successfully !"};
        return result;
    }
  }

  return (
    <respondentContext.Provider value={{getRespondentGroup, getRespondentGroups, getRespondents, createRespondentGroup, addRespondent}}>
        {props.children}
    </respondentContext.Provider>
  )
}

export default RespondentState