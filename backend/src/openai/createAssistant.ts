import OpenAI from "openai";
import { Assistant } from "openai/resources/beta/assistants";

import { assistantPrompt } from "../utils/prompt";
import { tools } from "./tools/allTools";

export async function createAssistant(client: OpenAI): Promise<Assistant> {
  return await client.beta.assistants.create({
    model: "gpt-4o",
    name: "Ellara",
    instructions: assistantPrompt,
    tools: Object.values(tools).map((tool) => tool.definition),
  });
}
