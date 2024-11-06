// InputFieldButton.type.ts

export interface InputFieldButtonProps {
  type: string;
  label: string;
  value: string;
  icon?: React.ReactNode; // Делаем icon необязательным
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
