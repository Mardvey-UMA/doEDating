import { fetchWithToken } from "./fetchService";

export type LikeType = 1 | 2 | 3;

export const sendLike = async (targetId: number, likeType: LikeType): Promise<void> => {
  try {
    const url = new URL('/api/likes', window.location.origin);
    url.searchParams.append('targetUserId', targetId.toString());
    url.searchParams.append('typeOfLike', likeType.toString());

    const response = await fetchWithToken(url.toString(), {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response) {
      throw new Error("Failed to send like");
    }

    console.log(`Like of type ${likeType} sent to user with ID ${targetId}`);
  } catch (error) {
    console.error("Error sending like:", error);
    throw new Error("Failed to send like");
  }
};
