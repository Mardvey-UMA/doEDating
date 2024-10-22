const registerUser = async (data) => {
  const response = await fetch("http://localhost/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Ошибка регистрации пользователя ${data.username}`);
  }

  const result = await response.json();
  console.log(`Пользователь ${data.username} зарегистрирован успешно`, result);
};

const registerUsers = async () => {
  for (let i = 1; i <= 1000; i++) {
    const userData = {
      username: i.toString(),
      password: i.toString(),
      first_name: i.toString(),
      last_name: i.toString(),
    };

    try {
      await registerUser(userData);
    } catch (error) {
      console.error(`Ошибка при регистрации пользователя ${i}:`, error);
    }
  }
};

registerUsers();
