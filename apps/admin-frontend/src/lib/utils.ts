import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Fetch } from "@/lib/fetcher";
import { toast } from "sonner";
import { handleResponseError } from "./handle-error";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function uploadFile(file: File) {
  const formData = new FormData();
  formData?.append("file", file);
  try {
    const response = await Fetch({
      method: "POST",
      data: formData,
      url: "/upload-file",
    });

    toast.success("File uploaded Successfully");
    return response;
  } catch (err: any) {
    return handleResponseError(err, "File upload");
  }
}
