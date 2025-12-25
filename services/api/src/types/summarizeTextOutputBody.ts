import { AIMetadata } from "./AIMetadata";

export interface summarizeTextOutputBody {
    summary: string;
    metaData: AIMetadata;
}