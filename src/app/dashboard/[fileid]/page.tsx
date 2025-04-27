import ChatWrapper from '@/components/chat/ChatWrapper'
import PdfRenderer from '@/components/PdfRenderer'
import { db } from '@/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { notFound, redirect } from 'next/navigation'
import { Loader2 } from 'lucide-react'

interface PageProps {
  params: {
    fileid: string
  }
}

const Page = async ({ params }: PageProps) => {
  const { fileid } = params

  const { getUser } = getKindeServerSession()
  const user = await getUser()

  if (!user || !user.id)
    redirect(`/auth-callback?origin=dashboard/${fileid}`)

  // Try to find file by ID first
  let file = await db.file.findFirst({
    where: {
      id: fileid,
      userId: user.id,
    },
  })

  // If not found by ID, try to find by key
  if (!file) {
    file = await db.file.findFirst({
      where: {
        key: fileid,
        userId: user.id,
      },
    })
  }

  // If still not found, show loading state instead of 404
  // This gives time for the file to be processed
  if (!file) {
    return (
      <div className='flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]'>
        <div className='mx-auto w-full max-w-8xl grow lg:flex xl:px-2'>
          <div className='flex-1 xl:flex'>
            <div className='px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6'>
              <div className='flex flex-col items-center justify-center h-full'>
                <Loader2 className='h-8 w-8 animate-spin text-blue-500' />
                <h3 className='mt-2 text-xl font-semibold'>Processing your PDF...</h3>
                <p className='text-zinc-500 text-sm mt-1'>This may take a moment.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]'>
      <div className='mx-auto w-full max-w-8xl grow lg:flex xl:px-2'>
        {/* Left sidebar & main wrapper */}
        <div className='flex-1 xl:flex'>
          <div className='px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6'>
            {/* Main area */}
            <PdfRenderer url={file.url} />
          </div>
        </div>

        <div className='shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0'>
          <ChatWrapper fileId={file.id} />
        </div>
      </div>
    </div>
  )
}

export default Page
