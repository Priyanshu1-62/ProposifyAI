import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());

// default test route
app.get('/', (req, res) => {
  res.send('ProposifyAI API running...');
});

export default app;