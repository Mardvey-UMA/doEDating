//import { Interest } from "../../store/userSlice";

export interface AddInterestsProps {
  selectedInterests: number[]; // Список id вместо полного объекта
  onSaveInterests: (interests: number[]) => void;
}
