import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchInterests } from "../services/fetchInterests";
import { RootState } from ".";
import { fetchUsersRecommendation } from "./fetchUsersRec";

export interface Interest {
  name: string;
  color: string;
  textColor: string;
}
export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  age: number;
  city: string;
  job: string;
  education: string;
  aboutMe: string;
  photos: string[];
  interests: Interest[];
}

interface SearchState {
  users: User[];
  currentIndex: number;
  isLoading: boolean;
}

const initialState: SearchState = {
  users: [],
  currentIndex: 0,
  isLoading: false,
};

export const fetchUsers = createAsyncThunk<User[], void>(
  "search/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const users = await fetchUsersRecommendation();
      return users;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchUserInterests = createAsyncThunk<
  void,
  { userId: number; index: number }
>(
  "search/fetchUserInterests",
  async ({ userId, index }, { dispatch, rejectWithValue }) => {
    try {
      const interests = await fetchInterests(userId);
      dispatch(setUserInterests({ interests, index }));
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Слайс для работы с поиском
const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    nextUser(state) {
      if (state.users.length > 0) {
        state.users.splice(state.currentIndex, 1);

        if (state.users.length > 0) {
          state.currentIndex =
            state.currentIndex >= state.users.length
              ? 0
              : state.currentIndex;
        } else {
          state.currentIndex = 0;
        }
      }
    },
    setUserInterests(
      state,
      action: PayloadAction<{ interests: Interest[]; index: number }>
    ) {
      const { interests, index } = action.payload;
      if (state.users[index]) {
        state.users[index].interests = interests;
      }
    },
    resetUsers(state) {
      state.users = [];
      state.currentIndex = 0;
    },
    reverseUsers(state) {
      state.users.reverse(); 
      state.currentIndex = 0; // Сбрасываем индекс на первый элемент
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchUserInterests.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserInterests.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(fetchUserInterests.rejected, (state) => {
        state.isLoading = false;
      });
  },
});


export const { nextUser, setUserInterests, resetUsers, reverseUsers } =
  searchSlice.actions;

export const selectSearchState = (state: RootState) => state.search;

export default searchSlice.reducer;
