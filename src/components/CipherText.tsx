import { useEffect, useRef } from "react"

export default function CipherText({ text }: { text: string }) {
  const chars = "!@#$%^&*()_+-=[]{}|;:,.<>?"
  const intervalRef = useRef<number>()

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return (
    <span className="cipher-text">
      {text.split("").map((char, index) => (
        <span
          key={index}
          className="cipher-char"
          data-char={char}
          data-scramble={chars[Math.floor(Math.random() * chars.length)]}
        >
          {char}
        </span>
      ))}
    </span>
  )
}

