import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

interface LoginButtonProps {
  provider: "google" | "github";
  selectedFlow: string;
}

const LoginButton = ({ provider, selectedFlow }: LoginButtonProps) => {
  // Determine the OAuth client ID and redirect URI based on the provider
  const clientId =
    provider === "google"
      ? process.env.GOOGLE_CLIENT_ID
      : process.env.GITHUB_CLIENT_ID;
  const redirectUri = `http://localhost:3000/${provider}/callback/${selectedFlow}`;
  const scope = encodeURIComponent(
    provider === "google" ? "email profile" : "user"
  );
  const prompt = "select_account";
  const responseType = selectedFlow === "authorization-code" ? "code" : "token";

  // Construct the OAuth URL based on the provider
  // If responseType = "code", we need to add access_type=offline in the params in order to receive a refresh token
  // For responseType = "token", we don't need to add this additional param as Implicit Grant type doesn't issue refresh token
  const oauthUrl =
    provider === "google"
      ? responseType === "code"
        ? `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}&prompt=${prompt}&access_type=offline`
        : `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}&prompt=${prompt}`
      : `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;

  return (
    <Link href={oauthUrl}>
      <Button
        size="lg"
        className="flex items-center w-full px-3"
        disabled={provider === "github" && selectedFlow === "implicit"}
      >
        {provider === "google" ? (
          <FcGoogle size="2em" />
        ) : (
          <FaGithub size="2em" />
        )}
        <p className="text-lg ms-2">Login with {provider}</p>
      </Button>
    </Link>
  );
};

export default LoginButton;
