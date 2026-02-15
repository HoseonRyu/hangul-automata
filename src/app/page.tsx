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
      <DFASection />
      <MealySection />
      <HangulSection />
      <DokkaebiSection />
    </>
  )
}
