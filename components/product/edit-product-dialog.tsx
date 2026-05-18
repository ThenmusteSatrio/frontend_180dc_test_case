"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateProduct } from "@/services/product.service";

const editProductSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  // description: z.string().optional(),
  price: z.coerce.number().min(1, "Harga harus lebih dari 0"),
});

type EditProductValues = z.infer<typeof editProductSchema>;

interface EditProductDialogProps {
  product: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditProductDialog({ product, open, onOpenChange, onSuccess }: EditProductDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditProductValues>({
    resolver: zodResolver(editProductSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        // description: product.description || "",
        price: product.price,
      });
    }
  }, [product, reset]);

  const onSubmit = async (values: EditProductValues) => {
    try {
      await updateProduct(product.id, values);
      toast.success("Produk berhasil diperbarui!");
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Gagal memperbarui produk");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] rounded-2xl border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#143A52]">Edit Produk</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name" className="text-[#143A52] font-medium">Nama Produk</Label>
            <Input
              id="edit-name"
              {...register("name")}
              className="focus-visible:ring-[#40FFD5]"
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-price" className="text-[#143A52] font-medium">Harga</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm border-r pr-2">Rp</span>
              <Input
                id="edit-price"
                type="number"
                className="pl-12 focus-visible:ring-[#40FFD5]"
                {...register("price")}
              />
            </div>
            {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
          </div>

          {/* <div className="space-y-2">
            <Label htmlFor="edit-description" className="text-[#143A52] font-medium">Deskripsi</Label>
            <Textarea
              id="edit-description"
              className="focus-visible:ring-[#40FFD5] resize-none h-24"
              {...register("description")}
            />
          </div> */}

          <DialogFooter className="pt-4 flex gap-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#143A52] hover:bg-[#1b4d6d] text-white flex-1 font-bold"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Simpan Perubahan"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-200 text-gray-600 flex-1"
            >
              Batal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}