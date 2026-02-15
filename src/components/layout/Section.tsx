interface SectionProps {
  id: string
  children: React.ReactNode
  className?: string
}

export function Section({ id, children, className = '' }: SectionProps) {
  return (
    <section
      id={id}
      className={`
        min-h-[calc(100dvh-3.5rem)] w-full
        snap-start snap-always
        flex flex-col justify-center
        px-6 md:px-12 lg:px-16 xl:px-24
        py-8
        ${className}
      `}
    >
      {children}
    </section>
  )
}
