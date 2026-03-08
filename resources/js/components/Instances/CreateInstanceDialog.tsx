// resources/js/Components/Instances/CreateInstanceDialog.tsx
import {useForm } from "@inertiajs/react";
import { Loader2, PlusCircle } from "lucide-react";
import { useState } from "react";
import { store } from "@/routes/profile";
import { Button } from "../ui/button"; 
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from  "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function CreateInstanceDialog() {
  const [open, setOpen] = useState(false);



  const form = useForm({
    name: "",
    phone_number: "",
  });

  const onSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    
    form.post(store().url, {
      preserveScroll: true,
      onSuccess: () => {
        form.reset();
        setOpen(false);
      },
    });
  };

  // Reset modal state when closed
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> 
            Connect New Number
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" style={{maxWidth:"600px"}}>
        
          <form onSubmit={onSubmit}> 
            <DialogHeader>
              <DialogTitle>Create WhatsApp Instance</DialogTitle>
              <DialogDescription>
                Enter a friendly name for this connection. You will scan the QR code next.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name Instance
                </Label>
                <Input
                  id="name"
                  value={form.data.name}
                  onChange={(e) => form.setData("name", e.target.value)}
                  className="col-span-3"
                  placeholder="e.g. Sales Team"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Number
                </Label>
                <Input
                  id="phone"
                  value={form.data.phone_number}
                  onChange={(e) => form.setData("phone_number", e.target.value)}
                  className="col-span-3"
                  placeholder="e.g. 15551234567"
                />
              </div>
              {form.errors.name && (
                <div className="text-red-500 text-sm text-right">{form.errors.name}</div>
              )}
            </div>
            <DialogFooter>
              <Button type="submit" disabled={form.processing}>
                {form.processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Profil
              </Button>
            </DialogFooter>
          </form>

      </DialogContent>
    </Dialog>
  );
}