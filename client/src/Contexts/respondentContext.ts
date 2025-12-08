import { createContext } from "react";
import type { respondentModel } from "../Models/respondentContext";

const respondentContext = createContext<respondentModel | null>(null);

export default respondentContext;