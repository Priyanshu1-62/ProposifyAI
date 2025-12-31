
export function coerceTypes(currTestSubject: any, parTestSubject: any, key: any, currExpectedSchema: any){
    // Call this function only after validating shape of testSubject w.r.t expectedSchema.
    try {
        if(currExpectedSchema.type === "array"){
            for(let i=0; i<currTestSubject.length; i++){
                coerceTypes(currTestSubject[i], currTestSubject, i, currExpectedSchema.items);
            }
        }
        else if(currExpectedSchema.type === "object"){
            if(Array.isArray(currExpectedSchema.required)){
                for(const key of currExpectedSchema.required){
                    coerceTypes(currTestSubject[key], currTestSubject, key, currExpectedSchema.properties[key]);
                }
            }
            else{
                for(const key in currExpectedSchema.properties){
                    coerceTypes(currTestSubject[key], currTestSubject, key, currExpectedSchema.properties[key]);
                }
            }
        }
        else{
            if(currExpectedSchema.type === "number"){
                currTestSubject = Number(currTestSubject);
                parTestSubject[key] = currTestSubject;
            }
        }
    } 
    catch (error) {
        throw error;    
    }
}