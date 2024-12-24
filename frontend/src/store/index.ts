// src/store/index.ts
import { ThunkAction, Action, configureStore } from "@reduxjs/toolkit";
import themeReducer from "./themeSlice";
// Импортируйте другие редьюсеры
import authReducer from "./authSlice";
import userReducer from "./userSlice";
//import adminReducer from "./adminSlice";
import searchReducer from "./searchSlice";
import { useDispatch } from "react-redux";
const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    user: userReducer,
    search: searchReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export default store;
