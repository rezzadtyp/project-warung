import { NextFunction, Request, Response } from "express";
import { createTxService } from "../services/transaction/create-tx.service";
import { getTxsService } from "../services/transaction/get-txs.service";
import { updateTxService } from "../services/transaction/update-tx.service";

export const createTx = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { amount, type } = req.body;
    const userId = req.user.id;

    const result = await createTxService(userId, amount, type);

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const getTxs = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = {
      take: parseInt(req.query.take as string) || 10,
      page: parseInt(req.query.page as string) || 1,
      sortBy: (req.query.sortBy as string) || "createdAt",
      sortOrder: (req.query.sortOrder as string) || "desc",
      search: (req.query.search as string) || "",
    };

    const result = await getTxsService(req.user.id, query);

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const updateTx = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const txId = req.params.txId;
    const { status, txHash } = req.body;
    const userId = req.user.id;

    const result = await updateTxService(userId, txId, status, txHash);

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
