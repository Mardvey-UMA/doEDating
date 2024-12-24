import { fetchWithToken } from "./fetchService";

export interface InterestResponseDTO {
  name: string;
  color: string;
  textColor: string;
}

export const fetchInterests = async (userId: number): Promise<InterestResponseDTO[]> => {
  try {
    const response = await fetchWithToken<InterestResponseDTO[]>(`/api/users/interests/${userId}`, {
      method: "GET",
    });

    if (!response) {
      throw new Error("No response from the server.");
    }

    return response;
  } catch (error) {
    console.error("Error fetching interests:", error);
    throw new Error("Failed to fetch interests");
  }
};
