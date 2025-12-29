
export function validateShape(testSubject: any, expectedSchema: any): boolean{
    try {
        if(expectedSchema.type === "array"){
            if(!Array.isArray(testSubject)){
                return false;
            }
            let res = true;
            for(const element of testSubject){
                res = res || validateShape(element, expectedSchema.items);
            }
            return res;
        }
        if(expectedSchema.type === "object"){
            if(typeof testSubject !== "object"){
                return false;
            }
            let res = true;
            for(const expectedKeys in expectedSchema.properties){
                if(!(expectedKeys in testSubject)){
                    return false;
                }
                res = res || validateShape(testSubject[expectedKeys], expectedSchema.properties[expectedKeys]);
            }
            return res;
        }
        if(typeof testSubject !== expectedSchema.type){
            return false;
        }
        return true;
    } 
    catch (error) {
        throw error;    
    }
}