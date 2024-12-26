import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchInterests } from "../services/fetchInterests";
import { RootState, AppDispatch } from ".";
import { fetchUsersRecommendation } from "./fetchUsersRec";
import { fetchWithToken } from "../services/fetchService";

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

// export const fetchUsers = createAsyncThunk<
//   User[], 
//   void, 
//   { state: RootState; dispatch: AppDispatch }
// >(
//   "search/fetchUsers",
//   async (_, { rejectWithValue, dispatch }) => {
//     try {
//       const users = await fetchUsersRecommendation(dispatch);
//       return users;
//     } catch (error) {
//       return rejectWithValue(error);
//     }
//   }
// );


export const startRecommendation = createAsyncThunk<
  void,
  void,
  { state: RootState; dispatch: AppDispatch }
>(
  "search/startRecommendation",
  async (_, { rejectWithValue }) => {
    try {
      await fetchWithToken("/api/recommendation", {
        method: "POST"
      });
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);


export const fetchUsers = createAsyncThunk<
  User[], 
  void, 
  { state: RootState; dispatch: AppDispatch }
>(
  "search/fetchUsers",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      //console.log("fetchUsers: инициируем startRecommendation");
      dispatch(startRecommendation());
      //console.log("fetchUsers: startRecommendation успешно завершён");

      const users = await fetchUsersRecommendation(dispatch);
      console.log('Finally', users)
      return users;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const fetchUserInterests = createAsyncThunk<
  void,
  { userId: number; index: number },
  { state: RootState; dispatch: AppDispatch }
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


export const addUsers = (users: User[]) => ({
  type: "search/addUsers",
  payload: users,
});


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
      state.currentIndex = 0;
    },
    addUsersToState(state, action: PayloadAction<User[]>) {
      state.users = [...state.users, ...action.payload];
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

export const { nextUser, setUserInterests, resetUsers, reverseUsers, addUsersToState } =
  searchSlice.actions;

export const selectSearchState = (state: RootState) => state.search;

export default searchSlice.reducer;
