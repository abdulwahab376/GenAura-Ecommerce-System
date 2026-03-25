import { createSlice } from '@reduxjs/toolkit';

// Load from sessionStorage instead of localStorage
const loadUserFromSessionStorage = () => {
    try {
        const serializedState = sessionStorage.getItem('user');
        if (serializedState === null) return { user: null };
        return { user: JSON.parse(serializedState) };
    } catch (err) {
        return { user: null };
    }
};

const initialState = loadUserFromSessionStorage();

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload.user;
            sessionStorage.setItem('user', JSON.stringify(state.user));
        },
        logout: (state) => {
            state.user = null;
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('token');
        },
    },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;