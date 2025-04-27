'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { ArrowRight } from 'lucide-react'
import { Button } from './ui/button'
import Link from 'next/link'

// Dynamically import the 3D component
const PDFPreview3D = dynamic(
  () => import('./pdf-preview'),
  { ssr: false }
)

export default function PDFPreviewAnimation() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="relative h-[900px] w-full rounded-2xl overflow-hidden bg-gradient-to-b from-white to-gray-50 shadow-xl">
      {/* Content */}
      <div className="relative h-full w-full">
        {mounted && <PDFPreview3D />}
        
        {/* Call to action overlay */}
        <div className="absolute bottom-0 inset-x-0 flex flex-col items-center gap-6 pb-20">
          {/* Content */}
          <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00DC82] to-[#0047E1]">
                Ready to transform how you interact with documents?
              </h2>
            </div>
            <p className="mt-4 text-lg md:text-xl text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed">
              Experience the power of AI-driven document analysis. Upload your first PDF and see the magic happen.
            </p>
            <Link href="/dashboard" className="inline-block mt-8">
              <Button className="bg-gradient-to-r from-[#00DC82] to-[#0047E1] text-white hover:opacity-90 transition-opacity px-8 py-6 text-lg font-semibold shadow-lg">
                Try NeuroSage Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 