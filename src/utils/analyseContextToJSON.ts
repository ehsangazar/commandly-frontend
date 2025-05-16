import { getAuthToken } from "./auth";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://commandly-backend.fly.dev";

interface AnalyseResponse {
  success: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  analysis: any;
}

export async function analyseContextToJSON({
  prompt,
  context,
  format,
}: {
  prompt: string;
  context?: string;
  format?: string;
}): Promise<AnalyseResponse> {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Authentication required");
  }

  const response = await fetch(`${API_BASE_URL}/ai/analyse`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ prompt, context, format }),
  });

  if (!response.ok) {
    const error = await response.json();
    if (error.error === "Daily request limit exceeded") {
      throw new Error("Daily request limit exceeded");
    }
    throw new Error(error.error || "Failed to analyse text");
  }

  return response.json();
}
