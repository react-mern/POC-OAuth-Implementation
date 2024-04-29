import { NextRequest } from "next/server";
import { verifyAccessToken } from "@/lib/verifyAccessToken";

export const GET = async (req: NextRequest): Promise<void | Response> => {
  // Verify the access token
  const verificationResult = await verifyAccessToken(req);

  // Check if the verification result indicates unauthorized access
  if (verificationResult.status === 401) {
    // If unauthorized, return the unauthorized response
    return new Response(JSON.stringify(verificationResult), { status: 401 });
  } else if (verificationResult.status === 500) {
    // If there was an error during token verification, handle it
    console.error("Error verifying access token");
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  } else {
    // If authorized, return success message
    return new Response(
      JSON.stringify({
        message: "Congrats! You are authorized to access this resource",
      })
    );
  }
};
