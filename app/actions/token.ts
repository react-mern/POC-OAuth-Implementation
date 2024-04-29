"use server";

import { cookies } from "next/headers";

export const getAccessTokenByRefreshToken = async (refreshToken: string) => {
  // Retrieve OAuth client ID and client secret from environment variables
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  try {
    const refreshResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "refresh_token",
      }),
    });

    // If the token refresh fails, throw an error
    if (!refreshResponse.ok) {
      throw new Error("Failed to refresh access token");
    }

    // Parse the refreshed token data
    const refreshedTokenData = await refreshResponse.json();
    return refreshedTokenData;
  } catch (error) {
    return error;
  }
};

export const setAccessTokenInCookie = async (accessToken: string) => {
  const cookieStore = cookies();
  cookieStore.set("accessToken", accessToken);
};

export const deleteAccessTokenFromCookie = async () => {
  const cookieStore = cookies();
  if (cookieStore.has("accessToken")) {
    cookieStore.delete("accessToken");
  }
};

export const checkIfAccessTokenIsAvailable = async () => {
  const cookieStore = cookies();
  if (cookieStore.has("accessToken")) {
    return true
  }
  return false;
}
