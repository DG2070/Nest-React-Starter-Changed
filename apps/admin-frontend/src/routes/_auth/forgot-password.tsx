import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Fetch } from "@/lib/fetcher";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MyButton from "@/components/shared/my-button";
import { Form } from "@/components/ui/form";
import { TextInput } from "@/components/forms/form-components/text-input";
import { useState } from "react";
import { CheckCircle } from "lucide-react";

export const Route = createFileRoute("/_auth/forgot-password")({
  component: RouteComponent,
});
const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

type ForgotPasswordFormType = z.infer<typeof forgotPasswordSchema>;
function RouteComponent() {
  const [resetLink, setResetLink] = useState<Boolean>(false);
  const forgotPasswordForm = useForm<ForgotPasswordFormType>({
    resolver: zodResolver(forgotPasswordSchema),
  });
  const onForgotPassword = useMutation({
    mutationFn: (data: ForgotPasswordFormType) => {
      return Fetch({
        url: "/auth/forgot-password",
        method: "POST",
        data: data,
      });
    },
    onSuccess: () => {
      toast.success("Reset link sent to email");
      setResetLink(true);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return (
    <div className="max-w-xl mx-auto  h-screen flex justify-center items-center">
      <div className="w-full">
        <div className="mb-8 flex justify-center items-center ">
          <img src={"/logo (1) 1.png"} alt="logo" />
        </div>
        <Card>
          {!resetLink && (
            <CardHeader>
              <CardTitle>Forgot Password</CardTitle>
            </CardHeader>
          )}
          <CardContent className="my-2">
            {!resetLink ? (
              <Form {...forgotPasswordForm}>
                <form
                  className="space-y-4"
                  onSubmit={forgotPasswordForm.handleSubmit(
                    (data: ForgotPasswordFormType) => {
                      onForgotPassword.mutate(data);
                    },
                  )}
                >
                  <TextInput
                    name="email"
                    control={forgotPasswordForm.control}
                    label="Email"
                    type="email"
                    placeholder="Enter your email"
                  />

                  <MyButton
                    label="Send Reset Link"
                    className="w-full"
                    loading={onForgotPassword.isPending}
                    loadingLabel="Sending reset link"
                  />
                </form>
              </Form>
            ) : (
              <div className="text-center flex flex-col gap-2 items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-500 animate-spin-in-once duration-500" />
                <p className="font-[600]">
                  Reset link sent to {forgotPasswordForm.getValues("email")}
                </p>
                <p className="font-[500]">
                  Please check your email for the reset link
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
