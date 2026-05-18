"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ChevronLeft, Loader2, PackagePlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { createProduct } from "@/services/product.service";
import Link from "next/link";
import { productSchema } from "@/lib/validator";

type ProductFormValues = z.infer<typeof productSchema>;

export default function CreateProductPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    mode: "onBlur", 
  });

  const onSubmit = async (values: ProductFormValues) => {
    try {
      await createProduct(values);
      toast.success("Produk berhasil ditambahkan!");
      router.push("/products"); // Expected result: Redirect ke daftar
      router.refresh();
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 401) {
        toast.error("Sesi berakhir, silakan login kembali");
        router.push("/login");
      } else {
        toast.error(error?.response?.data?.message || "Gagal membuat produk");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Breadcrumb Navigation - Test Case 4 */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link href="/products" className="hover:text-[#143A52] transition-colors">Produk</Link>
          <ChevronLeft size={14} className="rotate-180" />
          <span className="text-[#143A52] font-semibold">Tambah Baru</span>
        </nav>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-[#143A52] rounded-lg text-white">
            <PackagePlus size={24} />
          </div>
          <h1 className="text-2xl font-bold text-[#143A52]">Tambah Produk Baru</h1>
        </div>

        <Card className="p-8 border-0 shadow-xl rounded-2xl bg-white">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#143A52] font-medium">Nama Produk</Label>
              <Input
                id="name"
                placeholder="Contoh: Kopi Susu Gula Aren"
                {...register("name")}
                className={`focus-visible:ring-[#40FFD5] ${errors.name ? "border-red-500" : ""}`}
              />
              {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-[#143A52] font-medium">Harga</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-semibold border-r pr-2">
                  Rp
                </span>
                <Input
                  id="price"
                  type="number"
                  placeholder="0"
                  {...register("price")}
                  className="pl-12 focus-visible:ring-[#40FFD5]"
                />
              </div>
              {errors.price && <p className="text-xs text-red-500 font-medium">{errors.price.message}</p>}
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="description" className="text-[#143A52] font-medium">Deskripsi (Opsional)</Label>
              <Textarea
                id="description"
                placeholder="Jelaskan detail produk Anda..."
                className="min-h-[120px] focus-visible:ring-[#40FFD5] resize-none"
                {...register("description")}
              />
            </div> */}

            <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-[#143A52] hover:bg-[#1b4d6d] text-white h-11 font-bold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Produk"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1 border-[#143A52] text-[#143A52] hover:bg-gray-50 h-11 font-semibold"
              >
                Batal
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}