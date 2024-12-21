// src/components/FiltersModal/FiltersModal.tsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slider,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Typography,
} from "@mui/material";
import {
  Filter,
  updateFilters,
  fetchFilters,
} from "../../services/fetchFilters";
import { resetUsers, reverseUsers } from "../../store/searchSlice";
import { fetchUsers } from "../../store/searchSlice";
import { useAppDispatch } from "../../store";

interface FiltersModalProps {
  open: boolean;
  onClose: () => void;
}

const FiltersModal: React.FC<FiltersModalProps> = ({ open, onClose }) => {
  const dispatch = useAppDispatch();

  // Стейт для фильтров
  const [filters, setFilters] = useState<Filter>({
    minAge: 18,
    maxAge: 99,
    genderFilter: "Any",
    searchRadius: 10,
  });

  useEffect(() => {
    if (open) {
      fetchFilters()
        .then((fetchedFilters) => setFilters(fetchedFilters))
        .catch((error) => console.error("Error loading filters:", error));
    }
  }, [open]);

  const handleFilterChange = (name: keyof Filter, value: number | string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleUpdateFilters = () => {
    updateFilters(filters)
      .then(() => {
        console.log("Filters updated successfully");
        onClose();
      })
      .catch((error) => console.error("Error updating filters:", error));
  };

  const handleRecalculateRecommendations = () => {
    dispatch(resetUsers());
    dispatch(fetchUsers());
  };

  const handleReverseUsers = () => {
    dispatch(reverseUsers());
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Фильтры</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>Минимальный возраст</Typography>
        <Slider
          value={filters.minAge}
          onChange={(_, value) => handleFilterChange("minAge", value as number)}
          valueLabelDisplay="auto"
          min={18}
          max={100}
        />

        <Typography gutterBottom>Максимальный возраст</Typography>
        <Slider
          value={filters.maxAge}
          onChange={(_, value) => handleFilterChange("maxAge", value as number)}
          valueLabelDisplay="auto"
          min={18}
          max={100}
        />

        <Typography gutterBottom>Пол</Typography>
        <RadioGroup
          value={filters.genderFilter}
          onChange={(e) => handleFilterChange("genderFilter", e.target.value)}
        >
          <FormControlLabel value="MALE" control={<Radio />} label="Мужской" />
          <FormControlLabel
            value="FEMALE"
            control={<Radio />}
            label="Женский"
          />
        </RadioGroup>

        <Typography gutterBottom>Радиус поиска (км)</Typography>
        <Slider
          value={filters.searchRadius}
          onChange={(_, value) =>
            handleFilterChange("searchRadius", value as number)
          }
          valueLabelDisplay="auto"
          min={1}
          max={100}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleRecalculateRecommendations} color="secondary">
          Пересчитать рекомендации
        </Button>
        <Button onClick={handleUpdateFilters} color="secondary">
          Обновить фильтры
        </Button>

        <Button onClick={handleReverseUsers} color="secondary">
          Перевернуть список
        </Button>

        <Button onClick={onClose} color="secondary">
          Закрыть
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FiltersModal;
