import { useState } from 'react';
import userContext from "./userContext";
import type { PropsWithChildren } from 'react';
import type { reqData } from '../Models/reqData';

function UserState(props: PropsWithChildren) {
  const dummyReqData: reqData = {title: "", description: "", respondent: ""};
  const [sidebar, setSidebar] = useState<boolean>(true);
  const [reqData, setReqData] = useState(dummyReqData);
  return (
    <userContext.Provider value={{sidebar, setSidebar, reqData, setReqData}}>
        {props.children}
    </userContext.Provider>
  )
}

export default UserState