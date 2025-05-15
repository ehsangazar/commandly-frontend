import Cookies from "js-cookie";

interface TokenData {
  token: string;
  expires: number;
}

const TOKEN_KEY = "commandly_token";
const TOKEN_EXPIRY_DAYS = 365;

export const setAuthToken = (token: string) => {
  // Set cookie with 1 year expiration
  Cookies.set(TOKEN_KEY, token, {
    expires: TOKEN_EXPIRY_DAYS,
    path: "/",
    secure: true,
    sameSite: "strict",
  });

  // Set localStorage with 1 year expiration
  const tokenData: TokenData = {
    token,
    expires: new Date().getTime() + TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000, // 1 year from now
  };
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokenData));
};

export const getAuthToken = (): string | null => {
  // First try to get from localStorage
  const storedData = localStorage.getItem(TOKEN_KEY);
  if (storedData) {
    try {
      const tokenData: TokenData = JSON.parse(storedData);
      // Check if token is expired
      if (tokenData.expires > new Date().getTime()) {
        return tokenData.token;
      }
      // If expired, remove it
      removeAuthToken();
    } catch (e) {
      console.error("Error parsing stored token data:", e);
      removeAuthToken();
    }
  }

  // If not in localStorage or expired, try cookie
  const cookieToken = Cookies.get(TOKEN_KEY);
  if (cookieToken) {
    // If we found a valid cookie token, update localStorage
    setAuthToken(cookieToken);
    return cookieToken;
  }

  return null;
};

export const removeAuthToken = () => {
  // Remove from both storage locations
  localStorage.removeItem(TOKEN_KEY);
  if (chrome.storage.local) {
    chrome.storage.local.remove(TOKEN_KEY);
  }
  Cookies.remove(TOKEN_KEY, { path: "/" });
};

export const isAuthenticated = (): boolean => {
  return getAuthToken() !== null;
};
