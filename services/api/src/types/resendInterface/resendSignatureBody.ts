export interface resendSignatureBody {
    secret: string;
    timeStamp: string;
    signature: string;
    toleranceSeconds: number;
}