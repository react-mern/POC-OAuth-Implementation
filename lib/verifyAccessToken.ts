import { NextRequest } from "next/server";

// Function to extract access token from request headers
const extractAccessToken = (req: NextRequest) => {
  const tokenHeader = req.headers.get("authorization");
  return tokenHeader ? tokenHeader.split(" ")[1] : null;
};

// Main verification function based on endpoint
export const verifyAccessToken = async (req: NextRequest) => {
  const accessToken = extractAccessToken(req);
  if (!accessToken) {
    return { status: 401, message: "Unauthorized Access!" };
  }

  // Check if the access token was granted by Google
  const isGoogleAccessToken = await verifyGoogleAccessToken(accessToken);

  if (isGoogleAccessToken.status === 200) {
    return isGoogleAccessToken;
  }

  // If the access token was not granted by Google, check GitHub
  const isGitHubAccessToken = await verifyGitHubAccessToken(accessToken);
  return isGitHubAccessToken;
};

// Function to verify if access token was granted by GitHub
const verifyGitHubAccessToken = async (accessToken: string) => {
  try {
    // Verify access token by sending it to GitHub's token info API endpoint
    const response = await fetch(`https://api.github.com/octocat`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`
      },
    });
    // Check if response indicates successful verification
    if (response.ok) {
      return { status: 200, message: "Success" };
    } else {
      // Access token is invalid or verification failed
      return { status: 401, message: "Unauthorized Access!" };
    }
  } catch (error) {
    console.error('Error verifying GitHub access token:', error);
    return { status: 500, message: "Error verifying access token" };
  }
};

// Function to verify if access token was granted by Google
const verifyGoogleAccessToken = async (accessToken: string) => {
  try {
    // Verify access token by sending it to Google's token verification endpoint
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`);
    const data = await response.json();

    // Check if token is valid
    if (response.ok) {
      // Check if the audience matches the expected Google Client ID
      if (!data.aud || data.aud !== process.env.GOOGLE_CLIENT_ID) {
        // Access token does not match expected audience or other verification checks failed
        return { status: 401, message: "Unauthorized Access!" };
      } else {
        // Access token is valid
        return { status: 200, message: "Success" };
      }
    } else {
      // Access token is invalid
      return { status: 401, message: "Unauthorized Access!" };
    }
  } catch (error) {
    console.error('Error verifying access token:', error);
    return { status: 500, message: "Error verifying access token" };
  }
};