
export async function promptBuilder(template: string, variables: Record<string, string>){
    try {
        let result = template;
        for(const key in variables){
            result = result.split(`{{${key}}}`).join(variables[key]);
        }
        return result;
    } 
    catch (error) {
        throw error;    
    }
}