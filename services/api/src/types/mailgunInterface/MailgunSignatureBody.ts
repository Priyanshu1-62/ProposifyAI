export interface MailgunSignatureBody {
    timestamp?: string | number;
    token?: string;
    signature?: string;
    apiKey: string;
    toleranceSeconds: number;
}