"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import {
  Search,
  Plus,
  MoreVertical,
  PackageOpen,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Edit2,
  Trash2,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { getProducts } from "@/services/product.service";
import { useRouter } from "next/navigation";
import { EditProductDialog } from "@/components/product/edit-product-dialog";
import { DeleteProductDialog } from "@/components/product/delete-product-dialog";
import { logout } from "@/lib/auth";

interface Product {
  id: number;
  name: string;
  price: number;
  created_at: string;
}

interface PaginationData {
  page: number;
  total_pages: number;
  total: number;
}

export default function ProductListPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    total_pages: 1,
    total: 0,
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const [sort, setSort] = useState<{ by: string; order: "asc" | "desc" }>({
    by: "created_at",
    order: "desc",
  });

  const loadData = async (page: number) => {
    setLoading(true);
    try {
      const result = await getProducts({
        page,
        limit: 10,
        search: debouncedSearch,
        sort_by: sort.by,
        sort_order: sort.order,
      });

      if (result.success) {
        setProducts(result.data);
        setPagination(result.pagination);
      }
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Gagal mengambil data produk");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(1);
  }, [debouncedSearch, sort]);

  const handleEditClick = (product: Product) => {
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleLogout = () => {
    logout();
    toast.success("Berhasil keluar");
    router.replace("/login");
  };

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(number);
  };

  return (
    <div className="p-4 md:p-10 space-y-6 w-full mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#143A52]">Daftar Produk</h1>
          <p className="text-sm text-muted-foreground">
            Kelola semua inventaris Anda di sini.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 gap-2 h-10"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Keluar</span>
          </Button>
          <Button
            onClick={() => router.push("/products/new")}
            className="bg-[#143A52] hover:bg-[#3D6E8A] text-white gap-2"
          >
            <Plus size={18} /> Tambah Produk
          </Button>
        </div>
      </div>

      <Card className="p-4 border-0 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <Input
            placeholder="Cari nama produk..."
            className="pl-10 focus-visible:ring-[#40FFD5]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          onClick={() =>
            setSort({
              by: "name",
              order: sort.order === "asc" ? "desc" : "asc",
            })
          }
          className="gap-2 border-gray-200"
        >
          <ArrowUpDown size={16} /> Sort Nama
        </Button>
      </Card>

      <Card className="border-0 shadow-md overflow-hidden rounded-xl bg-white">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="text-[#143A52] font-bold w-[50%]">
                Produk
              </TableHead>
              <TableHead className="text-[#143A52] font-bold w-[20%]">
                Harga
              </TableHead>
              <TableHead className="text-[#143A52] font-bold w-[20%]">
                Tgl Dibuat
              </TableHead>
              <TableHead className="text-right text-[#143A52] font-bold w-[10%]">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow
                  key={i}
                  className="hover:bg-gray-50/50 border-b group transition-all duration-200 ease-in-out"
                >
                  <TableCell>
                    <Skeleton className="h-5 w-40" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-32" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-8 ml-auto rounded-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : products.length > 0 ? (
              products.map((product) => (
                <TableRow
                  key={product.id}
                  className="hover:bg-gray-50/50 group transition-colors group"
                >
                  <TableCell className="font-medium text-[#143A52]">
                    {product.name}
                  </TableCell>
                  <TableCell>{formatRupiah(product.price)}</TableCell>
                  <TableCell>
                    {new Date(product.created_at).toLocaleDateString("id-ID")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="opacity-100 md:opacity-0 group-hover:md:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-[#3D6E8A] hover:bg-[#5BAAB8]/10"
                          >
                            <MoreVertical size={18} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEditClick(product)}
                            className="gap-2 cursor-pointer"
                          >
                            <Edit2 size={14} /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(product)}
                            className="gap-2 cursor-pointer text-red-600 focus:text-red-600"
                          >
                            <Trash2 size={14} /> Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-[400px] text-center">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="p-4 bg-gray-50 rounded-full">
                      <PackageOpen size={48} className="text-[#5BAAB8]" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-semibold text-[#143A52]">
                        Belum ada produk
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Mulai tambahkan produk pertama Anda untuk melihat daftar
                        di sini.
                      </p>
                    </div>
                    <Button className="bg-[#143A52] hover:bg-[#3D6E8A]">
                      Tambah Produk Pertama
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {!loading && products.length > 0 && (
          <div className="p-4 flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 bg-gray-50/50 gap-4">
            <p className="text-sm text-muted-foreground">
              Menampilkan{" "}
              <span className="font-medium text-[#143A52]">
                {products.length}
              </span>{" "}
              dari <span className="font-medium">{pagination.total}</span>{" "}
              produk
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === 1}
                onClick={() => loadData(pagination.page - 1)}
                className="border-gray-300 hover:bg-white"
              >
                <ChevronLeft size={16} /> Prev
              </Button>

              <div className="hidden sm:flex items-center gap-1 px-1">
                {Array.from({ length: pagination.total_pages }).map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => loadData(pageNum)}
                      className={`h-8 w-8 rounded-md text-sm font-semibold transition-all ${
                        pagination.page === pageNum
                          ? "bg-[#143A52] text-white shadow-md"
                          : "text-[#3D6E8A] hover:bg-gray-200"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={
                  pagination.page === pagination.total_pages ||
                  pagination.total_pages === 0
                }
                onClick={() => loadData(pagination.page + 1)}
                className="border-gray-300 hover:bg-white"
              >
                Next <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </Card>
      <EditProductDialog
        product={selectedProduct}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSuccess={() => loadData(pagination.page)}
      />
      <DeleteProductDialog
        productId={productToDelete?.id || null}
        productName={productToDelete?.name || ""}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onSuccess={() => loadData(pagination.page)}
      />
    </div>
  );
}
