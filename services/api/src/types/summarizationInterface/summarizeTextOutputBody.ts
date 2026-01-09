import { AIMetadata } from "../aiInterface/AIMetadata";

export interface summarizeTextOutputBody {
    summary: string;
    metaData: AIMetadata;
}