import express from 'express';
import userRouter from './routes/userRoutes';
import transactionRouter from './routes/transactionRoutes';
import categoryRouter from './routes/categoryRoutes';
import config from './config/config';
import { verifyJWT } from './middlewares/authMiddleware';

const app = express();

app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/categories', verifyJWT, categoryRouter);

app.listen(config.port, () => {
  console.log(`APP running on port ${config.port}.`);
});
