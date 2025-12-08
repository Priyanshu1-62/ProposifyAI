import type { AlertInfo } from "./alertInfo";
import type { apiResult } from "./apiResult";
  
//Define TS interface for Alert Context
export interface AlertContext {
  alertInfo: AlertInfo;
  handleAlert: (data: AlertInfo) => void;
  handleApiResponse: (result: apiResult) => void;
}