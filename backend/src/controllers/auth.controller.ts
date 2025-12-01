import { NextFunction, Request, Response } from "express";
import { meService } from "../services/auth/me";

export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await meService(req.body.publicKey);

    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
};
