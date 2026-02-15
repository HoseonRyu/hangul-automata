'use client'

import { useTranslations } from 'next-intl'

export function Footer() {
  const t = useTranslations('footer')

  return (
    <footer className="border-t border-border/50 py-8">
      <div className="max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground">
        <p>{t('description')}</p>
        <p className="mt-2 text-xs">{t('builtWith')}</p>
      </div>
    </footer>
  )
}
