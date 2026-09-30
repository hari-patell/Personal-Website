interface SectionHeaderProps {
  title: string
  subtitle?: string
}

export default function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <header className="text-center mb-14 sm:mb-20">
      <h2 className="font-serif text-5xl sm:text-6xl md:text-7xl font-medium text-stone-900 dark:text-cream-100 tracking-tight leading-none">
        {title}
      </h2>
      <div className="serif-divider mt-8"></div>
      {subtitle && (
        <p className="mt-8 text-stone-500 dark:text-cream-300 text-sm sm:text-base max-w-xl mx-auto px-2 font-light">
          {subtitle}
        </p>
      )}
    </header>
  )
}
