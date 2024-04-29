import { checkIfAccessTokenIsAvailable } from "@/app/actions/token";
import UserData from "@/components/shared/UserData";

interface GoogleCallbackProps {
  searchParams: {
    code: string;
  };
}

const GoogleCallback = async ({ searchParams }: GoogleCallbackProps) => {
  const { code } = searchParams;

  const isAccessTokenAvailable = await checkIfAccessTokenIsAvailable();

  if (!isAccessTokenAvailable) {
    // Send the authorization code to the server to complete the authentication process
    const response = await fetch(
      `http://localhost:3000/api/google/authorization-code`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      }
    );

    if (response.ok) {
      const user = await response.json();
      const userDataWithToken = user.userDataWithToken;
      return <UserData userDataWithToken={userDataWithToken} />;
    }
  }

  return (
    <div className="text-3xl flex items-center justify-center text-white">
      Oops! Something went wrong...
    </div>
  );
};

export default GoogleCallback;
