import FormGroupLabel from "@/components/shared/form-group-label";
import MyButton from "@/components/shared/my-button";
import { Form } from "@/components/ui/form";
import { TextInput } from "../../form-components/text-input";
import useUserForm from "./use-user-form";
import LoadingSpinner from "@/components/shared/loader";
import { PhoneNumberInput } from "../../form-components/phone-input";

const UserForm = ({
  userId,
  dialogClose,
}: {
  userId?: string;
  dialogClose?: () => void;
}) => {
  const { userForm, onSubmit, isLoading, resetForm, control, isPending } =
    useUserForm(userId, dialogClose);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Form {...userForm}>
      <form onSubmit={onSubmit}>
        <FormGroupLabel label={userId ? "Update User" : "Create New User"} />
        <div className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <TextInput
              control={control}
              name="firstName"
              label="First Name"
              required
            />
            <TextInput
              control={control}
              name="lastName"
              label="Last Name"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <TextInput control={control} name="email" label="Email" required />
            <PhoneNumberInput
              control={control}
              name="PhoneNumber"
              label="Phone Number"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2  gap-2">
            <TextInput
              control={control}
              name="password"
              label="Password"
              required
            />
            <TextInput
              control={control}
              name="confirmPassword"
              label="Confirm Password"
              required
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <MyButton
            label="Reset"
            className="bg-primary hover:bg-primary/50"
            type="reset"
            onClick={resetForm}
          />
          <MyButton label="Save" loading={isPending} loadingLabel="Saving" />
        </div>
      </form>
    </Form>
  );
};

export default UserForm;
