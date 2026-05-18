"use client";

import { useState } from "react";
import { Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteProduct } from "@/services/product.service";

interface DeleteProductDialogProps {
  productId: number | null;
  productName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function DeleteProductDialog({
  productId,
  productName,
  open,
  onOpenChange,
  onSuccess,
}: DeleteProductDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!productId) return;

    setIsDeleting(true);
    try {
      await deleteProduct(productId);
      toast.success("Produk berhasil dihapus");
      onSuccess(); 
      onOpenChange(false);
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 403) {
        toast.error("Gagal: Anda bukan pemilik produk ini.");
      } else if (status === 404) {
        toast.error("Produk sudah tidak ada.");
      } else {
        toast.error("Terjadi kesalahan saat menghapus produk.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl border-0 shadow-2xl max-w-[400px]">
        <AlertDialogHeader className="flex flex-col items-center text-center">
          <div className="p-3 bg-red-50 rounded-full text-red-500 mb-2">
            <AlertTriangle size={32} />
          </div>
          <AlertDialogTitle className="text-xl font-bold text-[#143A52]">
            Hapus Produk?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm">
            Apakah Anda yakin ingin menghapus{" "}
            <span className="font-bold text-black italic">"{productName}"</span>
            ? Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 gap-2 sm:gap-0">
          <AlertDialogCancel
            disabled={isDeleting}
            className="flex-1 border-gray-200 text-gray-600 font-semibold"
          >
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault(); 
              handleDelete();
            }}
            disabled={isDeleting}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Ya, Hapus"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
