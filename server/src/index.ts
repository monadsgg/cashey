import express from 'express';
import cors from 'cors';
import userRouter from './routes/userRoutes';
import transactionRouter from './routes/transactionRoutes';
import categoryRouter from './routes/categoryRoutes';
import accountRouter from './routes/accountRoutes';
import budgetRouter from './routes/budgetRoutes';
import walletRouter from './routes/walletRoutes';
import tagRouter from './routes/tagRoutes';
import payeeRouter from './routes/payeeRoutes';
import reportRouter from './routes/reportRoutes';
import config from './config/config';
import { verifyJWT } from './middlewares/authMiddleware';

const app = express();
app.use(cors());

app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/categories', verifyJWT, categoryRouter);
app.use('/api/transactions', verifyJWT, transactionRouter);
app.use('/api/accounts', verifyJWT, accountRouter);
app.use('/api/budgets', verifyJWT, budgetRouter);
app.use('/api/wallets', verifyJWT, walletRouter);
app.use('/api/tags', verifyJWT, tagRouter);
app.use('/api/payees', verifyJWT, payeeRouter);
app.use('/api/reports', verifyJWT, reportRouter);

app.listen(config.port, () => {
  console.log(`APP running on port ${config.port}.`);
});
