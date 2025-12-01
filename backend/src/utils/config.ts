import dotenv from "dotenv";

dotenv.config();

export const appConfig = {
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
};
