import express from 'express';
import userRouter from './routes/userRoutes';
import config from './config/config';

const app = express();

app.use(express.json());

app.use('/api/users', userRouter);

app.listen(config.port, () => {
  console.log(`APP running on port ${config.port}.`);
});
