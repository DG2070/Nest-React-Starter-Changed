import MyButton from "@/components/shared/my-button";
import { Fetch } from "@/lib/fetcher";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "@tanstack/react-router";
import { Form } from "@/components/ui/form";
import { TextInput } from "@/components/forms/form-components/text-input";
import type { JWTS } from "@/types";
import { useAuth } from "@/provider/use-auth";
const LoginSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});
type LoginFormType = z.infer<typeof LoginSchema>;

const LoginForm = () => {
  const navigate = useNavigate();
  const { setJwts } = useAuth();
  const loginForm = useForm<LoginFormType>({
    resolver: zodResolver(LoginSchema),
  });
  const onSignInSubmit = (data: LoginFormType) => {
    onSignIn.mutate(data);
  };
  const onSignIn = useMutation({
    mutationFn: async (data: LoginFormType) => {
      try {
        const res = await Fetch<JWTS>({
          url: "/authentication/sign-in",
          method: "POST",
          data: data,
        });

        setJwts(res);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(error?.message);
        console.error("Error during login:", error);
      }
    },
  });
  return (
    <Form {...loginForm}>
      <form
        onSubmit={loginForm.handleSubmit(onSignInSubmit)}
        className="flex flex-col gap-4"
      >
        <TextInput
          type="email"
          name="email"
          control={loginForm.control}
          label="Email"
          required
          placeholder="Enter your email"
        />
        <TextInput
          name="password"
          control={loginForm.control}
          label="Password"
          type="password"
          isPassword
          placeholder="Enter your password"
          required
        />
        <div
          className="text-right text-sm text-text cursor-pointer"
          onClick={() => navigate({ to: "/forgot-password" })}
        >
          Forgot Password?
        </div>
        <MyButton
          label="Login"
          loading={onSignIn.isPending}
          loadingLabel="Logging in..."
        />
      </form>
    </Form>
  );
};

export default LoginForm;
