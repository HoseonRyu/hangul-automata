'use client'

import { HeroSection } from '@/components/sections/HeroSection'
import { DFASection } from '@/components/sections/DFASection'
import { MealySection } from '@/components/sections/MealySection'
import { HangulSection } from '@/components/sections/HangulSection'
import { DokkaebiSection } from '@/components/sections/DokkaebiSection'

export default function Home() {
  return (
    <>
      <HeroSection />
      <div className="border-t border-border/30" />
      <DFASection />
      <div className="border-t border-border/30" />
      <MealySection />
      <div className="border-t border-border/30" />
      <HangulSection />
      <div className="border-t border-border/30" />
      <DokkaebiSection />
    </>
  )
}
