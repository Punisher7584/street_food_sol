"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ToastProps {
  title?: string
  description?: string
  variant?: "default" | "destructive" | "success"
  onClose?: () => void
}

export function Toast({ title, description, variant = "default", onClose }: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 w-full max-w-sm rounded-lg border p-4 shadow-lg",
        "animate-in slide-in-from-top-2 duration-300",
        {
          "bg-white border-gray-200": variant === "default",
          "bg-red-50 border-red-200": variant === "destructive",
          "bg-green-50 border-green-200": variant === "success",
        },
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          {title && (
            <div
              className={cn("font-semibold text-sm", {
                "text-gray-900": variant === "default",
                "text-red-900": variant === "destructive",
                "text-green-900": variant === "success",
              })}
            >
              {title}
            </div>
          )}
          {description && (
            <div
              className={cn("text-sm mt-1", {
                "text-gray-600": variant === "default",
                "text-red-700": variant === "destructive",
                "text-green-700": variant === "success",
              })}
            >
              {description}
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className={cn("flex-shrink-0 rounded-md p-1 hover:bg-gray-100", {
            "text-gray-400 hover:text-gray-600": variant === "default",
            "text-red-400 hover:text-red-600 hover:bg-red-100": variant === "destructive",
            "text-green-400 hover:text-green-600 hover:bg-green-100": variant === "success",
          })}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

// Toast context and hook
interface ToastContextType {
  toast: (props: Omit<ToastProps, "onClose">) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Array<ToastProps & { id: string }>>([])

  const toast = React.useCallback((props: Omit<ToastProps, "onClose">) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { ...props, id }])
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {toasts.map((toastProps) => (
        <Toast key={toastProps.id} {...toastProps} onClose={() => removeToast(toastProps.id)} />
      ))}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
