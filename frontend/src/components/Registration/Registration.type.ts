export interface RegistrationProps {
  onRegister: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => void;
  onNavigateToLogin: () => void;
  loading: boolean;
  error: string | null;
}
