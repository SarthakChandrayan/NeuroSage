import Link from 'next/link'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { ArrowRight, Upload, Brain, MessageSquare, CheckCircle, Code, Database } from 'lucide-react'
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
        <h1 className="max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl">
          Transform Your <span className="gradient-text">Documents</span> into Interactive Knowledge
        </h1>
        <p className="mt-5 max-w-prose text-zinc-700 sm:text-lg">
          Experience the future of document interaction. Upload any PDF and engage in natural conversations, 
          get instant insights, and unlock the power of your documents with AI.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link
            className={buttonVariants({
              size: 'lg',
              className: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300',
            })}
            href="/dashboard">
            Try It Now <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <Link
            className={buttonVariants({
              size: 'lg',
              variant: 'outline',
              className: 'bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all duration-300',
            })}
            href="#tech-stack">
            Tech Stack
          </Link>
        </div>
      </MaxWidthWrapper>

      {/* How It Works Section */}
      <div id="how-it-works" className="relative py-24 bg-gradient-to-b from-transparent to-white/5">
        <MaxWidthWrapper>
          <h2 className="text-4xl font-bold text-center mb-16">
            <span className="gradient-text">How It Works</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="step-card relative">
              <div className="absolute -left-4 -top-4 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">1</div>
              <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 h-full transform hover:scale-105 transition-all duration-300">
                <Upload className="h-8 w-8 mb-4 text-blue-500" />
                <h3 className="text-xl font-bold mb-2">Upload Your Document</h3>
                <p className="text-zinc-600">Simply drag and drop your PDF file into our secure platform.</p>
              </div>
            </div>
            <div className="step-card relative">
              <div className="absolute -left-4 -top-4 w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">2</div>
              <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 h-full transform hover:scale-105 transition-all duration-300">
                <Brain className="h-8 w-8 mb-4 text-purple-500" />
                <h3 className="text-xl font-bold mb-2">AI Processing</h3>
                <p className="text-zinc-600">Our AI analyzes and understands your document's content in seconds.</p>
              </div>
            </div>
            <div className="step-card relative">
              <div className="absolute -left-4 -top-4 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">3</div>
              <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 h-full transform hover:scale-105 transition-all duration-300">
                <MessageSquare className="h-8 w-8 mb-4 text-indigo-500" />
                <h3 className="text-xl font-bold mb-2">Start Chatting</h3>
                <p className="text-zinc-600">Ask questions and get instant, accurate responses from your document.</p>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </div>

      {/* Interactive Preview section */}
      <div className="relative isolate">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mt-24 mb-16 flow-root">
            <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-inset ring-white/10">
              <PDFPreviewAnimation />
            </div>
          </div>
        </div>
      </div>

      {/* Tech Stack Section */}
      <div id="tech-stack" className="mx-auto max-w-6xl px-6 lg:px-8 mt-24">
        <h2 className="text-3xl font-bold text-center mb-12 gradient-text">Technology Stack</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="feature-card group p-6 rounded-2xl bg-gradient-to-br from-blue-600/10 to-purple-600/10 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-300">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Code className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Frontend</h3>
            <ul className="text-gray-400 text-left list-disc list-inside">
              <li>Next.js 14</li>
              <li>TypeScript</li>
              <li>Tailwind CSS</li>
              <li>Shadcn UI</li>
            </ul>
          </div>
          <div className="feature-card group p-6 rounded-2xl bg-gradient-to-br from-purple-600/10 to-indigo-600/10 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-300">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI & ML</h3>
            <ul className="text-gray-400 text-left list-disc list-inside">
              <li>OpenAI GPT-4</li>
              <li>LangChain</li>
              <li>Vector Embeddings</li>
              <li>PDF Processing</li>
            </ul>
          </div>
          <div className="feature-card group p-6 rounded-2xl bg-gradient-to-br from-indigo-600/10 to-blue-600/10 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-300">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <Database className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Backend & Storage</h3>
            <ul className="text-gray-400 text-left list-disc list-inside">
              <li>Pinecone Vector DB</li>
              <li>Uploadthing</li>
              <li>Kinde Auth</li>
              <li>Prisma ORM</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="mx-auto max-w-6xl px-6 lg:px-8 py-24">
        <h2 className="text-4xl font-bold text-center mb-16">
          <span className="gradient-text">The Team</span>
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
                className="drop-shadow-lg hover:brightness-110"
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
                className="drop-shadow-lg hover:brightness-110"
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
                className="drop-shadow-lg hover:brightness-110"
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
                className="drop-shadow-lg hover:brightness-110"
              />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
