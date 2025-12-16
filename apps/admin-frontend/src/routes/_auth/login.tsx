import { TextInput } from "@/components/forms/form-components/text-input";
import LoginForm from "@/components/forms/forms/login-form";
import MyButton from "@/components/shared/my-button";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Fetch } from "@/lib/fetcher";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
export const Route = createFileRoute("/_auth/login")({
  component: RouteComponent,
});

const SignUpSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  middleName: z.string().optional(),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email().min(1, { message: "Email is required" }),
  mobileNumber: z.string().min(1, { message: "Phone number is required" }),
});

type SignUpFormType = z.infer<typeof SignUpSchema>;

function RouteComponent() {
  const [isLogin, setIsLogin] = useState(true);

  const signUpForm = useForm<SignUpFormType>({
    resolver: zodResolver(SignUpSchema),
  });

  const onSignUpSubmit = (data: SignUpFormType) => {
    onSignUp.mutate(data);
  };
  const onSignUp = useMutation({
    mutationFn: (data: SignUpFormType) => {
      const dataWithRoles = {...data,roles:["user"]}
      return Fetch({
        url: "/authentication/sign-up",
        method: "POST",
        data: dataWithRoles,
      });
    },
    onSuccess: () => {
      toast.success("Sign up successful");
      signUpForm.reset();
      setIsLogin(true);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="container max-w-3xl mx-auto">
        <div className="mb-8 flex justify-center items-center">
          <img src={"/logo (1) 1.png"} alt="logo" />
        </div>
        <div className="flex flex-col gap-1 w-full mb-4">
          <div className="font-semibold text-2xl text-primary leading-10 ">
            {isLogin ? "Sign in to your account" : "Create an account"}
          </div>
          <div className="text-lg  leading-6 font-normal text-text">
            {isLogin
              ? "Enter your credentials to access the portal"
              : "Get started with your recruitment journey"}
          </div>
        </div>

        <Card className="p-4 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div
              onClick={() => setIsLogin(true)}
              className={`cursor-pointer  ${isLogin ? "text-primary  border-b-[2px] border-primary" : "text-text"}`}
            >
              Sign In
            </div>
            <div
              onClick={() => setIsLogin(false)}
              className={`cursor-pointer  ${isLogin ? "text-text" : "text-primary border-b-[2px] border-primary"}`}
            >
              Sign Up
            </div>
          </div>
          <hr className="-mt-[16px]" />
          {isLogin ? (
            <LoginForm />
          ) : (
            <Form {...signUpForm}>
              <form
                onSubmit={signUpForm.handleSubmit(onSignUpSubmit)}
                className="flex flex-col gap-4"
              >
                <div className="grid grid-cols-3 gap-2">
                  <TextInput
                    name="firstName"
                    control={signUpForm.control}
                    label="First Name"
                    required
                    placeholder="Enter your first name"
                  />
                  <TextInput
                    name="middleName"
                    control={signUpForm.control}
                    label="Middle Name"
                    placeholder="Enter your middle name"
                  />
                  <TextInput
                    name="lastName"
                    control={signUpForm.control}
                    label="Last Name"
                    required
                    placeholder="Enter your last name"
                  />
                </div>
                <TextInput
                  type="email"
                  name="email"
                  control={signUpForm.control}
                  label="Email"
                  placeholder="Enter your email"
                  required
                />
                <TextInput
                  name="mobileNumber"
                  control={signUpForm.control}
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  required
                />
                <MyButton
                  label="Sign Up"
                  className="w-full"
                  loading={onSignUp.isPending}
                  loadingLabel="Signing up..."
                />
              </form>
            </Form>
          )}
        </Card>
      </div>
    </div>
  );
}
