// src/store/searchSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Interest {
  name: string;
  color: string;
  textColor: string;
}

export interface User {
  name: string;
  age: number;
  city: string;
  education: string;
  photos: string[];
  interests: Interest[];
  aboutMe: string;
}

interface SearchState {
  users: User[];
  currentIndex: number;
}

const initialState: SearchState = {
  users: [], // Пользователи будут загружаться из JSON
  currentIndex: 0,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<User[]>) {
      state.users = action.payload;
    },
    nextUser(state) {
      state.currentIndex = (state.currentIndex + 1) % state.users.length;
    },
    prevUser(state) {
      state.currentIndex =
        (state.currentIndex - 1 + state.users.length) % state.users.length;
    },
  },
});

export const { setUsers, nextUser, prevUser } = searchSlice.actions;
export default searchSlice.reducer;
