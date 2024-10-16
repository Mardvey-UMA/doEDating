import React from "react";
import { TextField } from "@mui/material";
import styles from "../../src/styles/formFields.module.scss"; // Подключаем стили

interface InputFieldProps {
  type: string;
  label: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({ type, label, onChange }) => {
  return (
    <TextField
      className={styles.inputField}
      type={type}
      label={label}
      variant="outlined"
      fullWidth
      margin="normal"
      onChange={onChange}
    />
  );
};

export default InputField;
