import React, { useState } from "react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import { InputFieldButtonProps } from "./InputFieldButton.type.ts";
import styles from "./InputFieldButton.module.scss";

const InputFieldButton: React.FC<InputFieldButtonProps> = ({
  type,
  label,
  value,
  icon,
  onChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing((prev) => !prev);
  };

  return (
    <TextField
      type={type}
      label={label}
      variant="outlined"
      fullWidth
      value={value}
      onChange={onChange}
      disabled={!isEditing} // Поле редактируется только при `isEditing: true`
      InputProps={{
        startAdornment: icon ? ( // Если icon передан, то отображаем его
          <InputAdornment position="start" className={styles.startAdornment}>
            {icon}
          </InputAdornment>
        ) : null,
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={handleEditClick}
              className={`${styles.iconButton} ${
                isEditing ? styles.editing : ""
              }`}
            >
              {isEditing ? <CheckIcon /> : <EditIcon />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      InputLabelProps={{
        shrink: isEditing || Boolean(value), // `label` будет сверху при редактировании или при наличии текста
        sx: {
          color: "var(--error-contrast-text)", // Цвет лейбла по умолчанию
          "&.Mui-focused": {
            color: "var(--error-contrast-text)", // Цвет лейбла при фокусе
          },
          "&.Mui-disabled": {
            color: "var(--error-contrast-text)", // Цвет лейбла при отключенном поле
          },
        },
      }}
      className={styles.textField} // Применение SCSS стилей для других частей
    />
  );
};

export default InputFieldButton;
