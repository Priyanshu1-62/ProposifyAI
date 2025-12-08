import { useState } from 'react';
import userContext from "./userContext";
import type { PropsWithChildren } from 'react';
import type { reqData } from '../Models/reqData';
import type { respondent } from '../Models/respondent';

function UserState(props: PropsWithChildren) {
  const dummyReqData: reqData = {title: "", description: "", respondentGroupId: ""};
  const dummyResData: respondent[] = [];
  const [sidebar, setSidebar] = useState<boolean>(true);
  const [reqData, setReqData] = useState(dummyReqData);
  const [resData, setResData] = useState(dummyResData);
  const [loading, setLoading] = useState(false);
  const [resGroupName, setResGroupName] = useState<string>("");
  return (
    <userContext.Provider value={{sidebar, setSidebar, reqData, setReqData, resData, setResData, loading, setLoading, resGroupName, setResGroupName}}>
        {props.children}
    </userContext.Provider>
  )
}

export default UserState