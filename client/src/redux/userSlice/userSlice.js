import { createSlice } from "@reduxjs/toolkit";

const intialState = {
    user: null,
    loading: false,
    error: null,
    };

const userSlice = createSlice({
    name: "user",
    initialState: intialState,
    reducers: {
        signInStart: (state) => {

            state.loading = true;
            state.error = null;
        },
        signInSuccess: (state, action) => {
           
            state.user = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateUserStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        updateUserSuccess: (state, action) => {
            state.user = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateUserFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteUserStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        deleteUserSuccess: (state, action) => {
            state.user = null;
            state.loading = false;
            state.error = null;
        },
        deleteUserFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    }
});

export const { signInStart, signInSuccess, signInFail,updateUserFail,updateUserSuccess,updateUserStart,deleteUserFail,deleteUserStart,deleteUserSuccess } = userSlice.actions;

export default userSlice.reducer;

     