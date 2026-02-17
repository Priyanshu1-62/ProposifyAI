import express from 'express';
import cors from "cors";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(cors({
  origin: [
    "http://localhost:3000",     
    "http://localhost:5173",     
    "https://www.proposifyai.online",    
  ],
  credentials: true  
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

import userRoutes from "./routes/user/routes";
import authRoutes from "./routes/auth/routes";
import requestRoutes from "./routes/request/routes";
import requestAnalysisRoutes from "./routes/requestAnalysis/routes";
import respondentRoutes from "./routes/respondent/routes";
import groupRoutes from "./routes/respondentGroup/routes";
import responseRoutes from "./routes/respondentResponse/routes";
import mailRoutes from "./routes/mail/routes";

app.use("/api/users", userRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/respondents", respondentRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/requestAnalysis", requestAnalysisRoutes);
app.use("/api/responses", responseRoutes);
app.use("/api/mails", mailRoutes);
app.use("/api/auth", authRoutes);


app.get('/', (req, res) => {
 return res.status(200).send('ProposifyAI API is Live...');
});

app.get("/health", (req, res) => {
  console.log("Health check log !!");
  return res.status(200).send("Server is awake and healthy !!");
});

export default app;