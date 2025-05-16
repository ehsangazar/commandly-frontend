import { getAuthToken } from "./auth";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://commandly-backend.fly.dev";

export const handleCheckout = async (planId: string) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/subscription/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ planId }),
    });

    const data = await response.json();
    if (data.success) {
      window.open(data.checkoutUrl, "_blank");
    } else {
      throw new Error(data.error || "Failed to create checkout session");
    }
  } catch {
    throw new Error("Error creating checkout session");
  }
};
