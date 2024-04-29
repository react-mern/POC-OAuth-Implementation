import { Card, CardContent, CardHeader } from "@/components/ui/card";
import LoginButton from "@/components/auth/LoginButton";

interface LoginFormProps{
  selectedFlow : string;
}

const LoginForm = ({selectedFlow}:LoginFormProps) => {
  return (
    <Card className="w-[400px] shadow-md flex flex-col items-center">
      <CardHeader className="text-3xl font-semibold">OAuth Demo</CardHeader>
      <CardContent className="flex flex-col space-y-3">
        <LoginButton provider="google" selectedFlow={selectedFlow}/>
        {selectedFlow !== "implicit" && <LoginButton provider="github" selectedFlow={selectedFlow}/>}
      </CardContent>
    </Card>
  );
};

export default LoginForm;
