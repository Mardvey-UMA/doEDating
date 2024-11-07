import React from "react";
import { TextField } from "@mui/material";
import styles from "./InputField.module.scss";
import { InputFieldProps } from "./InputField.type.ts";

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
