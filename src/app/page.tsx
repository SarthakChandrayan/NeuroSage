import Link from 'next/link'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { ArrowRight, Upload, Brain, MessageSquare } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import Image from 'next/image'
import '../styles/landing.css'
import PDFPreviewAnimation from '@/components/PDFPreviewAnimation'

export default function Home() {
  return (
    <>
      <MaxWidthWrapper className="mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center">
        <div className="hero-gradient absolute inset-0 -z-10" />
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        
        <div className="mx-auto mb-4 flex max-w-fit items-center justify-center space-x-2 overflow-hidden rounded-full title-badge px-8 py-3 shadow-md transition-all hover:border-gray-300 hover:bg-white/50">
          <p className="text-base font-semibold title-text">
            NeuroSage is now public!
          </p>
          
        </div>
        <h1 className="max-w-4xl text-4xl font-bold md:text-5xl lg:text-6xl">
          Chat with your <span className="gradient-text">documents</span> in seconds.
        </h1>
        <p className="mt-5 max-w-prose text-zinc-700 sm:text-lg">
          NeuroSage allows you to have conversations with any PDF document.
          Simply upload your file and start asking questions right away.
        </p>

        <Link
          className={buttonVariants({
            size: 'lg',
            className: 'mt-5',
          })}
          href="/dashboard">
          Get started <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </MaxWidthWrapper>

      {/* Interactive Preview section */}
      <div className="relative isolate">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mt-16 flow-root sm:mt-24">
            <div className="-m-2 rounded-xl lg:-m-4 lg:rounded-2xl lg:p-4">
              <PDFPreviewAnimation />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mx-auto max-w-6xl px-6 lg:px-8 mt-24">
        <h2 className="text-3xl font-bold text-center mb-12 gradient-text">Why Choose NeuroSage?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="feature-gradient-1 p-6 rounded-2xl">
            <div className="h-12 w-12 rounded-lg bg-white/10 flex items-center justify-center mb-4">
              <Upload className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy Upload</h3>
            <p className="text-gray-400">Upload your PDF documents with a simple drag and drop interface.</p>
          </div>
          <div className="feature-gradient-2 p-6 rounded-2xl">
            <div className="h-12 w-12 rounded-lg bg-white/10 flex items-center justify-center mb-4">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
            <p className="text-gray-400">Advanced AI processes your documents for meaningful insights.</p>
          </div>
          <div className="feature-gradient-3 p-6 rounded-2xl">
            <div className="h-12 w-12 rounded-lg bg-white/10 flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Interactive Chat</h3>
            <p className="text-gray-400">Chat with your documents and get instant, accurate responses.</p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="mx-auto max-w-6xl px-6 lg:px-8 py-24">
        <h2 className="text-4xl font-bold text-center mb-16">
          <span className="gradient-text">Meet the Team</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Team Member 1 */}
          <div className="group flex flex-col items-center text-center p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/30 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <h3 className="relative text-xl font-bold whitespace-nowrap">
              <span className="gradient-text">Akshat Kumar Sharma</span>
            </h3>
            <Link 
              href="https://www.linkedin.com/in/akshat-kumar-sharma-a54669247/"
              target="_blank"
              className="mt-6 relative transform group-hover:scale-110 transition-transform duration-300"
            >
              <Image 
                src="/linkedin.png" 
                alt="LinkedIn" 
                width={40} 
                height={40} 
                className="drop-shadow-lg"
              />
            </Link>
          </div>

          {/* Team Member 2 */}
          <div className="group flex flex-col items-center text-center p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/30 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <h3 className="relative text-xl font-bold whitespace-nowrap">
              <span className="gradient-text">Sarthak Chandrayan</span>
            </h3>
            <Link 
              href="https://www.linkedin.com/in/sarthak-chandrayan-98a755159/"
              target="_blank"
              className="mt-6 relative transform group-hover:scale-110 transition-transform duration-300"
            >
              <Image 
                src="/linkedin.png" 
                alt="LinkedIn" 
                width={40} 
                height={40} 
                className="drop-shadow-lg"
              />
            </Link>
          </div>

          {/* Team Member 3 */}
          <div className="group flex flex-col items-center text-center p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/30 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <h3 className="relative text-xl font-bold whitespace-nowrap">
              <span className="gradient-text">Agresh Prakash</span>
            </h3>
            <Link 
              href="https://www.linkedin.com/in/agresh-prakash-2706a121b/"
              target="_blank"
              className="mt-6 relative transform group-hover:scale-110 transition-transform duration-300"
            >
              <Image 
                src="/linkedin.png" 
                alt="LinkedIn" 
                width={40} 
                height={40} 
                className="drop-shadow-lg"
              />
            </Link>
          </div>

          {/* Team Member 4 */}
          <div className="group flex flex-col items-center text-center p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/30 backdrop-blur-sm border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <h3 className="relative text-xl font-bold whitespace-nowrap">
              <span className="gradient-text">Lokesh Kumar Sinha</span>
            </h3>
            <Link 
              href="https://www.linkedin.com/in/lokesh-kumar-sinha-bb09b721b/"
              target="_blank"
              className="mt-6 relative transform group-hover:scale-110 transition-transform duration-300"
            >
              <Image 
                src="/linkedin.png" 
                alt="LinkedIn" 
                width={40} 
                height={40} 
                className="drop-shadow-lg"
              />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
