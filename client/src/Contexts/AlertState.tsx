import { useState } from 'react';
import alertContext from './alertContext';
import type { PropsWithChildren } from 'react';
import type { AlertInfo } from '../Models/alertInfo';
import type { apiResult } from '../Models/apiResult';

function AlertState(props: PropsWithChildren) {
  const demoAlert: AlertInfo = {color: "noColor", msg: ""};
  const [alertInfo, setAlertInfo]=useState<AlertInfo>(demoAlert);

  function handleAlert(data: AlertInfo): void {
    setAlertInfo(data);
    setTimeout(()=>{
      setAlertInfo(demoAlert);
    }, 2000);
  }

  function handleApiResponse(result: apiResult) {
    if(result.ok){
      handleAlert({color: "green", msg: result.success});
    }
    else{
      if(result.status == 400) handleAlert({color: "red", msg: result.data?.error || result.data?.message || "Data not found"});
      else if(result.status == 404) handleAlert({color: "red", msg: result.data?.error || result.data?.message || "Not Found"});
      else if(result.status == 403) handleAlert({color: "red", msg: result.data?.error || result.data?.message || "Resource limit Exceeded"});
      else handleAlert({color: "red", msg: result.data?.error || result.data?.message || "Internal Server Error"});
    }
  }
  return (
    <alertContext.Provider value={{alertInfo, handleAlert, handleApiResponse}}>
        {props.children}
    </alertContext.Provider>
  )
}

export default AlertState