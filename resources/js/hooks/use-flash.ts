
import { usePage } from "@inertiajs/react";
import { useEffect } from "react";
import { toast } from "sonner";

export const useFlash = () => {
  const { flash } = usePage<FalshProps>().props;

  useEffect(() => {
    if (flash?.success) toast.success(flash.success);
    if (flash?.error) toast.error(flash.error);
  }, [flash]);
};
