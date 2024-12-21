import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import styles from "./DateField.module.scss";
import { DateFieldProps } from "./DateField.type.ts";
//import { format, parseISO } from "date-fns";

const DateField: React.FC<DateFieldProps> = ({ value, onChange }) => {
  //const dateValue = value ? parseISO(value) : null;
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label="Дата рождения"
        value={value}
        onChange={onChange}
        className={styles.datePicker}
        sx={{
          // Цвет рамки для обычного состояния и фокуса
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "var(--error-contrast-text)", // Цвет рамки по умолчанию
            },
            "&:hover fieldset": {
              borderColor: "var(--error-contrast-text)", // Цвет рамки при наведении
            },
            "&.Mui-focused fieldset": {
              borderColor: "var(--error-contrast-text)", // Цвет рамки при фокусе
            },
          },
          // Цвет текста для label
          "& .MuiInputLabel-root": {
            color: "var(--error-contrast-text)", // Цвет текста label
          },
          // Цвет текста label при фокусе
          "& .MuiInputLabel-root.Mui-focused": {
            color: "var(--error-contrast-text)", // Цвет текста label при фокусе
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default DateField;
