import { useState } from 'react'
import { useAuth } from '../../../lib/auth'
import { useMutation } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import type { Id } from '../../../../convex/_generated/dataModel'
import { User, Shield, Lock, Save, Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../ui/card'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { Button } from '../../ui/button'
import { Badge } from '../../ui/badge'
import { Avatar, AvatarFallback } from '../../ui/avatar'

export default function AdminSettings() {
  const { user, logout } = useAuth()
  const changePassword = useMutation(api.users.changePassword)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Semua kolom kata sandi wajib diisi')
      return
    }

    if (newPassword.length < 8) {
      toast.error('Kata sandi baru minimal 8 karakter')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('Konfirmasi kata sandi tidak cocok')
      return
    }
    
    if (currentPassword === newPassword) {
      toast.error('Kata sandi baru tidak boleh sama dengan kata sandi saat ini')
      return
    }

    try {
      setIsSubmitting(true)
      await changePassword({
        id: user?.id as Id<'admin_users'>,
        currentPassword,
        newPassword,
      })
      
      toast.success('Kata sandi berhasil diubah. Silakan login kembali.')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      
      // Log user out to force re-login with new password
      setTimeout(() => {
         logout('Sesi Anda telah diperbarui. Silakan login kembali dengan sandi baru.')
      }, 1500)
      
    } catch (error: any) {
      toast.error(error.message || 'Gagal mengubah kata sandi')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-800">
          Pengaturan Akun
        </h2>
        <p className="text-slate-500 mt-1">
          Kelola informasi profil dan keamanan akun Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kolom Kiri: Profil Singkat */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="shadow-sm border-slate-100 overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-primary/10 to-primary/30 w-full" />
            <CardContent className="px-6 pb-6 pt-0 relative">
              <Avatar className="w-20 h-20 shadow-md border-4 border-white bg-primary absolute -top-10">
                <AvatarFallback className="text-3xl font-bold bg-primary text-primary-foreground">
                  {user?.nama.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="mt-12 space-y-1">
                <h4 className="text-xl font-bold text-slate-800 truncate">
                  {user?.nama}
                </h4>
                <div className="flex items-center gap-2 text-slate-500">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">@{user?.username}</span>
                </div>
                <div className="pt-3">
                  <Badge
                    variant="secondary"
                    className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 gap-1.5 py-1 px-3 border-none"
                  >
                    <Shield className="w-3.5 h-3.5" /> {user?.role}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kolom Kanan: Detail Profil & Keamanan */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="shadow-sm border-slate-100">
            <CardHeader className="border-b bg-slate-50/50 pb-4">
              <CardTitle className="text-lg font-semibold text-slate-800">
                Informasi Dasar
              </CardTitle>
              <CardDescription>
                Detail informasi profil pengguna Anda. Hubungi Superadmin jika terdapat ketidaksesuaian.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500">Nama Lengkap</p>
                  <p className="text-base font-medium text-slate-800">{user?.nama}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500">Username</p>
                  <p className="text-base font-medium text-slate-800">{user?.username}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-500">Role Akses</p>
                  <p className="text-base font-medium text-slate-800">{user?.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-100">
            <CardHeader className="border-b bg-slate-50/50 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                <Lock className="w-5 h-5 text-indigo-500" />
                Ganti Kata Sandi
              </CardTitle>
              <CardDescription>
                Pastikan akun Anda menggunakan kata sandi yang kuat dan aman.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="current_password">Kata Sandi Saat Ini</Label>
                  <div className="relative">
                    <Input
                      id="current_password"
                      type={showCurrentPassword ? 'text' : 'password'}
                      placeholder="Masukkan sandi saat ini"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="pr-10"
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="new_password">Kata Sandi Baru</Label>
                    <div className="relative">
                      <Input
                        id="new_password"
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder="Minimal 8 karakter"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="pr-10"
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm_password">Ulangi Kata Sandi Baru</Label>
                    <div className="relative">
                      <Input
                        id="confirm_password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Ketik ulang sandi baru"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pr-10"
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto gap-2">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" /> Simpan Kata Sandi
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
