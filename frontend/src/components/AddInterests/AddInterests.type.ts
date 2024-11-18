import { Interest } from "../../store/userSlice";

export interface AddInterestsProps {
  selectedInterests: Interest[];
  onSaveInterests: (interests: Interest[]) => void;
}
