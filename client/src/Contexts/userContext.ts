import { createContext } from "react";
import type { userModel } from "../Models/userContext";

const userContext = createContext<userModel | null>(null);

export default userContext;