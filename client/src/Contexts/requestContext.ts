import { createContext } from "react";
import type { requestModel } from "../Models/requestContext";

const requestContext = createContext<requestModel | null>(null);

export default requestContext;