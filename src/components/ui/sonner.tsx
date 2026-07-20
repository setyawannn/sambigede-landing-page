'use client'

import type { ToasterProps } from 'sonner'
import { Toaster as Sonner } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group !z-[99999]"
      position="top-right"
      richColors
      style={{ zIndex: 99999 }}
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-white group-[.toaster]:text-slate-900 group-[.toaster]:border-slate-200 group-[.toaster]:shadow-lg rounded-xl',
          description: 'group-[.toast]:text-slate-500',
          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-white',
          cancelButton:
            'group-[.toast]:bg-slate-100 group-[.toast]:text-slate-500',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
