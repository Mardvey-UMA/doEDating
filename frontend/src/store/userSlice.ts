import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Interest {
  name: string;
  color: string;
  textColor: string;
}

interface UserState {
  email: string;
  firstName: string;
  lastName: string;
  birthDate: Date | null;
  gender: string;
  city: string;
  job: string;
  education: string;
  aboutMe: string;
  selectedInterests: Interest[];
  photos: string[];
  // Другие поля состояния пользователя
}

const initialState: UserState = {
  email: "",
  firstName: "",
  lastName: "",
  birthDate: null,
  gender: "",
  city: "",
  job: "",
  education: "",
  aboutMe: "",
  selectedInterests: [],
  photos: [],
  // Инициализация других полей
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
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
    setSelectedInterests(state, action: PayloadAction<Interest[]>) {
      state.selectedInterests = action.payload;
    },
    addPhoto(state, action: PayloadAction<string>) {
      state.photos.push(action.payload);
    },
    deletePhoto(state, action: PayloadAction<number>) {
      state.photos.splice(action.payload, 1);
    },
    // Другие редьюсеры
  },
});

export const {
  updateEmail,
  updateFirstName,
  updateLastName,
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
