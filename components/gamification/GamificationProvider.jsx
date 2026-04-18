"use client"

import { createContext, useContext, useState, useEffect, useRef } from "react"

const GamificationContext = createContext()

export function GamificationProvider({ children }) {
  const [data, setData] = useState(null)
  const [animatedExp, setAnimatedExp] = useState(0)
  const [queue, setQueue] = useState([])
  const [current, setCurrent] = useState(null)
  const [toast, setToast] = useState(null)
  const expTimerRef = useRef(null)
  const pushToQueue = (items) => {
    if (!items || items.length === 0) return
    setQueue((prev) => [...prev, ...items])
  }

  const showGamification = (payload) => {
    if (!payload) return

    const items = []

    // Prioritaskan popup level-up agar tidak tenggelam oleh popup EXP.
    if (payload.levelUp) {
      items.push({
        type: "LEVEL",
        value: payload.levelUp,
      })
      setToast({ type: "LEVEL", value: payload.levelUp })
    }

    if (payload.expGained > 0) {
      items.push({
        type: "EXP",
        value: payload.expGained,
        targetExp: payload.newTotalExp,
      })
      if (!payload.levelUp) {
        setToast({ type: "EXP", value: payload.expGained })
      }
    }

    if (payload.unlockedAchievements?.length > 0) {
      payload.unlockedAchievements.forEach((achievement, index) => {
        items.push({
          type: "ACHIEVEMENT",
          value: achievement,
        })
        if (!payload.expGained && !payload.levelUp && index === 0) {
          setToast({ type: "ACHIEVEMENT", value: achievement })
        }
      })
    }

    pushToQueue(items)
  }

  const closeGamification = () => {
    setCurrent(null)
  }

  const animateExp = (targetExp) => {
    if (typeof targetExp !== "number" || Number.isNaN(targetExp)) return

    if (expTimerRef.current) {
      clearInterval(expTimerRef.current)
      expTimerRef.current = null
    }

    expTimerRef.current = setInterval(() => {
      setAnimatedExp((prev) => {
        if (prev >= targetExp) {
          if (expTimerRef.current) {
            clearInterval(expTimerRef.current)
            expTimerRef.current = null
          }
          return targetExp
        }

        const step = Math.max(1, Math.round((targetExp - prev) / 10))
        return Math.min(targetExp, prev + step)
      })
    }, 50)
  }

  useEffect(() => {
    if (!current && queue.length > 0) {
      setCurrent(queue[0])
      setQueue((prev) => prev.slice(1))
    }
  }, [queue, current])

  useEffect(() => {
    if (current?.type === "EXP") {
      animateExp(current.targetExp)
    }
  }, [current?.type, current?.targetExp])
  useEffect(() => {
    if (toast) {
      const timeout = setTimeout(() => {
        setToast(null)
      }, 2000)

      return () => clearTimeout(timeout)
    }
  }, [toast])

  useEffect(() => {
    return () => {
      if (expTimerRef.current) {
        clearInterval(expTimerRef.current)
      }
    }
  }, [])

  const next = () => {
    setCurrent(null)
  }

  return (
    <GamificationContext.Provider
      value={{ data, showGamification, closeGamification, animateExp, animatedExp, current, next, toast }}
    >
      {children}
    </GamificationContext.Provider>
  )
}

export function useGamification() {
  return useContext(GamificationContext)
}