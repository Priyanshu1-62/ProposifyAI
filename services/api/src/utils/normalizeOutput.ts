import { normalizeWeights } from "./normalizeWeights";

export function normalizeOutput(testSubject: any, expectedSchema: any){
    try {
        let totalWeight = 0;
        let wtItems: any[] = [];
        function dfs(currTestSubject: any, parTestSubject: any, key: any, currExpectedSchema: any){
            try {
                if(currExpectedSchema.type === "array"){
                    for(let i=0; i<currTestSubject.length; i++){
                        dfs(currTestSubject[i], currTestSubject, i, currExpectedSchema.items);
                    }
                }
                else if(currExpectedSchema.type === "object"){
                    if(Array.isArray(currExpectedSchema.required)){
                        for(const key of currExpectedSchema.required){
                            dfs(currTestSubject[key], currTestSubject, key, currExpectedSchema.properties[key]);
                        }
                    }
                    else{
                        for(const key in currExpectedSchema.properties){
                            dfs(currTestSubject[key], currTestSubject, key, currExpectedSchema.properties[key]);
                        }
                    }                    
                }
                else{
                    if(key === "weight"){
                        totalWeight += currTestSubject;
                        wtItems.push(parTestSubject);
                    }
                }
            } 
            catch (error) {
                throw error;    
            }
        }

        dfs(testSubject, {}, "", expectedSchema);
        if(totalWeight === 0){
            throw new Error("Invalid weight distribution by AI service provider");
        }

        normalizeWeights(wtItems, "weight", totalWeight);
    }
    catch (error) {
        throw error;
    }
}