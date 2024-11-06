export interface InputFieldProps {
  type: string;
  label: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
