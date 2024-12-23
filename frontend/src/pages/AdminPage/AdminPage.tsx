// import React, { useEffect, useState } from "react";
// import { Button, TextField, Box, Typography } from "@mui/material";
// import styles from "./AdminPage.module.scss";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState, AppDispatch } from "../../store";
// import {
//   fetchUsers,
//   fetchCurrentUser,
//   fetchUserById,
//   updateUser,
//   deleteUser,
// } from "../../store/adminSlice";
// import { User } from "../../services/userService.type";

// const AdminPage: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { usersList, currentUser, selectedUser, error } = useSelector(
//     (state: RootState) => state.admin
//   );

//   const [selectedUserId, setSelectedUserId] = useState<number | "">("");
//   const [deleteUserId, setDeleteUserId] = useState<number | "">("");
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [username, setUsername] = useState("");
//   const [userId, setUserId] = useState<number | "">("");

//   useEffect(() => {
//     dispatch(fetchUsers());
//     dispatch(fetchCurrentUser());
//   }, [dispatch]);

//   const handleUpdateUser = async () => {
//     if (selectedUserId !== "") {
//       const updatedData: Partial<User> = {};
//       if (firstName) updatedData.first_name = firstName;
//       if (lastName) updatedData.last_name = lastName;
//       if (username) updatedData.username = username;

//       await dispatch(updateUser({ id: Number(selectedUserId), updatedData }));
//       alert("Пользователь успешно обновлен");
//       dispatch(fetchUsers());
//     }
//   };

//   const handleDeleteUser = async () => {
//     if (deleteUserId !== "") {
//       await dispatch(deleteUser(Number(deleteUserId)));
//       alert(`Пользователь с ID ${deleteUserId} был удален`);
//       setDeleteUserId("");
//     }
//   };

//   const handleFetchUserById = async () => {
//     if (userId !== "") {
//       await dispatch(fetchUserById(Number(userId)));
//     }
//   };

//   return (
//     <div className={styles.pageContainer}>
//       <Box>
//         <Typography variant="h6">
//           Информация об авторизованном пользователе:
//         </Typography>
//         {currentUser ? (
//           <Box>
//             <p>ID: {currentUser.id}</p>
//             <p>Имя: {currentUser.first_name}</p>
//             <p>Фамилия: {currentUser.last_name}</p>
//             <p>Логин: {currentUser.username}</p>
//           </Box>
//         ) : (
//           <p>Не удалось получить данные о пользователе</p>
//         )}
//       </Box>

//       <Box>
//         <Typography variant="h6">Список пользователей:</Typography>
//         {usersList.length > 0 ? (
//           <ul>
//             {usersList.map((user) => (
//               <li key={user.id}>
//                 ID: {user.id} - {user.first_name} {user.last_name} (
//                 {user.username})
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>Нет пользователей для отображения</p>
//         )}
//       </Box>

//       {/* Поля для изменения пользователя */}
//       <Box className={styles.rowContainer}>
//         <TextField
//           label="ID для изменения"
//           value={selectedUserId}
//           onChange={(e) =>
//             setSelectedUserId(e.target.value ? Number(e.target.value) : "")
//           }
//           fullWidth
//         />
//         <TextField
//           label="Имя"
//           value={firstName}
//           onChange={(e) => setFirstName(e.target.value)}
//           fullWidth
//         />
//         <TextField
//           label="Фамилия"
//           value={lastName}
//           onChange={(e) => setLastName(e.target.value)}
//           fullWidth
//         />
//         <TextField
//           label="Username"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           fullWidth
//         />
//         <Button variant="contained" onClick={handleUpdateUser}>
//           Изменить пользователя
//         </Button>
//       </Box>

//       <Typography variant="h6">Поиск пользователя по ID:</Typography>
//       <TextField
//         label="Введите ID пользователя"
//         value={userId}
//         onChange={(e) =>
//           setUserId(e.target.value ? Number(e.target.value) : "")
//         }
//         fullWidth
//       />
//       <Button variant="contained" onClick={handleFetchUserById}>
//         Найти пользователя
//       </Button>

//       {/* Отображаем информацию о пользователе по ID */}
//       {selectedUser && (
//         <Box>
//           <Typography variant="h6">Информация о пользователе:</Typography>
//           <p>ID: {selectedUser.id}</p>
//           <p>Имя: {selectedUser.first_name}</p>
//           <p>Фамилия: {selectedUser.last_name}</p>
//           <p>Логин: {selectedUser.username}</p>
//         </Box>
//       )}

//       {/* Отображаем ошибку, если запрос завершился неудачно */}
//       {error && <p style={{ color: "red" }}>{error}</p>}

//       {/* Поля для удаления пользователя */}
//       <Box className={styles.rowContainer}>
//         <TextField
//           label="Введите ID пользователя для удаления"
//           value={deleteUserId}
//           onChange={(e) =>
//             setDeleteUserId(e.target.value ? Number(e.target.value) : "")
//           }
//           fullWidth
//         />
//         <Button variant="contained" color="error" onClick={handleDeleteUser}>
//           Удалить пользователя
//         </Button>
//       </Box>
//     </div>
//   );
// };

// export default AdminPage;
