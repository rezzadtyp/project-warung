import { NextFunction, Request, Response } from "express";
import { settleOrderService } from "../services/settlement/settle-order.service";

export const settleOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { beneficiary, orderHash } = req.body;

    if (!beneficiary || !orderHash) {
      return res.status(400).send({
        success: false,
        message: "beneficiary and orderHash are required",
      });
    }

    const result = await settleOrderService({
      beneficiary: beneficiary as `0x${string}`,
      orderHash: orderHash as `0x${string}`,
    });

    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

