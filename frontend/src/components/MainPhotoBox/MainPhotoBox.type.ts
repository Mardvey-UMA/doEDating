export interface MainPhotoBoxProps {
  photos: string[];
  userId: number;
  onAddPhoto: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeletePhoto: (index: number) => void;
}
