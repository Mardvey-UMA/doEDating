export interface MainPhotoBoxProps {
  photos: string[];
  onAddPhoto: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeletePhoto: (index: number) => void;
}
