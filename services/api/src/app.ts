import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());

import userRoutes from "./routes/user/routes";
import groupRoutes from "./routes/respondent-group/routes";
import respondentRoutes from "./routes/respondent/routes";
import requestRoutes from "./routes/request/routes";
import responseRoutes from "./routes/respondent-response/routes";

app.use("/api/users", userRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/respondents", respondentRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/responses", responseRoutes);


app.get('/', (req, res) => {
  res.send('ProposifyAI API is Live...');
});

export default app;