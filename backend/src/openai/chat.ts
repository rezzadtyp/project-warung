import OpenAI from "openai";
import { Assistant } from "openai/resources/beta/assistants";
import { MessageDeltaEvent } from "openai/resources/beta/threads/messages";
import { Thread } from "openai/resources/beta/threads/threads";
import { ErrorObject } from "openai/resources/shared";
import { Socket } from "socket.io";
import { ChatService } from "../services/chat";

export const chat = async (
  thread: Thread,
  assistant: Assistant,
  question: string,
  socket: Socket,
  userId?: string,
  client: OpenAI = new OpenAI()
): Promise<void> => {
  try {
    let chatId: string | null = null;
    let isNewChat = false;

    if (userId) {
      const existingChat = await ChatService.getChatByThreadId(thread.id);
      if (existingChat) {
        chatId = existingChat.id;
      } else {
        // Create new chat
        const generatedTitle = await ChatService.generateChatTitle(
          question,
          client
        );
        const newChat = await ChatService.createChat({
          userId,
          openaiThreadId: thread.id,
          title: generatedTitle,
        });
        chatId = newChat.id;
        isNewChat = true;

        socket.emit("chat_title", generatedTitle);
        socket.emit("chat_id", newChat.id);
      }
    }

    await client.beta.threads.messages.create(thread.id, {
      role: "user",
      content: question,
    });

    if (chatId) {
      await ChatService.addMessage({
        chatId,
        role: "user",
        content: question,
      });
    }

    const stream = client.beta.threads.runs.stream(thread.id, {
      assistant_id: assistant.id,
    });

    let assistantResponse = "";

    stream.on("event", async (e) => {
      const event = e.event as string;
      const data = e.data;

      switch (event) {
        case "thread.message.delta": {
          const text = (data as MessageDeltaEvent).delta;

          if (
            text.content &&
            text.content[0] &&
            "text" in text.content[0] &&
            text.content[0].text?.value
          ) {
            assistantResponse += text.content[0].text.value;
          }

          socket.emit("bot_chunk", text);
          break;
        }

        case "thread.run.completed": {
          if (chatId && assistantResponse) {
            await ChatService.addMessage({
              chatId,
              role: "assistant",
              content: assistantResponse,
            });
          }

          socket.emit("bot_end", {
            chatId,
            isNewChat,
            message: "Response completed",
          });
          break;
        }

        case "thread.message.error": {
          const errorMsg = (data as ErrorObject).message || "Unknown error";
          socket.emit("bot_error", errorMsg);
          break;
        }

        default:
          break;
      }
    });

    stream.on("error", (err) => {
      socket.emit("bot_error", err.message);
    });

    stream.on("end", () => {
      console.log("Stream ended");
    });
  } catch (error) {
    console.error("Error in chat", error);
    socket.emit(
      "bot_error",
      error instanceof Error ? error.message : String(error)
    );
  }
};
