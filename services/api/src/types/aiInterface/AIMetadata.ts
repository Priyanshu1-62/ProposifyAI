export interface AIMetadata {
    aiModel: string;
    promptVersion: number;
    temperature: number;
    inputToken?: number;
    outputToken?: number;
}