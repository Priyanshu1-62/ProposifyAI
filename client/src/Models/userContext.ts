import type { reqData } from "./reqData";
import type { respondent } from "./respondent";

export interface userModel {
    sidebar: boolean;
    setSidebar: React.Dispatch<React.SetStateAction<boolean>>;
    reqData: reqData;
    setReqData: React.Dispatch<React.SetStateAction<reqData>>;
    resData: respondent[];
    setResData: React.Dispatch<React.SetStateAction<respondent[]>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    resGroupName: string;
    setResGroupName: React.Dispatch<React.SetStateAction<string>>;
}