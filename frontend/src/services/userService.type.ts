export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
}
export interface UserResponse {
  id: number;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
  provider: string;
}

export interface UserInfo {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  gender: string;
  city: string;
  job: string;
  education: string;
  aboutMe: string;
  selectedInterests: number[];
  photos: string[];
  telegramId: string;
  chatId: string;

}
export interface UserResponseInfo {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  birth_date: Date;
  gender: string;
  city: string;
  job: string;
  education: string;
  about_me: string;
  selected_interests: number[];
  photos: string[];
  telegram_id:string;
  chat_id: string;
}
