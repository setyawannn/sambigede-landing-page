import React, { useState, useRef } from 'react'
import { UploadCloud, Image as ImageIcon, X, Loader2 } from 'lucide-react'
import { uploadFileHelper } from '../../lib/upload-helper'
import R2Image from './R2Image'

export interface ImageUploadProps {
  value?: string
  onChange: (url: string, key?: string) => void
  onError?: (error: string) => void
  className?: string
}

export function ImageUpload({
  value,
  onChange,
  onError,
  className = '',
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      const err = 'File harus berupa gambar.'
      onError?.(err)
      alert(err)
      return
    }

    setIsUploading(true)
    try {
      const result = await uploadFileHelper(file)
      if (result.success && (result.fileKey || result.fileUrl)) {
        // Simpan fileKey (relative filename) ke state form
        const keyToSave = result.fileKey || result.fileUrl || ''
        onChange(keyToSave, result.fileKey)
      } else {
        const err = result.error || 'Terjadi kesalahan saat mengunggah.'
        onError?.(err)
        alert(err)
      }
    } catch (err: unknown) {
      console.error(err)
      const errMsg = err instanceof Error ? err.message : String(err)
      onError?.(errMsg)
      alert('Terjadi kesalahan sistem saat mengunggah.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      void handleUpload(file)
    }
  }

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl transition-all duration-200 ${className || 'h-48'}`}
    >
      {value ? (
        <div className="relative w-full h-full rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex justify-center items-center group">
          {/* Preview Image */}
          <R2Image
            src={value}
            alt="Uploaded preview"
            className="w-full h-full object-contain"
          />
          {/* Overlay to remove or change */}
          <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-2 p-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-white text-slate-800 text-xs font-semibold px-3 py-2 rounded-lg shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              Ganti
            </button>
            <button
              type="button"
              onClick={() => onChange('', undefined)}
              className="bg-red-500 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-sm hover:bg-red-600 transition-colors flex items-center gap-1"
              title="Hapus"
            >
              <X className="w-4 h-4" />
              Hapus
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`w-full h-full min-h-[140px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer p-4 text-center transition-all duration-200 ${
            isDragging
              ? 'border-emerald-500 bg-emerald-50/40'
              : 'border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-100/30'
          } ${isUploading ? 'opacity-75 pointer-events-none' : ''}`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center text-slate-600">
              <Loader2 className="w-7 h-7 animate-spin text-emerald-600 mb-2" />
              <p className="font-semibold text-xs sm:text-sm">
                Mengunggah & Mengompresi...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-slate-500">
              <UploadCloud className="w-8 h-8 text-slate-400 mb-2 transition-colors" />
              <p className="font-semibold text-xs sm:text-sm text-slate-700">
                <span className="text-emerald-600 hover:underline">
                  Klik untuk mengunggah
                </span>
              </p>
              <p className="text-slate-400 text-xs mt-1">
                atau seret dan lepas
              </p>
              <p className="text-[10px] text-slate-400 mt-2 bg-slate-100 px-2 py-0.5 rounded-full">
                WebP / PNG / JPG
              </p>
            </div>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  )
}
