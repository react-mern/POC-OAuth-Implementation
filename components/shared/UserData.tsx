"use client";

import { useEffect } from "react";
import Loader from "@/components/shared/Loader";
import { setAccessTokenInCookie } from "@/app/actions/token";
import { useRouter } from "next/navigation";

// Interface for GitHub user data
interface GitHubUserData {
  login?: string;
  avatar_url?: string;
  bio?: string;
  accessToken: string;
}

// Interface for Google user data
interface GoogleUserData {
  name?: string;
  email?: string;
  picture?: string;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}

// Union type for both Google and GitHub user data
type UserData = GitHubUserData | GoogleUserData;

const UserData = ({ userDataWithToken }: { userDataWithToken: UserData }) => {
  const router = useRouter();

  useEffect(() => {
    const setUserToken = async () => {
      try {
        if (!userDataWithToken) return;

        // Store user data in localStorage
        localStorage.setItem("userDataWithToken", JSON.stringify(userDataWithToken));

        // Set access token in cookies
        if ("tokens" in userDataWithToken) {
          // Google user data
          const { accessToken } = userDataWithToken.tokens;
          await setAccessTokenInCookie(accessToken);
        } else {
          // GitHub user data
          const { accessToken } = userDataWithToken;
          await setAccessTokenInCookie(accessToken);
        }

        router.push("/dashboard");
      } catch (error) {
        console.error("Error setting user token:", error);
      }
    };
    setUserToken();
  }, [userDataWithToken,router]);

  return <Loader />;
};

export default UserData;
