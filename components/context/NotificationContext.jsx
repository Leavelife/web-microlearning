"use client"

import { createContext, useContext, useState } from "react"
import TechNotification from "@/components/TechNotification"

const NotificationContext = createContext()

export function NotificationProvider({ children }) {
  const [notif, setNotif] = useState(null)

  const showNotification = ({ message, type = "info", duration = 3000 }) => {
    setNotif({ message, type, duration })
  }

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}

      {notif && (
        <TechNotification
          message={notif.message}
          type={notif.type}
          duration={notif.duration}
          onClose={() => setNotif(null)}
        />
      )}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  return useContext(NotificationContext)
}