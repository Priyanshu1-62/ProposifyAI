import crypto from "crypto";

export const createCryptoHash = (str: string) => {
    return crypto
        .createHash("sha256")
        .update(str)
        .digest("hex");
}