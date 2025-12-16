/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "sonner";
import { type FetchError } from "./fetcher";

export function handleResponseError(res: FetchError, form?: any) {
  if ("errors" in res) {
    for (const key in res.errors) {
      if (form) {
        form.setError(key, {
          type: "server",
          message: res.errors[key],
        });
      }
    }
  } else {
    const message = res.message;
    if (typeof message === "string") {
      toast.error(message);
    } else if (Array.isArray(message) && message[0]) {
      toast.error(message[0]);
    } else {
      toast.error("An error occurred");
    }
  }
}
