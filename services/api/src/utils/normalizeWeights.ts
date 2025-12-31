
export function normalizeWeights(items: Set<any>, field: string, totalWeight: number){
    try {
        for(const item of items){
            item[field] = item[field] / totalWeight;
        }
    } 
    catch (error) {
        throw error;
    }
}