import { useAuth } from '../../../lib/auth'
import { User, Shield, Key, Save } from 'lucide-react'
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
  const { user } = useAuth()

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-800">
          Pengaturan Akun
        </h2>
        <p className="text-slate-500 mt-1">
          Kelola informasi profil dan keamanan akun Anda.
        </p>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="border-b bg-slate-50/50">
          <CardTitle className="flex items-center gap-2 text-xl">
            <User className="w-5 h-5 text-primary" />
            Profil Pengguna
          </CardTitle>
          <CardDescription>Informasi dasar tentang akun Anda.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Avatar className="w-24 h-24 shadow-md bg-primary">
              <AvatarFallback className="text-4xl font-bold bg-primary text-primary-foreground">
                {user?.nama.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="text-2xl font-bold text-slate-800">
                {user?.nama}
              </h4>
              <p className="text-slate-500">{user?.role}</p>
              <Badge
                variant="secondary"
                className="mt-2 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 gap-1.5 py-1"
              >
                <Shield className="w-3.5 h-3.5" /> Akun Aktif
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
            <div className="space-y-2">
              <Label htmlFor="nama">Nama Lengkap</Label>
              <Input
                id="nama"
                readOnly
                value={user?.nama || ''}
                className="bg-slate-50 text-slate-600 font-medium cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                readOnly
                value={user?.username || ''}
                className="bg-slate-50 text-slate-600 font-medium cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role Akses</Label>
              <Input
                id="role"
                readOnly
                value={user?.role || ''}
                className="bg-slate-50 text-slate-600 font-medium cursor-not-allowed"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="border-b bg-slate-50/50">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Key className="w-5 h-5 text-indigo-500" />
            Keamanan (TBD)
          </CardTitle>
          <CardDescription>
            Ubah kata sandi dan pengaturan keamanan lainnya.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4 opacity-60 pointer-events-none">
          <div className="space-y-2">
            <Label htmlFor="current_password">Kata Sandi Saat Ini</Label>
            <Input
              id="current_password"
              type="password"
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new_password">Kata Sandi Baru</Label>
            <Input id="new_password" type="password" placeholder="••••••••" />
          </div>
          <div className="pt-2">
            <Button className="gap-2">
              <Save className="w-4 h-4" /> Simpan Kata Sandi
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
