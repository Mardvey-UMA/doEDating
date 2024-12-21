export interface PhotoItemProps {
  userId: number;
  photoId: string;
  onDelete: () => void;
  isLoading: boolean;
  isExiting: boolean;
}
