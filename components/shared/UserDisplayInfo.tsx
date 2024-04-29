"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader } from "@/components/ui/card";
import Loader from "@/components/shared/Loader";
import LogoutButton from "@/components/auth/LogoutButton";
import Image from "next/image";
import defaultUserImg from "@/public/defaultUser.png";

interface UserData {
  login?: string;
  name?: string;
  bio?: string;
  email?: string;
  avatar_url?: string;
  picture?: string;
}

const UserDisplayInfo = () => {
  // Initialize userData with its type for better type checking
  const [userData, setUserData] = useState<UserData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUserData = localStorage.getItem("userDataWithToken");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <Loader />;
  }
  if (!userData || Object.keys(userData).length === 0) {
    return <div>Please login</div>;
  }

  return (
    <div className="flex flex-col justify-center space-y-5">
      <Card className="flex flex-col items-center justify-center space-y-3 px-2 py-3 w-[400px]">
        <CardHeader className="text-3xl flex flex-col justify-center">
          <h1 className="mx-auto">Welcome</h1>
          <h1>{userData.login || userData.name}!</h1>
        </CardHeader>

        {userData.bio && <p>Bio: {userData.bio}</p>}
        {userData.email && <p>Email: {userData.email}</p>}
        <Image
          src={userData.avatar_url || userData.picture || defaultUserImg}
          alt="User Avatar"
          className="rounded-full"
          width={100}
          height={100}
        />
      </Card>
      <LogoutButton />
    </div>
  ); 
};

export default UserDisplayInfo;
