import { Fetch } from "@/lib/fetcher";
import { handleResponseError } from "@/lib/handle-error";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { UserSchema, type UserFormType } from "./user-schema";

const useUserForm = (userId?: string, dialogClose?: () => void) => {
  interface UserData {
    data: UserFormType;
  }
  const queryClient = useQueryClient();

  async function fetchUser(): Promise<UserFormType> {
    const res = await Fetch<UserData>({
      method: "GET",
      url: `/users/${userId}`,
    });
    return res.data;
  }
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(),
    enabled: !!userId,
  });

  const userForm = useForm<UserFormType>({
    resolver: zodResolver(UserSchema),
    values: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      password: user?.password || "",
      confirmPassword: user?.password || "",
      PhoneNumber: user?.PhoneNumber || "",
    },
  });
  const reset = userForm.reset;

  const control = userForm.control;
  const resetForm = () => {
    reset({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      password: user?.password || "",
      confirmPassword: user?.password || "",
      PhoneNumber: user?.PhoneNumber || "",
    });
  };

  const createUser = useMutation({
    mutationFn: async (user: UserFormType) => {
      await Fetch<object>({
        method: userId ? "PATCH" : "POST",
        url: userId ? `/user-positions/${userId}` : "user-positions",
        data: user,
      })
        .then(() => {
          if (userId) {
            toast.success("User updated Successfully");
          } else {
            toast.success("User created Successfully");
            queryClient.invalidateQueries({ queryKey: ["users"] });
            resetForm();
          }
          if (dialogClose) {
            dialogClose();
          }
          queryClient.invalidateQueries({ queryKey: ["users"] });
        })
        .catch((err) => handleResponseError(err, userForm));
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
  const onSubmit = userForm.handleSubmit((data) => {
    createUser.mutate(data);
  });
  const deleteUser = useMutation({
    mutationFn: async () => {
      return Fetch({
        url: `/user-positions/${userId}`,
        method: "DELETE",
      }).then(() => {
        toast.success("user deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["users"] });
      });
    },
  });
  const onDelete = () => {
    deleteUser.mutate();
  };
  return {
    user,
    userForm,
    resetForm,
    onSubmit,
    control,
    isLoading,
    isPending: createUser.isPending,
    isError,
    onDelete,
  };
};

export default useUserForm;
