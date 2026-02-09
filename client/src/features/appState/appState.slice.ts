import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AppState } from "../../Models/AppState";

const initialState: AppState = {
    isLoading: false
}

const appStateSlice = createSlice({
    name: "appState",
    initialState,
    reducers: {
        setLoading(state, action: PayloadAction<boolean>){
            state.isLoading = action.payload;
        }
    }
});

export const { setLoading } = appStateSlice.actions;
export default appStateSlice.reducer;