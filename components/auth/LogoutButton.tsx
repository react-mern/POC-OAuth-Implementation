"use client";

import { deleteAccessTokenFromCookie } from "@/app/actions/token";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const router = useRouter();


  const handleLogout = async () => {
    // Delete user data from local storage
    localStorage.removeItem("userDataWithToken");

    // Delete accessToken from cookie
    await deleteAccessTokenFromCookie();
    router.push("/");
  };

  return <Button onClick={handleLogout}>Logout</Button>;
};

export default LogoutButton;
