import express from 'express';
import cors from "cors";
import dotenv from 'dotenv';

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

import userRoutes from "./routes/user/routes";
import groupRoutes from "./routes/respondent-group/routes";
import respondentRoutes from "./routes/respondent/routes";
import requestRoutes from "./routes/request/routes";
import responseRoutes from "./routes/respondent-response/routes";
import mailRoutes from "./routes/mail/routes";

app.use("/api/users", userRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/respondents", respondentRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/responses", responseRoutes);
app.use("/api/mails", mailRoutes);


app.get('/', (req, res) => {
  res.send('ProposifyAI API is Live...');
});

export default app;