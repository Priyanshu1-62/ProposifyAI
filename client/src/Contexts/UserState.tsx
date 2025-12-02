import { useState } from 'react';
import userContext from "./userContext";
import type { PropsWithChildren } from 'react';

function UserState(props: PropsWithChildren) {
  const [sidebar, setSidebar] = useState<boolean>(true);
  return (
    <userContext.Provider value={{sidebar, setSidebar}}>
        {props.children}
    </userContext.Provider>
  )
}

export default UserState