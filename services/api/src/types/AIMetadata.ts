export interface AIMetadata {
    aiModel: string;
    promptVersion: string;
    temperature: number;
    inputToken?: number;
    outputToken?: number;
}