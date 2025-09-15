import { PrismaClient } from '@prisma/client';
import adjustBalance from './adjustBalance';

const db = new PrismaClient().$extends({
  /**
   * 🚦 Transaction Middleware
   *
   * This middleware ensures wallet balances always stay in sync
   * whenever a Transaction is created, updated, or deleted.
   *
   * Responsibilities:
   * - On create → apply new transaction effect
   * - On update → reverse old effect, apply new effect
   * - On delete → reverse old effect
   *
   * This way, service functions (createTransaction, editTransaction, deleteTransaction)
   * don’t need to manually adjust wallet balances.
   */
  name: 'transaction-balance-sync',
  query: {
    transaction: {
      async create({ args, query }) {
        // Perform the create query
        const result = await query(args);

        // After create: side effect, adjust wallet
        const wallet = await db.wallet.findUniqueOrThrow({
          where: { id: result.walletId },
        });

        const category = await db.category.findUniqueOrThrow({
          where: { id: result.category?.id },
        });

        const newBalance = adjustBalance({
          balance: Number(wallet.balance),
          amount: Number(result.amount),
          type: category.type,
          isRefund: result.isRefund,
        });

        await db.wallet.update({
          where: { id: result.walletId },
          data: { balance: newBalance },
        });

        return result;
      },

      async update({ args, query }) {
        // Before updating: fetch old transaction
        const oldTx = await db.transaction.findUniqueOrThrow({
          where: { id: args.where.id },
          include: { category: true },
        });

        const result = await query(args);

        // After update: apply balance adjustments
        const wallet = await db.wallet.findUniqueOrThrow({
          where: { id: oldTx.walletId },
        });

        const newCategory = await db.category.findUniqueOrThrow({
          where: { id: result.category?.id },
        });

        let balance = Number(wallet.balance);

        if (
          oldTx.category.type !== newCategory.type ||
          Number(oldTx.amount) !== Number(result.amount) ||
          oldTx.isRefund !== result.isRefund
        ) {
          // reverse old effect
          balance = adjustBalance({
            balance,
            amount: Number(oldTx.amount),
            type: oldTx.category.type,
            isRefund: oldTx.isRefund,
            reverse: true,
          });

          // apply new effect
          balance = adjustBalance({
            balance,
            amount: Number(result.amount),
            type: newCategory.type,
            isRefund: result.isRefund,
          });

          await db.wallet.update({
            where: { id: wallet.id },
            data: { balance },
          });
        }

        return result;
      },

      async delete({ args, query }) {
        // Before delete: fetch old transaction
        const oldTx = await db.transaction.findUniqueOrThrow({
          where: { id: args.where.id },
          include: { category: true },
        });

        const result = await query(args);

        // After delete: reverse effect
        const wallet = await db.wallet.findUniqueOrThrow({
          where: { id: oldTx.walletId },
        });

        const balance = adjustBalance({
          balance: Number(wallet.balance),
          amount: Number(oldTx.amount),
          type: oldTx.category.type,
          isRefund: oldTx.isRefund,
          reverse: true,
        });

        await db.wallet.update({
          where: { id: wallet.id },
          data: { balance },
        });

        return result;
      },
    },
  },
});

export default db;
