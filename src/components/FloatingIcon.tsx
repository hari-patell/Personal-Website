import type React from "react"

interface FloatingIconProps {
  children: React.ReactNode
  delay: string
  size?: "small" | "default" | "large"
  position?: { top?: string; left?: string; right?: string; bottom?: string }
}

export default function FloatingIcon({
  children,
  delay,
  size = "default",
  position,
}: FloatingIconProps) {
  const sizeDimensions = {
    small: "48px",
    default: "56px",
    large: "64px",
  }

  const paddingClasses = {
    small: "p-2.5",
    default: "p-3",
    large: "p-3.5",
  }

  const delayNum = delay.match(/\d+/)?.[0] || "0"
  const delayInt = parseInt(delayNum, 10)
  
  const defaultPosition = position ? position : {
    left: `${(delayInt * 13 + 7) % 85 + Math.floor((delayInt * 17) % 10)}%`,
    top: `${(delayInt * 17 + 3) % 80 + Math.floor((delayInt * 13) % 15)}%`,
  }

  const animationClass = `animate-float-${(delayInt % 3) + 1}`
  const rotation = (delayInt * 7) % 10 - 5

  return (
    <div
      className={`absolute ${animationClass} backdrop-blur-sm bg-zinc-900/30 rounded-2xl border border-zinc-800/30 z-0 flex items-center justify-center`}
      style={{ 
        ...defaultPosition,
        width: sizeDimensions[size],
        height: sizeDimensions[size],
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <div className={`flex items-center justify-center w-full h-full ${paddingClasses[size]}`}>
        {children}
      </div>
    </div>
  )
}

