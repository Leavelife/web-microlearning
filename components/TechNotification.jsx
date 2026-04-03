"use client"

import { useEffect, useState } from "react"

export default function TechNotification({
  message,
  type = "info", // success | error | warning | info
  duration = 3000,
  onClose,
}) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(() => {
        onClose?.()
      }, 300) // kasih delay buat animasi keluar
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!visible) return null

  const typeStyles = {
    success: "bg-green-500/80",
    error: "bg-red-500/80",
    warning: "bg-yellow-500/80 text-black",
    info: "bg-purple-600/80",
  }

  return (
    <div className="fixed top-6 right-6 z-50 animate-slideIn px-5 py-2">
      <div
        className={`px-6 py-3 rounded-xl shadow-lg text-white font-medium transition-all duration-300 ${typeStyles[type]}`}
      >
        {message}
      </div>
    </div>
  )
}