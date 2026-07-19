import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Search, Plus, Pencil as Edit, Trash2, Newspaper, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import type { Id, Doc } from "../../../../convex/_generated/dataModel";
import { deleteFileFromR2 } from "../../../lib/r2";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

import { Card, CardContent, CardHeader } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { Badge } from "../../ui/badge";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "../../ui/dialog";
import { Label } from "../../ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../../ui/select";
import { Textarea } from "../../ui/textarea";
import { Skeleton } from "../../ui/skeleton";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "../../ui/alert-dialog";

export default function AdminBerita() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const [activeAuthor, setActiveAuthor] = useState<string>("Semua");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const berita = useQuery(
    api.berita.getBeritaListFiltered,
    { 
      title: searchTerm, 
      category: activeCategory,
      author: activeAuthor
    }
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeCategory, activeAuthor]);

  const totalItems = berita?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedBerita = berita?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ) || [];

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const kategoriList = useQuery(api.kategori.getKategori) || [];
  const authorList = useQuery(api.users.getAdminUsers) || [];

  const deleteBerita = useMutation(api.berita.deleteBerita);

  const [deleteItem, setDeleteItem] = useState<Doc<"berita"> | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = (item: Doc<"berita">) => {
    setDeleteItem(item);
  };

  const confirmDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!deleteItem) return;
    setIsDeleting(true);
    try {
      if (deleteItem.imageKey) {
        await deleteFileFromR2({ data: { fileKey: deleteItem.imageKey } });
      }
      await deleteBerita({ id: deleteItem._id });
      toast.success("Berita berhasil dihapus");
      setDeleteItem(null);
    } catch (error) {
      console.error("Gagal menghapus berita", error);
      toast.error("Gagal menghapus berita");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">Manajemen Berita</h2>
          <p className="text-slate-500 mt-1">Kelola artikel dan berita desa.</p>
        </div>
        <Button onClick={() => navigate({ to: '/admin/berita/tambah' })} className="gap-2">
          <Plus className="w-4 h-4" /> Tambah Berita
        </Button>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="p-4 border-b bg-slate-50/50 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input 
              type="text" 
              placeholder="Cari judul berita..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-white"
            />
          </div>
          
          <div className="flex w-full md:w-auto gap-3 items-center">
            <Select value={activeCategory} onValueChange={setActiveCategory}>
              <SelectTrigger className="w-full md:w-[180px] bg-white">
                <SelectValue placeholder="Semua Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Semua">Semua Kategori</SelectItem>
                {kategoriList.map(kat => (
                  <SelectItem key={kat._id} value={kat.nama}>{kat.nama}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={activeAuthor} onValueChange={setActiveAuthor}>
              <SelectTrigger className="w-full md:w-[180px] bg-white">
                <SelectValue placeholder="Semua Penulis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Semua">Semua Penulis</SelectItem>
                {authorList.map(author => (
                  <SelectItem key={author._id} value={author.nama}>{author.nama}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-semibold text-slate-700">Judul & Detail</TableHead>
                <TableHead className="font-semibold text-slate-700">Kategori</TableHead>
                <TableHead className="font-semibold text-slate-700">Penulis</TableHead>
                <TableHead className="text-right font-semibold text-slate-700">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {berita === undefined ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-4">
                        <Skeleton className="w-12 h-12 rounded-lg" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-48" />
                          <Skeleton className="h-3 w-64" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Skeleton className="w-8 h-8 rounded" />
                        <Skeleton className="w-8 h-8 rounded" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : berita.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-slate-500">
                    Tidak ada berita yang ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedBerita.map((item: any) => (
                  <TableRow key={item._id} className="hover:bg-slate-50/50">
                    <TableCell className="py-4">
                      <div className="flex items-center gap-4">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.title} className="w-12 h-12 rounded-lg object-cover shadow-sm" />
                        ) : (
                          <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center shadow-sm">
                            <Newspaper className="w-5 h-5 text-slate-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-slate-800 line-clamp-1">{item.title}</p>
                          <p className="text-xs text-slate-500 line-clamp-1 max-w-sm mt-0.5">{item.excerpt}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium">
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 font-medium text-slate-700">{item.author}</TableCell>
                    <TableCell className="py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/admin/berita/edit/$id', params: { id: item._id } })} className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(item)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          
          {/* Pagination Controls */}
          {berita !== undefined && berita.length > 0 && (
            <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-slate-500">
                Menampilkan <span className="font-medium text-slate-700">{startItem}</span> sampai <span className="font-medium text-slate-700">{endItem}</span> dari <span className="font-medium text-slate-700">{totalItems}</span> data
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <span>Baris per halaman:</span>
                  <Select value={String(itemsPerPage)} onValueChange={(val) => {
                    setItemsPerPage(Number(val));
                    setCurrentPage(1);
                  }}>
                    <SelectTrigger className="w-16 h-8 bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-8 h-8"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    title="Sebelumnya"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const page = i + 1;
                    if (
                      totalPages > 5 &&
                      page !== 1 &&
                      page !== totalPages &&
                      Math.abs(page - currentPage) > 1
                    ) {
                      if (page === 2 || page === totalPages - 1) {
                        return <span key={page} className="px-1 text-slate-400">...</span>;
                      }
                      return null;
                    }

                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        className={`w-8 h-8 p-0 ${currentPage === page ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    );
                  })}

                  <Button
                    variant="outline"
                    size="icon"
                    className="w-8 h-8"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    title="Selanjutnya"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteItem !== null} onOpenChange={(open) => !open && setDeleteItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Berita</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Berita "{deleteItem?.title}" akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={confirmDelete}
            >
              {isDeleting ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
