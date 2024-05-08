"use client";

import { getAccessTokenByRefreshToken } from "@/app/actions/token";
import Loader from "@/components/shared/Loader";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

const MembersPage = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const userDataWithToken = JSON.parse(
      localStorage.getItem("userDataWithToken") || "{}"
    );

    // If user data is not present in local storage, redirect back to home page
    if (Object.keys(userDataWithToken).length === 0) router.push("/");

    // Check if the user has logged in with Github, accessToken is directly accessible in userDataWithToken object for Github
    if (userDataWithToken.accessToken) {
      setAccessToken(userDataWithToken.accessToken);
    } else {
      // For Google, accessToken is stored in "tokens" object
      const tokenExpirationTime = userDataWithToken?.tokens?.expiresIn; // Convert expiresIn to milliseconds
      const currentTime = new Date().getTime();

      if (tokenExpirationTime && tokenExpirationTime > currentTime) {
        // If token hasn't expired, set the accessToken state to be the accessToken stored in Local Storage
        setAccessToken(userDataWithToken.tokens.accessToken);
      } else {
        // Access token is expired or not available, try to refresh
        const refreshToken = userDataWithToken?.tokens?.refreshToken;

        if (refreshToken) {
          try {
            const getNewAccessToken = async () => {
              // Get new access token by using the refresh token
              const refreshedTokenData = await getAccessTokenByRefreshToken(refreshToken);
              const { access_token: accessToken, expires_in: expiresIn } = refreshedTokenData;
              // Set the access token state to the new access token received using the refresh token
              setAccessToken(accessToken);

              // Update localStorage with new tokens
              localStorage.setItem(
                "userDataWithToken",
                JSON.stringify({
                  ...userDataWithToken,
                  tokens: {
                    ...userDataWithToken.tokens,
                    accessToken: accessToken,
                    expiresIn: new Date().getTime() + expiresIn * 1000,
                  },
                })
              );
            };
            getNewAccessToken();
          } catch (error) {
            if(error instanceof Error){
              setError(error)
            }
            localStorage.removeItem("userDataWithToken");
            router.push("/");
          }
        }
      }
    }
  }, [router]);

  useEffect(() => {
    if (accessToken) {
      const fetchData = async () => {
        try {
          startTransition(async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/members`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
            });
            if (!response.ok) {
              router.push("/dashboard");
            }
          });
        } catch (error) {
          if(error instanceof Error){
            setError(error)
          }
          localStorage.removeItem("userDataWithToken");
          router.push("/");
        }
      };
      fetchData();
    }
  }, [accessToken,router]);

  if (isPending) {
    return <Loader/>;
  }

  return (
    accessToken &&
    !error && (
      <div className="text-white h-screen flex justify-center items-center">
        This page can only be accessed by users having a Membership!
      </div>
    )
  );
};

export default MembersPage;
