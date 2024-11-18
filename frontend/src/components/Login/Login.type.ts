export interface LoginProps {
  onLogin: (email: string, password: string) => void;
  onNavigateToRegister: () => void;
  loading: boolean;
  error: string | null;
}
