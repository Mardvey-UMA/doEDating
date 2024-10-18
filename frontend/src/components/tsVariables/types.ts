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
