import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchAndSetUserInfo } from "./userSlice";
import { AppDispatch, AppThunk } from ".";
import AuthState from "./authSlice.type";
import { clearUser } from "./userSlice";
//import { setTheme, ThemeType } from "./themeSlice";

const initialState: AuthState = {
  isAuthenticated: localStorage.getItem("accessToken") !== null,
  token: localStorage.getItem("accessToken"),
  loading: false,
  error: null
};

export const relogin = (): AppThunk => async (dispatch) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    dispatch(vkAuthSuccess({ token }));
    //const state = store.getState();
    //const userTheme = state.user.theme as ThemeType;
    //dispatch(setTheme(userTheme));
    await dispatch(fetchAndSetUserInfo());
    //const state2 = store.getState();
    //const userTheme2 = state2.user.theme as ThemeType;
    //dispatch(setTheme(userTheme2));
  }
};

export const login = createAsyncThunk<
  { accessToken: string },
  { username: string; password: string },
  { dispatch: AppDispatch }
>("auth/login", async (data, { dispatch, rejectWithValue }) => {
  try {
    await dispatch(clearUser());

    const response = await fetch(`/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });

    if (!response.ok) throw new Error("Ошибка авторизации");

    const responseData = await response.json();
    const { access_token: accessToken, access_expires_at: accessExpiresAt } =
      responseData;

    if (accessToken && accessExpiresAt) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("accessTokenExpirationTime", accessExpiresAt);

      await dispatch(fetchAndSetUserInfo());
      await dispatch(relogin());
      //const state = store.getState();
      //const userTheme = state.user.theme as ThemeType;
      //dispatch(setTheme(userTheme));
      return { accessToken };
    } else {
      throw new Error("Недостаточно данных в ответе от сервера");
    }
  } catch (error) {
    console.log(error);
    return rejectWithValue("Ошибка авторизации");
  }
  
});

export const register = createAsyncThunk<
  { userId: number }, // Ожидаемый тип успешного результата
  { username: string; password: string; first_name: string; last_name: string }, // Тип входных данных
  { rejectValue: string } // Тип значения при ошибке
>("auth/register", async (data, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Ошибка регистрации");
    }

    const responseData = await response.json();
    return { userId: responseData.user_id };
  } catch (error) {
    let errorMessage = "Неизвестная ошибка";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return rejectWithValue(errorMessage);
  }
});
// Асинхронный thunk для выхода
export const logoutUser = (): AppThunk => async (dispatch) => {
  try {
    await fetch(`/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    localStorage.removeItem("accessToken");
    localStorage.removeItem("accessTokenExpirationTime");

    dispatch(authSlice.actions.logout());
    dispatch(clearUser());
  } catch (error) {
    console.error("Ошибка выхода:", error);
  }
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
      state.token = null;
    },
    vkAuthSuccess(state, action: PayloadAction<{ token: string }>) {
      state.loading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
    },
  },
  extraReducers: (builder) => {
    builder
      // Регистрация
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<{ accessToken: string }>) => {
          state.loading = false;
          state.isAuthenticated = true;
          state.token = action.payload.accessToken;
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, vkAuthSuccess } = authSlice.actions;
export default authSlice.reducer;
