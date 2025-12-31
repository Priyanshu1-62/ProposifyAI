import { normalizeWeights } from "./normalizeWeights";

export function normalizeOutput(testSubject: any, expectedSchema: any){
    // Call this function only after validating shape and coercing types of testSubject w.r.t expectedSchema.
    try {
        let totalWeight = 0;
        let wtItems = new Set<any>();
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
                    if(key === "weight" && parTestSubject){
                        totalWeight += Number(currTestSubject);
                        wtItems.add(parTestSubject);
                    }
                }
            } 
            catch (error) {
                throw error;    
            }
        }
        dfs(testSubject, null, null, expectedSchema);

        const sumConstraint = expectedSchema?.constraints?.sum;
        if(!sumConstraint){
            return;
        }

        if(totalWeight <= 0){
            throw new Error("Invalid weight distribution by AI service provider");
        }

        const EPSILON = 0.02;
        const target = sumConstraint.equals;
        const field = sumConstraint.field;
        if(Math.abs(totalWeight - target) <= EPSILON){
            return;
        }

        normalizeWeights(wtItems, field, totalWeight);
    }
    catch (error) {
        throw error;
    }
}