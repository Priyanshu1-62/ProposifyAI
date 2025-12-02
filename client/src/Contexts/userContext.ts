import { createContext } from "react";
import type { userModel } from "../Models/user";

const userContext = createContext<userModel | null>(null);

export default userContext;