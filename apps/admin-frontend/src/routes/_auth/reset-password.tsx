import { TextInput } from "@/components/forms/form-components/text-input";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Fetch } from "@/lib/fetcher";
import { useMutation } from "@tanstack/react-query";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import MyButton from "@/components/shared/my-button";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
const searchSchema = z.object({
  token: fallback(z.string(), ""),
});

export const Route = createFileRoute("/_auth/reset-password")({
  component: RouteComponent,
  validateSearch: zodValidator(searchSchema),
});
const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8),
    confirmNewPassword: z.string().min(8),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });
type ResetPasswordFormType = z.infer<typeof resetPasswordSchema>;
function RouteComponent() {
  const { token } = Route.useSearch();
  const resetPasswordForm = useForm<ResetPasswordFormType>({
    resolver: zodResolver(resetPasswordSchema),
  });
  const onResetPassword = useMutation({
    mutationFn: (data: ResetPasswordFormType) => {
      return Fetch({
        url: "/auth/reset-password",
        method: "POST",
        data: data,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      toast.success("Password reset successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return (
    <div className="max-w-xl mx-auto  h-screen flex justify-center items-center">
      <div className="w-full">
        <div className="mb-8 flex justify-center items-center">
          <img src={"/logo (1) 1.png"} alt="logo" />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...resetPasswordForm}>
              <form
                className="space-y-4"
                onSubmit={resetPasswordForm.handleSubmit(
                  (data: ResetPasswordFormType) => {
                    onResetPassword.mutate(data);
                  },
                )}
              >
                <TextInput
                  name="newPassword"
                  control={resetPasswordForm.control}
                  label="Password"
                  type="password"
                  isPassword
                  placeholder="Enter your password"
                />
                <TextInput
                  name="confirmNewPassword"
                  control={resetPasswordForm.control}
                  label="Confirm Password"
                  isPassword
                  type="password"
                />
                <MyButton
                  label="Reset Password"
                  className="w-full"
                  loading={onResetPassword.isPending}
                  loadingLabel="Resetting password"
                />
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
