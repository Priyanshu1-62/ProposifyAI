import { createContext } from "react";
import type { AlertContext } from "../Models/alertContext";

const alertContext = createContext<AlertContext | null>(null);

export default alertContext;