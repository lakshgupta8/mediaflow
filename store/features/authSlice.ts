import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
    id: string;
    name: string;
    email: string;
}

export interface AuthState {
    isAuthenticated: boolean;
    /** True until the first session check against Appwrite has completed. */
    isLoading: boolean;
    user: User | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    isLoading: true,
    user: null,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<User>) => {
            state.isAuthenticated = true;
            state.isLoading = false;
            state.user = action.payload;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.isLoading = false;
            state.user = null;
        },
    },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
