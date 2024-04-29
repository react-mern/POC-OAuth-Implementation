"use client";

import GrantTypeDropdown from "@/components/shared/GrantTypeDropdown";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import illustration from "@/public/illustration.svg";

export default function Home() {
  const [selectedFlow, setSelectedFlow] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleSelectGrantFlow = (flowType: string) => {
    setSelectedFlow(flowType);
    setError(false); // Reset error state when a flow is selected
  };

  const handleProceedToLogin = () => {
    if (!selectedFlow) {
      setError(true); // Set error state if no flow is selected
      return;
    }
    router.push(`/login/${selectedFlow}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-evenly">
      <div className="mb-6 text-center space-y-3">
        <p className="text-2xl text-white">Welcome to OAuth Demo!</p>
        <p className="text-lg text-white">
          Please select a grant type to get started
        </p>
        <div className="flex items-center justify-center">
          <Image
            src={illustration}
            alt="homepage illustration"
            height="300"
            width="300"
            className="bg-white rounded-lg"
          />
        </div>
        <GrantTypeDropdown onSelectGrantFlow={handleSelectGrantFlow} />
        {error && (
          <p className="text-red-500 text-sm">
            Please select a grant type before proceeding to login.
          </p>
        )}
      </div>

      <Button onClick={handleProceedToLogin} variant="outline">
        Proceed to Login
      </Button>
    </main>
  );
}
