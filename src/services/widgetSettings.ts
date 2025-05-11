import { getAuthToken } from "@/utils/auth";

interface Widget {
  id: string;
  type: "stats" | "clips" | "clock" | "diagram" | "chat";
  x: number;
  y: number;
  w: number;
  h: number;
  staticH: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  settings?: T;
  error?: string;
}

const API_URL =
  import.meta.env.VITE_API_URL || "https://commandly-backend.fly.dev";

export const getWidgetSettings = async (): Promise<ApiResponse<Widget[]>> => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/widget-settings`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching widget settings:", error);
    throw error;
  }
};

export const updateWidgetSettings = async (
  settings: Widget[]
): Promise<ApiResponse<Widget[]>> => {
  try {
    const token = getAuthToken();
    const response = await fetch(`${API_URL}/widget-settings`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ settings }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error updating widget settings:", error);
    throw error;
  }
};
