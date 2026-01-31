import crypto from "crypto";

export const createRandomCryptoString = ()  => {
    return crypto.randomBytes(64).toString("hex");
}