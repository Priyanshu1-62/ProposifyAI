import { oAuthUserIdentity } from "../../types/oAuthInterface/oAuthUserIdentity";
import { oAuthUserProfileBody } from "../../types/oAuthInterface/oAuthUserProfileBody";
import { createUserBody } from "../../types/userInterface/createUserBody";
import { createOAuthUserProfile } from "../oAuthService/oAuth.createOAuthUserProfile";
import { getOAuthUserProfile } from "../oAuthService/oAuth.getOAuthUserProile";
import { createUser } from "../userService/userService.createUser";
import { getUserByEmail } from "../userService/userService.getUserByEmail";

export async function authenticateOAuthUserIdentity(oauthUserIdentity: oAuthUserIdentity){
    try {
        let existingOAuthUser = await getOAuthUserProfile(oauthUserIdentity.provider, oauthUserIdentity.providerUserId);

        if(!existingOAuthUser){
            // TODO: Wrap this in one transaction
            const userData: createUserBody = {
                name: oauthUserIdentity.name,
                email: oauthUserIdentity.email
            }

            const oAuthUserData: oAuthUserProfileBody = {
                provider: oauthUserIdentity.provider,
                providerUserId: oauthUserIdentity.providerUserId,
                userId: ""
            }

            if(userData.email){
                const existingUser = await getUserByEmail(userData.email);

                if(existingUser){
                    oAuthUserData.userId = existingUser.id;
                }
            }

            if(oAuthUserData.userId === ""){
                const newUser = await createUser(userData);
                oAuthUserData.userId = newUser.id;
            }

            existingOAuthUser = await createOAuthUserProfile(oAuthUserData);
        }

        return existingOAuthUser;
    } 
    catch (error) {
        throw error;
    }
}