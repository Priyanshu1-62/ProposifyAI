import fs from "node:fs";
import path from "node:path";

const base = __dirname;

export const systemPromptV1: string = fs.readFileSync(path.join(base, "systemPrompt.v1.txt"), "utf-8");

export const userPromptTemplateV1: string = fs.readFileSync(path.join(base, "userPromptTemplate.v1.txt"), "utf-8");

