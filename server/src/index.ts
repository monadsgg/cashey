import express from 'express';
import cors from 'cors';
import userRouter from './routes/userRoutes';
import transactionRouter from './routes/transactionRoutes';
import categoryRouter from './routes/categoryRoutes';
import savingAccountRouter from './routes/savingAccountRoutes';
import budgetRouter from './routes/budgetRoutes';
import walletRouter from './routes/walletRoutes';
import config from './config/config';
import { verifyJWT } from './middlewares/authMiddleware';

const app = express();
app.use(cors());

app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/categories', verifyJWT, categoryRouter);
app.use('/api/transactions', verifyJWT, transactionRouter);
app.use('/api/savings', verifyJWT, savingAccountRouter);
app.use('/api/budgets', verifyJWT, budgetRouter);
app.use('/api/wallets', verifyJWT, walletRouter);

app.listen(config.port, () => {
  console.log(`APP running on port ${config.port}.`);
});
