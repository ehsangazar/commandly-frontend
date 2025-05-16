import { getAuthToken } from "./auth";

export interface Plan {
  id: string;
  name: string;
  price: number;
}
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://commandly-backend.fly.dev";

export const getPlans = async (): Promise<{ plans: Plan[] }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/subscription/plans`, {
      headers: {
        Authorization: `Bearer ${await getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch plans");
    }

    return await response.json();
  } catch {
    return { plans: [] };
  }
};
