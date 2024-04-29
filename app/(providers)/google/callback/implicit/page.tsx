"use client";

import { useEffect, useTransition } from "react";
import Loader from "@/components/shared/Loader";
import { setAccessTokenInCookie } from "@/app/actions/token";
import { useRouter } from "next/navigation";

const GoogleCallback = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    // Get the current URL
    const url = window.location.href;

    // Parse the URL to extract the fragment
    const urlParts = url.split("#");
    const fragment = urlParts[1];

    // Parse the fragment to extract the access_token
    const params = new URLSearchParams(fragment);
    const accessToken = params.get("access_token");

    // Call backend API if access token is present
    if (accessToken) {
      fetchUserData(accessToken);
    }
  }, []);

  const fetchUserData = (accessToken: string) => {
    startTransition(async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/google/implicit",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ access_token: accessToken }),
          }
        );

        if (response.ok) {
          const user = await response.json();
          const userDataWithToken = user.userDataWithToken;

          localStorage.setItem(
            "userDataWithToken",
            JSON.stringify(userDataWithToken)
          );

          const { accessToken } = userDataWithToken;
          await setAccessTokenInCookie(accessToken);

          router.push("/dashboard");
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    });
  };

  if (isPending) return <Loader />;
  return null;
};

export default GoogleCallback;
