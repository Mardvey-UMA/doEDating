export default interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  userId: number | null;
  loading: boolean;
  error: string | null;
}
