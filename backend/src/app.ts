import cors from "cors";
import express, {
  NextFunction,
  Request,
  Response,
  json,
  urlencoded,
} from "express";
import http from "http";
import OpenAI from "openai";
import { Server } from "socket.io";
import { createAssistant } from "./openai/createAssistant";
import { ChatService } from "./services/chat";
import { createThread } from "./openai/createThread";
import { chat } from "./openai/chat";

import chatRouter from "./routers/chat.router";
import authRouter from "./routers/auth.router";
import txRouter from "./routers/tx.router";

const app = express();
export const server = http.createServer(app);

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

app.get("/health", (req: Request, res: Response) => {
  res.send({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    cpuUsage: process.cpuUsage(),
  });
});
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/tx", txRouter);

io.on("connection", (socket) => {
  socket.on("message", async (message) => {
    try {
      let parsedMessage;

      if (typeof message === "string") {
        parsedMessage = JSON.parse(message);
      } else if (typeof message === "object" && message !== null) {
        parsedMessage = message;
      } else {
        throw new Error("Message must be a valid string or object");
      }

      if (!parsedMessage.question && !parsedMessage.userId) {
        throw new Error("Question and userId are required");
      }

      const client = new OpenAI();
      const assistant = await createAssistant(client);

      let thread;
      if (parsedMessage.chatId) {
        const existingChat = await ChatService.getChat(
          parsedMessage.chatId,
          parsedMessage.userId
        );
        if (existingChat) {
          thread = { id: existingChat.openaiThreadId } as any;
        } else {
          throw new Error("Chat not found");
        }
      } else {
        thread = await createThread(client);
      }

      await chat(
        thread,
        assistant,
        parsedMessage.question,
        socket,
        parsedMessage.userId,
        client
      );
    } catch (error) {
      console.log("Error handling message", error);
      socket.emit("bot_error", `Error: ${error}`);
    }
  });
});

io.engine.on("connection_error", (err) => {
  console.log(
    "🔥 Connection error:",
    err.req,
    err.code,
    err.message,
    err.context
  );
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  res.status(400).send({ message: err.message });
});

export default app;
