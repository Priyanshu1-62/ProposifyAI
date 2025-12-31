
export function validateShape(testSubject: any, expectedSchema: any): boolean{
    try {
        if(testSubject === undefined || expectedSchema === undefined){
            return false;
        }
        if(expectedSchema.type === "array"){
            if(!Array.isArray(testSubject)){
                return false;
            }
            let res = true;
            for(const element of testSubject){
                res = res && validateShape(element, expectedSchema.items);
            }
            return res;
        }
        if(expectedSchema.type === "object"){
            if((typeof testSubject !== "object") || testSubject === null || Array.isArray(testSubject)){
                return false;
            }
            let res = true;
            if(Array.isArray(expectedSchema.required)){
                for(const key of expectedSchema.required){
                    if(!(key in testSubject)){
                        return false;
                    }
                    res = res && validateShape(testSubject[key], expectedSchema.properties[key]);                    
                }
            }
            else{
                for(const key in expectedSchema.properties){
                    if(!(key in testSubject)){
                        return false;
                    }
                    res = res && validateShape(testSubject[key], expectedSchema.properties[key]);                    
                }
            }
            return res;
        }
        if(expectedSchema.type === "number"){
            return !isNaN(Number(testSubject));
        }
        return typeof testSubject === expectedSchema.type;
    } 
    catch (error) {
        throw error;    
    }
}