'use client'

import { useTranslations } from 'next-intl'
import { useState, useEffect, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Languages } from 'lucide-react'

const SECTIONS = ['hero', 'dfa', 'mealy', 'hangul', 'dokkaebi'] as const

function setLocaleCookie(locale: string) {
  document.cookie = `locale=${locale};path=/;max-age=31536000`
}

export function Navigation() {
  const t = useTranslations('nav')
  const [activeSection, setActiveSection] = useState<string>('hero')
  const [locale, setLocale] = useState<string>(() => {
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(/locale=(\w+)/)
      return match?.[1] || 'ko'
    }
    return 'ko'
  })
  const [, startTransition] = useTransition()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
            history.replaceState(null, '', entry.target.id === 'hero' ? window.location.pathname : `#${entry.target.id}`)
          }
        }
      },
      { threshold: 0.5 }
    )

    for (const id of SECTIONS) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [])

  const toggleLocale = () => {
    const newLocale = locale === 'ko' ? 'en' : 'ko'
    setLocale(newLocale)
    setLocaleCookie(newLocale)
    startTransition(() => {
      window.location.reload()
    })
  }

  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (hash) {
      const el = document.getElementById(hash)
      if (el) el.scrollIntoView({ block: 'start' })
    }
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      history.replaceState(null, '', id === 'hero' ? window.location.pathname : `#${id}`)
    }
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="w-full px-6 md:px-12 lg:px-16 xl:px-24 h-14 flex items-center justify-between">
        <button
          onClick={() => scrollTo('hero')}
          className="font-bold text-xl tracking-tight"
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
              className={`text-base transition-colors ${
                activeSection === section
                  ? 'text-blue-400 bg-blue-500/10'
                  : ''
              }`}
            >
              {t(section)}
            </Button>
          ))}
        </div>

        <Button variant="ghost" size="sm" onClick={toggleLocale} className="gap-1.5">
          <Languages className="h-5 w-5" />
          <span className="text-sm font-mono">{locale === 'ko' ? 'EN' : '한'}</span>
        </Button>
      </div>
    </nav>
  )
}
