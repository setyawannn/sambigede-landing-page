import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Facebook,
  Instagram,
  Youtube,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react'
import type { FormEvent } from 'react'
import { useState, useEffect, useRef } from 'react'
import { useQuery, useAction } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import type { Id } from '../../../../convex/_generated/dataModel'
import { Turnstile } from '@marsidev/react-turnstile'
import type { TurnstileInstance } from '@marsidev/react-turnstile'

export default function KontakPage() {
  const kontakData = useQuery(api.kontak.getKontakConfig)
  const kategoriList = useQuery(api.pengaduan.getKategoriList)
  const insertPengaduan = useAction(api.pengaduan.insertPengaduan)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [cooldown, setCooldown] = useState(0)

  const [turnstileToken, setTurnstileToken] = useState<string>('')
  const turnstileRef = useRef<TurnstileInstance>(null)

  const getVisitorId = () => {
    let vid = localStorage.getItem('visitor_id')
    if (!vid) {
      vid = crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).substring(2)
      localStorage.setItem('visitor_id', vid)
    }
    return vid
  }

  // Client-side rate limit logic via localStorage
  useEffect(() => {
    const lastSubmitTime = localStorage.getItem('last_pengaduan_time')
    if (lastSubmitTime) {
      const elapsed = Date.now() - parseInt(lastSubmitTime)
      const cooldownTime = 60 * 1000 // 60 seconds cooldown
      if (elapsed < cooldownTime) {
        setCooldown(Math.ceil((cooldownTime - elapsed) / 1000))
      }
    }
  }, [])

  useEffect(() => {
    let timer: any
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000)
    }
    return () => clearInterval(timer)
  }, [cooldown])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (cooldown > 0) {
      setErrorMsg(`Harap tunggu ${cooldown} detik sebelum mengirim pesan lagi.`)
      return
    }

    if (!turnstileToken) {
      setErrorMsg('Mohon selesaikan verifikasi keamanan terlebih dahulu.')
      return
    }

    setErrorMsg('')
    setIsSubmitting(true)

    try {
      const visitorId = getVisitorId()
      await insertPengaduan({
        namaLengkap: formData.name,
        emailOrPhone: formData.email,
        kategoriId: formData.subject as Id<'kategori_pengaduan'>,
        detailPesan: formData.message,
        turnstileToken,
        visitorId,
      })

      setSubmitted(true)
      setFormData({ name: '', email: '', subject: '', message: '' })

      // Set cooldown
      localStorage.setItem('last_pengaduan_time', Date.now().toString())
      setCooldown(60)

      turnstileRef.current?.reset()
      setTurnstileToken('')

      setTimeout(() => setSubmitted(false), 5000)
    } catch (error: any) {
      console.error(error)
      setErrorMsg(
        error.message || 'Gagal mengirim pesan. Silakan coba lagi nanti.',
      )
      turnstileRef.current?.reset()
      setTurnstileToken('')
    } finally {
      setIsSubmitting(false)
    }
  }

  const jamPelayananLines = kontakData?.jamPelayanan?.split('\n') || [
    'Senin - Jumat: 08.00 - 15.00 WIB',
    'Sabtu - Minggu: Tutup',
  ]

  return (
    <div className="flex flex-col w-full bg-[#F5F5F5] min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white py-12 md:py-16 border-b border-[#E5E5E5]">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-[#3F7D4A]/10 text-[#3F7D4A] px-4 py-1.5 rounded-full mb-6 mx-auto">
            <Phone className="w-5 h-5" />
            <span className="text-sm font-semibold tracking-wide uppercase">
              Hubungi Kami
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-[#333] mb-6">
            Layanan Pengaduan & Kontak
          </h1>
          <p className="text-[#666] max-w-[600px] mx-auto text-sm md:text-base mb-10">
            Kami siap melayani Anda. Jangan ragu untuk menghubungi Pemerintah
            Desa Sambigede untuk informasi, layanan, atau pengaduan.
          </p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 w-full mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info Kontak & Maps */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-8 border border-[#E5E5E5] shadow-sm">
              <h2 className="text-xl font-bold text-[#333] mb-6 border-b border-[#E5E5E5] pb-4">
                Informasi Kontak
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-gray-50 group-hover:bg-[#3F7D4A] group-hover:text-white rounded-xl flex items-center justify-center text-[#3F7D4A] transition-colors shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#333] mb-1">
                      Alamat Kantor Desa
                    </h3>
                    <p className="text-sm text-[#666] leading-relaxed">
                      {kontakData?.alamat ||
                        'Jalan Raya Sambigede No. 01, Kec. Binangun, Kab. Blitar, Jawa Timur 66183'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-gray-50 group-hover:bg-[#3F7D4A] group-hover:text-white rounded-xl flex items-center justify-center text-[#3F7D4A] transition-colors shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#333] mb-1">
                      Telepon & WhatsApp
                    </h3>
                    <p className="text-sm text-[#666]">
                      {kontakData?.teleponKantor || '+62 822-5034-5977'}
                    </p>
                    {kontakData?.teleponDarurat && (
                      <p className="text-sm text-[#666] mt-1">
                        {kontakData.teleponDarurat} (WA)
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-gray-50 group-hover:bg-[#3F7D4A] group-hover:text-white rounded-xl flex items-center justify-center text-[#3F7D4A] transition-colors shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#333] mb-1">
                      Email Resmi
                    </h3>
                    <p className="text-sm text-[#666]">
                      {kontakData?.email || 'pemdes@sambigede.desa.id'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-gray-50 group-hover:bg-[#3F7D4A] group-hover:text-white rounded-xl flex items-center justify-center text-[#3F7D4A] transition-colors shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#333] mb-1">
                      Jam Pelayanan
                    </h3>
                    {jamPelayananLines.map((line, idx) => (
                      <p key={idx} className="text-sm text-[#666]">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#E5E5E5]">
                <h3 className="font-semibold text-[#333] mb-4 text-center">
                  Ikuti Sosial Media Kami
                </h3>
                <div className="flex justify-center gap-4">
                  {kontakData?.facebook && (
                    <a
                      href={kontakData.facebook}
                      target="_blank"
                      rel="noreferrer"
                      className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#666] hover:bg-blue-600 hover:text-white transition-colors"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                  )}
                  {kontakData?.instagram && (
                    <a
                      href={kontakData.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#666] hover:bg-pink-600 hover:text-white transition-colors"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                  {kontakData?.youtube && (
                    <a
                      href={kontakData.youtube}
                      target="_blank"
                      rel="noreferrer"
                      className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#666] hover:bg-red-600 hover:text-white transition-colors"
                    >
                      <Youtube className="w-5 h-5" />
                    </a>
                  )}
                  {!kontakData?.facebook &&
                    !kontakData?.instagram &&
                    !kontakData?.youtube && (
                      <p className="text-sm text-[#666]">
                        Belum ada tautan sosial media.
                      </p>
                    )}
                </div>
              </div>
            </div>
          </div>

          {/* Formulir Pengaduan */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 border border-[#E5E5E5] shadow-sm relative overflow-hidden">
              <h2 className="text-2xl font-bold text-[#333] mb-2">
                Kirim Pesan / Pengaduan
              </h2>
              <p className="text-[#666] text-sm mb-8">
                Silakan isi formulir di bawah ini dengan data yang valid.
                Laporan pengaduan akan dirahasiakan identitas pelapornya.
              </p>

              {errorMsg && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">{errorMsg}</p>
                </div>
              )}

              {submitted && (
                <div className="mb-6 p-4 bg-green-50 text-green-700 border border-green-200 rounded-xl flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <p className="text-sm font-medium">
                    Laporan Anda berhasil dikirim! Pemerintah Desa akan segera
                    meninjaunya.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#333]">
                      Nama Lengkap (Sesuai KTP)
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full bg-[#F9F9F9] border border-[#E5E5E5] focus:border-[#3F7D4A] rounded-lg px-4 py-3 outline-none text-[#333] transition-colors"
                      placeholder="Masukkan nama Anda..."
                      maxLength={100}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#333]">
                      Alamat Email / Nomor HP
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full bg-[#F9F9F9] border border-[#E5E5E5] focus:border-[#3F7D4A] rounded-lg px-4 py-3 outline-none text-[#333] transition-colors"
                      placeholder="Email atau No. Handphone..."
                      maxLength={100}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#333]">
                    Subjek / Kategori Laporan
                  </label>
                  <select
                    required
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="w-full bg-[#F9F9F9] border border-[#E5E5E5] focus:border-[#3F7D4A] rounded-lg px-4 py-3 outline-none text-[#333] transition-colors"
                  >
                    <option value="" disabled>
                      Pilih Kategori Laporan...
                    </option>
                    {kategoriList?.map((kategori) => (
                      <option key={kategori._id} value={kategori._id}>
                        {kategori.nama}
                      </option>
                    ))}
                    {!kategoriList && (
                      <option disabled>Memuat kategori...</option>
                    )}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#333]">
                    Detail Pesan
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full bg-[#F9F9F9] border border-[#E5E5E5] focus:border-[#3F7D4A] rounded-lg px-4 py-3 outline-none text-[#333] transition-colors resize-none"
                    placeholder="Jelaskan secara detail pesan atau laporan Anda di sini..."
                    maxLength={2000}
                  ></textarea>
                  <p className="text-xs text-right text-gray-400">
                    {formData.message.length}/2000
                  </p>
                </div>

                <div className="flex justify-center my-4">
                  <Turnstile
                    ref={turnstileRef}
                    siteKey={
                      import.meta.env.VITE_CLOUDFLARE_TURNSTILE_SITE_KEY || ''
                    }
                    onSuccess={(token) => {
                      setTurnstileToken(token)
                      setErrorMsg('')
                    }}
                    onError={() =>
                      setErrorMsg(
                        'Verifikasi keamanan gagal. Silakan muat ulang halaman.',
                      )
                    }
                    onExpire={() => {
                      setTurnstileToken('')
                      setErrorMsg(
                        'Verifikasi keamanan kedaluwarsa. Silakan ulangi.',
                      )
                    }}
                    options={{
                      theme: 'light',
                      size: 'normal',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || cooldown > 0}
                  className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all ${
                    isSubmitting || cooldown > 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-[#3F7D4A] hover:bg-[#1F3D2B]'
                  }`}
                >
                  {isSubmitting ? (
                    <span>Memproses...</span>
                  ) : cooldown > 0 ? (
                    <span>Tunggu {cooldown} detik</span>
                  ) : (
                    <>
                      <Send className="w-5 h-5" /> Kirim Pesan Sekarang
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Map Location */}
        <div className="mt-12 bg-white rounded-2xl p-4 border border-[#E5E5E5] shadow-sm">
          <div className="w-full h-[400px] bg-gray-100 rounded-xl overflow-hidden relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15802.730704443901!2d112.3385731!3d-8.1317658!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e78ead93c5d7945%3A0xc47e30d70b435b87!2sSambigede%2C%20Kec.%20Binangun%2C%20Kabupaten%20Blitar%2C%20Jawa%20Timur!5e0!3m2!1sid!2sid!4v1697241231234!5m2!1sid!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Peta Desa Sambigede"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  )
}
