// src/store/userSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import {
  deleteUserPhoto,
  fetchUserInfo,
  updateUser,
  uploadUserPhoto,
} from "../services/userService";
import { AppThunk, RootState } from ".";
//import { format, parseISO } from "date-fns";
export interface Interest {
  id: number;
  name: string;
  color: string;
  textColor: string;
}

interface UserState {
  id: number | null;
  email: string;
  firstName: string;
  lastName: string;
  birthDate: Date | null;
  gender: string;
  city: string;
  job: string;
  education: string;
  aboutMe: string;
  selectedInterests: number[];
  photos: string[];
  telegramId: string;
}

const initialState: UserState = {
  id: null,
  email: "",
  firstName: "",
  lastName: "",
  birthDate: null,
  gender: "",
  city: "",
  job: "",
  telegramId: "",
  education: "",
  aboutMe: "",
  selectedInterests: [],
  photos: [],
};

export const fetchAndSetUserInfo = createAsyncThunk(
  "user/fetchUserInfo",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchUserInfo();
      return {
        ...response,
        selectedInterests: response.selectedInterests || [],
        photos: response.photos || [],
      };
    } catch {
      return rejectWithValue("Failed to fetch user data");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateTelegramId(state, action: PayloadAction<string>) {
      state.telegramId = action.payload;
    },
    updateEmail(state, action: PayloadAction<string>) {
      state.email = action.payload;
    },
    updateFirstName(state, action: PayloadAction<string>) {
      state.firstName = action.payload;
    },
    updateLastName(state, action: PayloadAction<string>) {
      state.lastName = action.payload;
    },
    updateBirthDate(state, action: PayloadAction<Date | null>) {
      state.birthDate = action.payload;
    },
    updateGender(state, action: PayloadAction<string>) {
      state.gender = action.payload;
    },
    updateCity(state, action: PayloadAction<string>) {
      state.city = action.payload;
    },
    updateJob(state, action: PayloadAction<string>) {
      state.job = action.payload;
    },
    updateEducation(state, action: PayloadAction<string>) {
      state.education = action.payload;
    },
    setAboutMe(state, action: PayloadAction<string>) {
      state.aboutMe = action.payload;
    },
    setSelectedInterests(state, action: PayloadAction<number[]>) {
      state.selectedInterests = action.payload;
    },
    addPhoto(state, action: PayloadAction<string>) {
      state.photos.push(action.payload);
    },
    deletePhoto(state, action: PayloadAction<number>) {
      state.photos.splice(action.payload, 1);
    },
    setUserProfile(state, action: PayloadAction<UserState>) {
      return { ...state, ...action.payload }; // Обновляем все поля профиля
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAndSetUserInfo.fulfilled, (state, action) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.birthDate = action.payload.birthDate;
      state.gender = action.payload.gender;
      state.city = action.payload.city;
      state.job = action.payload.job;
      state.education = action.payload.education;
      state.aboutMe = action.payload.aboutMe;
      state.selectedInterests = action.payload.selectedInterests;
      state.photos = action.payload.photos;
      state.telegramId = action.payload.telegramId;
    });
  },
});

export const saveUserProfile = (): AppThunk => async (_dispatch, getState) => {
  const state = getState() as RootState;
  const { userId } = state.auth;

  if (userId !== null) {
    const userState = state.user;
    try {
      await updateUser(userId, {
        email: userState.email,
        first_name: userState.firstName,
        last_name: userState.lastName,
        birth_date: userState.birthDate,
        gender: userState.gender,
        city: userState.city,
        job: userState.job,
        education: userState.education,
        about_me: userState.aboutMe,
        telegram_id: userState.telegramId,
        selected_interests: userState.selectedInterests,
        photos: userState.photos,
      });
      console.log("Профиль пользователя успешно обновлен");
    } catch (error) {
      console.error("Ошибка при обновлении профиля:", error);
    }
  }
};

export const uploadPhoto =
  (file: File): AppThunk =>
  async (dispatch, getState) => {
    const userId = (getState() as RootState).auth.userId;

    if (userId !== null) {
      try {
        const photoUrl = await uploadUserPhoto(file, userId);
        if (photoUrl) {
          dispatch(addPhoto(photoUrl));
        } else {
          console.error("Лицо на фото не обнаружено, загрузка отменена.");
          alert("Лицо на фото не обнаружено, загрузка отменена.");
        }
      } catch (error) {
        console.error("Ошибка загрузки фото:", error);
      }
    }
  };

export const removePhoto =
  (index: number, photoUrl: string): AppThunk =>
  async (dispatch, getState) => {
    const userId = (getState() as RootState).auth.userId;

    if (userId !== null) {
      const filename = photoUrl.split("/").pop();
      try {
        await deleteUserPhoto(userId, filename!);
        dispatch(deletePhoto(index));
      } catch (error) {
        console.error("Ошибка удаления фотографии:", error);
      }
    }
  };

export const {
  setUserProfile,
  updateEmail,
  updateFirstName,
  updateLastName,
  updateTelegramId,
  updateBirthDate,
  updateGender,
  updateCity,
  updateJob,
  updateEducation,
  setAboutMe,
  setSelectedInterests,
  addPhoto,
  deletePhoto,
} = userSlice.actions;

export default userSlice.reducer;
