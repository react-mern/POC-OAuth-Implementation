import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  // Extract the authorization code from the request body
  const { code } = await req.json();
  
  // Retrieve OAuth client ID and client secret from environment variables
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri =
    "http://localhost:3000/google/callback/authorization-code";

  try {
    // Exchange the authorization code for an access token and refresh token from Google's token endpoint
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    // If the token exchange fails, throw an error
    if (!tokenResponse.ok) {
      throw new Error("Failed to exchange code for token");
    }

    // Parse the token data from the response
    const tokenData = await tokenResponse.json();
    let {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: expiresIn,
    } = tokenData;

    // Check if the access token has expired
    if (expiresIn) {
      // Convert expiresIn to milliseconds
      const tokenExpirationTime = new Date().getTime() + expiresIn * 1000;
      const currentTime = new Date().getTime();
      if (currentTime > tokenExpirationTime) {
        // Access token has expired; refresh it using the refresh token
        const refreshResponse = await fetch(
          "https://oauth2.googleapis.com/token",
          {
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
          }
        );

        // If the token refresh fails, throw an error
        if (!refreshResponse.ok) {
          throw new Error("Failed to refresh access token");
        }

        // Parse the refreshed token data
        const refreshedTokenData = await refreshResponse.json();
        accessToken = refreshedTokenData.access_token;
        refreshToken = refreshedTokenData.refresh_token || refreshToken; // Keep the same refresh token if not provided in the response
        expiresIn = refreshedTokenData.expires_in;
      }
    }

    // Fetch user data from Google using the access token
    const userDataResponse = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // If fetching user data fails, throw an error
    if (!userDataResponse.ok) {
      throw new Error("Failed to fetch user data from Google");
    }

    // Parse user data from the response
    const userData = await userDataResponse.json();

    const userDataWithToken = {
      ...userData,
      tokens: {
        refreshToken,
        accessToken,
        expiresIn: new Date().getTime() + expiresIn * 1000,
      },
    };
    // Return the user data along with the tokens in the response
    return NextResponse.json({
      userDataWithToken,
    });
  } catch (error) {
    console.error("Authentication error:", error);
    redirect("/");
  }
};
