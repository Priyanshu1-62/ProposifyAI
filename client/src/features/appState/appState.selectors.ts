import type { RootState } from "../../app/store";

export const selectIsLoading = (state: RootState) => {
    return state.appState.isLoading;
}