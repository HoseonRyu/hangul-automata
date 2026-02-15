interface SectionProps {
  id: string
  children: React.ReactNode
  className?: string
}

export function Section({ id, children, className = '' }: SectionProps) {
  return (
    <section
      id={id}
      className={`py-16 md:py-24 scroll-mt-16 ${className}`}
    >
      <div className="max-w-6xl mx-auto px-4">
        {children}
      </div>
    </section>
  )
}
