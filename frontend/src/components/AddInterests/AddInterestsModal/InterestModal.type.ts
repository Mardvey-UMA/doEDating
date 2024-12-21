export interface Interest {
  id: number;
  name: string;
  color: string;
  textColor: string;
}

export interface Category {
  items: Interest[];
}

export interface InterestsJSON {
  categories: Record<string, Category>;
}

export interface InterestModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (selected: number[]) => void;
  selectedInterests: number[]; // Список id вместо полного объекта
}
