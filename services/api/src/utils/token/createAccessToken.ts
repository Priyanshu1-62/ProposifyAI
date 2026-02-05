import jwt from "jsonwebtoken";
import { accessTokenPayloadBody } from "../../types/tokenInterface/accessTokenPayloadBody";

export function createAccessToken(payload: accessTokenPayloadBody){
    try {
        return jwt.sign(
            payload,
            process.env.ACCESS_TOKEN_SECRET!,
            {
                expiresIn: "15m"
            }
        );
    } 
    catch (error) {
        throw error;
    }
}