import type { reqData } from "./reqData";

export interface userModel {
    sidebar: boolean;
    setSidebar: React.Dispatch<React.SetStateAction<boolean>>;
    reqData: reqData;
    setReqData: React.Dispatch<React.SetStateAction<reqData>>;
}