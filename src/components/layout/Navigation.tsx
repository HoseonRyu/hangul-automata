'use client'

import { useTranslations } from 'next-intl'
import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Languages } from 'lucide-react'

function setLocaleCookie(locale: string) {
  document.cookie = `locale=${locale};path=/;max-age=31536000`
}

export function Navigation() {
  const t = useTranslations('nav')
  const [locale, setLocale] = useState<string>(() => {
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(/locale=(\w+)/)
      return match?.[1] || 'ko'
    }
    return 'ko'
  })
  const [, startTransition] = useTransition()

  const toggleLocale = () => {
    const newLocale = locale === 'ko' ? 'en' : 'ko'
    setLocale(newLocale)
    setLocaleCookie(newLocale)
    startTransition(() => {
      window.location.reload()
    })
  }

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="w-full px-6 md:px-12 lg:px-16 xl:px-24 h-14 flex items-center justify-between">
        <button
          onClick={() => scrollTo('hero')}
          className="font-bold text-lg tracking-tight"
        >
          {t('title')}
        </button>

        <div className="hidden md:flex items-center gap-1">
          {(['dfa', 'mealy', 'hangul', 'dokkaebi'] as const).map((section) => (
            <Button
              key={section}
              variant="ghost"
              size="sm"
              onClick={() => scrollTo(section)}
              className="text-sm"
            >
              {t(section)}
            </Button>
          ))}
        </div>

        <Button variant="ghost" size="sm" onClick={toggleLocale} className="gap-1.5">
          <Languages className="h-4 w-4" />
          <span className="text-xs font-mono">{locale === 'ko' ? 'EN' : '한'}</span>
        </Button>
      </div>
    </nav>
  )
}
