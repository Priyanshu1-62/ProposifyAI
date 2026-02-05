import jwt from "jsonwebtoken";
import { accessTokenPayloadBody } from "../../types/tokenInterface/accessTokenPayloadBody";

export function verifyAccessToken(token: string){
    try {
        const payload = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET!
        );
        return payload as accessTokenPayloadBody;
    } 
    catch (error) {
        throw error;
    }
}