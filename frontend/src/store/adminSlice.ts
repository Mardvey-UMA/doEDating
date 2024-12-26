// import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// import {
//   fetchUsers as fetchUsersService,
//   updateUser as updateUserService,
//   deleteUser as deleteUserService,
//   fetchUserById as fetchUserByIdService,
//   fetchUserInfo as fetchUserInfoService,
// } from "../services/userService";
// import { Interest } from "./userSlice";
// // import { User } from "../services/userService.type";
// interface User {
//   id: number | null;
//   email: string;
//   firstName: string;
//   lastName: string;
//   birthDate: Date | null;
//   gender: string;
//   city: string;
//   job: string;
//   education: string;
//   aboutMe: string;
//   selectedInterests: Interest[];
//   photos: string[];
// }
// interface AdminState {
//   usersList: User[];
//   currentUser: User | null;
//   selectedUser: User | null;
//   loading: boolean;
//   error: string | null;
// }

// const initialState: AdminState = {
//   usersList: [],
//   currentUser: null,
//   selectedUser: null,
//   loading: false,
//   error: null,
// };

// // Асинхронные действия
// export const fetchUsers = createAsyncThunk(
//   "admin/fetchUsers",
//   async (_, { rejectWithValue }) => {
//     try {
//       const users = await fetchUsersService();
//       return users;
//     } catch (error) {
//       let errorMessage = "Ошибка при получении списка пользователей";
//       if (error instanceof Error) {
//         errorMessage = error.message;
//       }
//       return rejectWithValue(errorMessage);
//     }
//   }
// );

// export const fetchCurrentUser = createAsyncThunk(
//   "admin/fetchCurrentUser",
//   async (_, { rejectWithValue }) => {
//     try {
//       const user = await fetchUserInfoService();
//       return user;
//     } catch (error) {
//       let errorMessage = "Ошибка при получении текущего пользователя";
//       if (error instanceof Error) {
//         errorMessage = error.message;
//       }
//       return rejectWithValue(errorMessage);
//     }
//   }
// );

// export const fetchUserById = createAsyncThunk(
//   "admin/fetchUserById",
//   async (id: number, { rejectWithValue }) => {
//     try {
//       const user = await fetchUserByIdService(id);
//       return user;
//     } catch (error) {
//       let errorMessage = `Ошибка при получении пользователя с ID ${id}`;
//       if (error instanceof Error) {
//         errorMessage = error.message;
//       }
//       return rejectWithValue(errorMessage);
//     }
//   }
// );

// export const updateUser = createAsyncThunk(
//   "admin/updateUser",
//   async (
//     { id, updatedData }: { id: number; updatedData: Partial<User> },
//     { rejectWithValue }
//   ) => {
//     try {
//       await updateUserService(id, updatedData);
//       return { id, updatedData };
//     } catch (error) {
//       let errorMessage = "Ошибка при обновлении пользователя";
//       if (error instanceof Error) {
//         errorMessage = error.message;
//       }
//       return rejectWithValue(errorMessage);
//     }
//   }
// );

// export const deleteUser = createAsyncThunk(
//   "admin/deleteUser",
//   async (id: number, { rejectWithValue }) => {
//     try {
//       await deleteUserService(id);
//       return id;
//     } catch (error) {
//       let errorMessage = "Ошибка при удалении пользователя";
//       if (error instanceof Error) {
//         errorMessage = error.message;
//       }
//       return rejectWithValue(errorMessage);
//     }
//   }
// );

// const adminSlice = createSlice({
//   name: "admin",
//   initialState,
//   reducers: {
//     clearSelectedUser(state) {
//       state.selectedUser = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchUsers.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
//         state.loading = false;
//         state.usersList = action.payload;
//       })
//       .addCase(fetchUsers.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       .addCase(
//         fetchCurrentUser.fulfilled,
//         (state, action: PayloadAction<User>) => {
//           state.currentUser = action.payload;
//         }
//       )
//       .addCase(
//         fetchUserById.fulfilled,
//         (state, action: PayloadAction<User>) => {
//           state.selectedUser = action.payload;
//           state.error = null;
//         }
//       )
//       .addCase(fetchUserById.rejected, (state, action) => {
//         state.selectedUser = null;
//         state.error = action.payload as string;
//       })
//       .addCase(updateUser.fulfilled, (state, action) => {
//         const index = state.usersList.findIndex(
//           (user) => user.id === action.payload.id
//         );
//         if (index !== -1) {
//           state.usersList[index] = {
//             ...state.usersList[index],
//             ...action.payload.updatedData,
//           };
//         }
//       })
//       .addCase(deleteUser.fulfilled, (state, action) => {
//         state.usersList = state.usersList.filter(
//           (user) => user.id !== action.payload
//         );
//       });
//   },
// });

// export const { clearSelectedUser } = adminSlice.actions;

// export default adminSlice.reducer;
