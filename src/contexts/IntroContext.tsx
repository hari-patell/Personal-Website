import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

type Phase = 'enter' | 'swirl' | 'done'

interface IntroCtx {
  phase: Phase
  startSwirl: () => void
  completeIntro: () => void
}

const IntroContext = createContext<IntroCtx>({
  phase: 'done',
  startSwirl: () => {},
  completeIntro: () => {},
})

export function IntroProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>(() => {
    if (typeof window === 'undefined') return 'done'
    // Intro is desktop-only (CreationBackground is hidden on mobile)
    if (!window.matchMedia('(min-width: 768px)').matches) return 'done'
    return sessionStorage.getItem('introSeen') ? 'done' : 'enter'
  })

  const startSwirl = useCallback(
    () => setPhase(p => (p === 'enter' ? 'swirl' : p)),
    [],
  )

  const completeIntro = useCallback(() => {
    sessionStorage.setItem('introSeen', '1')
    setPhase('done')
  }, [])

  return (
    <IntroContext.Provider value={{ phase, startSwirl, completeIntro }}>
      {children}
    </IntroContext.Provider>
  )
}

export const useIntro = () => useContext(IntroContext)
