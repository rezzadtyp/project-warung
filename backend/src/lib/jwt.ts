import { NextFunction, Request, Response } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { appConfig } from "../utils/config";

const secretKey = appConfig.jwtSecret!;

interface PayloadToken {
  id: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user: PayloadToken;
    }
  }
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).send({
      message: "Authentication failed, token is missing",
    });
  }

  jwt.verify(token, secretKey, (err, payload) => {
    if (err) {
      if (err instanceof TokenExpiredError) {
        return res.status(403).send({
          message: "Token expired",
        });
      } else {
        return res.status(403).send({
          message: "Invalid Token",
        });
      }
    }

    req.user = payload as PayloadToken;

    next();
  });
};
