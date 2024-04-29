import LoginForm from "@/components/auth/LoginForm";

interface LoginPageProps {
  params: {
    selectedFlow: string;
  };
}

const LoginPage = ({ params }: LoginPageProps) => {
  const { selectedFlow } = params;

  return (
    <div className="h-screen flex items-center justify-center">
      <LoginForm selectedFlow={selectedFlow} />;
    </div>
  );
};

export default LoginPage;
