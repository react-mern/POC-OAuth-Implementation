import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  // Extract the authorization code from the request body
  const { code } = await req.json();

  // Retrieve OAuth client ID and client secret from environment variables
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXT_PUBLIC_HOST_URL}/github/callback/authorization-code`;

  try {
    // Exchange the authorization code for an access token from Github OAuth server
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          redirect_uri: redirectUri,
        }),
      }
    );

    // If the token exchange fails, throw an error
    if (!tokenResponse.ok) {
      throw new Error("Failed to exchange code for token");
    }

    // Parse the token data from the response
    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Fetch user data from GitHub using the access token
    const userDataResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // If fetching user data fails, throw an error
    if (!userDataResponse.ok) {
      throw new Error("Failed to fetch user data from Github");
    }

    // Parse user data from the response
    const userData = await userDataResponse.json();

    const userDataWithToken = {
      ...userData,
      accessToken  // Add the token directly into the userData object
    };
 
    // Return the user data in the response
    return NextResponse.json({ userDataWithToken });
  } catch (error) {
    console.error("Authentication error:", error);
    redirect("/");
  }
};
