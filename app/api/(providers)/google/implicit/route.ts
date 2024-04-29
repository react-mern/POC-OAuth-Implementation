import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  // Extract the token from the request body
  const { access_token:accessToken} = await req.json();

  try {
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
      accessToken  // Add the token directly into the userData object
    };
 
    // Return the user data in the response
    return NextResponse.json({ userDataWithToken });
  } catch (error) {
    console.error("Authentication error:", error);
    redirect("/");
  }
};
