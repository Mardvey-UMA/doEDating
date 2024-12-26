export interface UserProfileFieldsProps {
  email: string;
  firstName: string;
  lastName: string;
  birthDate: Date | null;
  gender: string;
  city: string;
  job: string;
  education: string;
  telegramId: string;
  onEmailChange: (value: string) => void;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onBirthDateChange: (date: Date | null) => void;
  onGenderChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onJobChange: (value: string) => void;
  onEducationChange: (value: string) => void;
  onTelegramIdChange: (value: string) => void;
}
