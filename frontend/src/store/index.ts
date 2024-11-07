// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./themeSlice";
// Импортируйте другие редьюсеры
import authReducer from "./authSlice";
import userReducer from "./userSlice";
import adminReducer from "./adminSlice";
import searchReducer from "./searchSlice";
const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    user: userReducer,
    admin: adminReducer,
    search: searchReducer,
    // Добавьте другие редьюсеры
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
