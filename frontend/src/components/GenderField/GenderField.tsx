import React from "react";
import { Radio, RadioGroup, FormControlLabel, FormLabel } from "@mui/material";
import styles from "./GenderField.module.scss";
import { GenderFieldProps } from "./GenderField.type.ts";

const GenderField: React.FC<GenderFieldProps> = ({ value, onChange }) => {
  return (
    <div className={styles.container}>
      <FormLabel
        component="legend"
        className={styles.label}
        sx={{
          color: "var(--error-contrast-text)", 
        }}
      >
        Пол
      </FormLabel>
      <RadioGroup row value={value} onChange={onChange}>
        <FormControlLabel
          value="MALE"
          control={<Radio color="secondary" className={styles.radio} />}
          label="Мужской"
        />
        <FormControlLabel
          value="FEMALE"
          control={<Radio color="secondary" className={styles.radio} />}
          label="Женский"
        />
      </RadioGroup>
    </div>
  );
};

export default GenderField;
