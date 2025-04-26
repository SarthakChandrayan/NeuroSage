'use client'

import { trpc } from '@/app/_trpc/client'
import ChatInput from './ChatInput'
import Messages from './Messages'
import { ChevronLeft, Loader2, XCircle } from 'lucide-react'
import Link from 'next/link'
import { buttonVariants } from '../ui/button'
import { ChatContextProvider } from './ChatContext'

interface ChatWrapperProps {
  fileId: string
}

const ChatWrapper = ({ fileId }: ChatWrapperProps) => {
  const { data, isLoading } = trpc.getFileUploadStatus.useQuery(
    {
      fileId,
    },
    {
      refetchInterval: (data) =>
        data?.status === 'SUCCESS' ||
        data?.status === 'FAILED'
          ? false
          : 500,
    }
  )

  if (isLoading)
    return (
      <div className='relative min-h-full bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col justify-between gap-2'>
        <div className='flex-1 flex justify-center items-center flex-col mb-28'>
          <div className='flex flex-col items-center gap-2'>
            <div className='w-16 h-16 relative animate-pulse'>
              <Loader2 className='h-16 w-16 text-indigo-500 animate-spin' />
            </div>
            <h3 className='font-semibold text-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text'>
              Loading...
            </h3>
            <p className='text-gray-500 dark:text-gray-400 text-sm'>
              We&apos;re preparing your PDF.
            </p>
          </div>
        </div>

        <ChatInput isDisabled />
      </div>
    )

  if (data?.status === 'PROCESSING')
    return (
      <div className='relative min-h-full bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col justify-between gap-2'>
        <div className='flex-1 flex justify-center items-center flex-col mb-28'>
          <div className='flex flex-col items-center gap-3'>
            <div className='w-16 h-16 relative animate-pulse'>
              <Loader2 className='h-16 w-16 text-indigo-500 animate-spin' />
            </div>
            <h3 className='font-semibold text-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text'>
              Processing PDF...
            </h3>
            <p className='text-gray-500 dark:text-gray-400 text-sm'>
              This won&apos;t take long.
            </p>
          </div>
        </div>

        <ChatInput isDisabled />
      </div>
    )

  if (data?.status === 'FAILED')
    return (
      <div className='relative min-h-full bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col justify-between gap-2'>
        <div className='flex-1 flex justify-center items-center flex-col mb-28'>
          <div className='flex flex-col items-center gap-3'>
            <XCircle className='h-16 w-16 text-red-500 animate-bounce' />
            <h3 className='font-semibold text-2xl text-red-500'>
              PDF Processing Failed
            </h3>
            <p className='text-gray-500 dark:text-gray-400 text-sm text-center max-w-md'>
              There was an error processing your PDF. Please try again with a different file.
            </p>
            <Link
              href='/dashboard'
              className={buttonVariants({
                variant: 'secondary',
                className: 'mt-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 shadow-lg',
              })}>
              <ChevronLeft className='h-4 w-4 mr-2' />
              Back to Dashboard
            </Link>
          </div>
        </div>

        <ChatInput isDisabled />
      </div>
    )

  return (
    <ChatContextProvider fileId={fileId}>
      <div className='relative min-h-full bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col justify-between gap-2'>
        <div className='flex-1 justify-between flex flex-col mb-28'>
          <Messages fileId={fileId} />
        </div>

        <ChatInput />
      </div>
    </ChatContextProvider>
  )
}

export default ChatWrapper
