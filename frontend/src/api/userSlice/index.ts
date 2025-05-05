import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    userId: number | null;
}

const initialState = { userId: null } as UserState;

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserId: (state, action: PayloadAction<number>) => {
            state.userId = action.payload;
        },
    },
});

export const { setUserId } = userSlice.actions;
export default userSlice.reducer;
