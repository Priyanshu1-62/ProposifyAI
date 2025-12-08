import type { apiResult } from "./apiResult";
import type { reqData } from "./reqData";

export interface requestModel {
    getRequests: () => Promise<apiResult>;
    createRequest: (requestData: reqData) => Promise<apiResult>
}