'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from './ui/dialog'
import { Button } from './ui/button'

import Dropzone from 'react-dropzone'
import { Cloud, File, Loader2, Check } from 'lucide-react'
import { Progress } from './ui/progress'
import { useUploadThing } from '@/lib/uploadthing'
import { useToast } from './ui/use-toast'
import { trpc } from '@/app/_trpc/client'
import { useRouter } from 'next/navigation'

interface UploadButtonProps {
  isSubscribed: boolean
}

interface FileUploadStatus {
  status: 'PENDING' | 'PROCESSING' | 'FAILED' | 'SUCCESS'
  progress: number
  id: string
}

const UploadDropzone = ({ isSubscribed }: UploadButtonProps) => {
  const router = useRouter()
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [processingProgress, setProcessingProgress] = useState<number>(0)
  const [currentFile, setCurrentFile] = useState<string>('')
  const [fileId, setFileId] = useState<string>('')

  const { toast } = useToast()

  const { startUpload } = useUploadThing(
    isSubscribed ? 'proPlanUploader' : 'freePlanUploader'
  )

  const { data: fileStatus } = trpc.getFileUploadStatus.useQuery(
    { fileId },
    {
      enabled: fileId !== '',
      refetchInterval: (data) => 
        data?.status === 'PROCESSING' ? 500 : false,
      onSuccess: (data) => {
        if (!data) return

        if (data.status === 'PROCESSING') {
          setProcessingProgress(data.progress)
        } else if (data.status === 'FAILED') {
          toast({
            title: 'Upload failed',
            description: 'Your PDF file could not be processed. Please try again.',
            variant: 'destructive',
          })
          setIsUploading(false)
          setUploadProgress(0)
          setProcessingProgress(0)
          setFileId('')
        } else if (data.status === 'SUCCESS') {
          setIsUploading(false)
          setUploadProgress(100)
          setProcessingProgress(100)
          
          // Brief delay to show completion
          setTimeout(() => {
            router.push(`/dashboard/${data.id}`)
          }, 1000)
        }
      }
    }
  )

  const startSimulatedProgress = () => {
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval)
          return prev
        }
        return prev + 5
      })
    }, 100)

    return interval
  }

  return (
    <div className='p-2'>
      {!isUploading ? (
        <label
          htmlFor='dropzone-file'
          className='flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-900 dark:border-gray-600 dark:hover:border-gray-500'>
          <div className='flex flex-col items-center justify-center pt-5 pb-6'>
            <Cloud className='h-6 w-6 text-zinc-500 mb-2' />
            <p className='mb-2 text-sm text-zinc-700 dark:text-zinc-300'>
              <span className='font-semibold'>Click to upload</span> or drag and drop
            </p>
            <p className='text-xs text-zinc-500 dark:text-zinc-400'>PDF (up to {isSubscribed ? "32" : "16"}MB)</p>
          </div>

          <input
            id='dropzone-file'
            type='file'
            className='hidden'
            accept='.pdf'
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (!file) return

              if (file.size > (isSubscribed ? 32 : 16) * 1024 * 1024) {
                toast({
                  title: 'File too large',
                  description: `File size should be less than ${isSubscribed ? "32" : "16"}MB.`,
                  variant: 'destructive',
                })
                return
              }

              setCurrentFile(file.name)
              setIsUploading(true)
              const progressInterval = startSimulatedProgress()

              try {
                const res = await startUpload([file])
                if (!res) throw new Error('Upload failed')

                const [fileResponse] = res
                const key = fileResponse?.key
                if (!key) throw new Error('No file key received')

                clearInterval(progressInterval)
                setUploadProgress(100)
                setFileId(key)
              } catch (error) {
                clearInterval(progressInterval)
                setIsUploading(false)
                setFileId('')
                toast({
                  title: 'Upload failed',
                  description: 'Please try again later',
                  variant: 'destructive',
                })
              }
            }}
          />
        </label>
      ) : (
        <div className='flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600'>
          <div className='flex flex-col items-center justify-center pt-5 pb-6 gap-4 w-full px-8'>
            <div className='flex items-center justify-center gap-2'>
              <File className='h-8 w-8 text-blue-500' />
              <h3 className='font-semibold text-zinc-700 dark:text-zinc-300'>{currentFile}</h3>
            </div>

            <div className='w-full space-y-4'>
              <div className='flex items-center justify-between text-zinc-700 dark:text-zinc-300 text-sm'>
                <p>Uploading...</p>
                <p>{uploadProgress}%</p>
              </div>
              <Progress value={uploadProgress} className='h-1' />
              
              {uploadProgress === 100 && (
                <>
                  <div className='flex items-center justify-between text-zinc-700 dark:text-zinc-300 text-sm'>
                    <p>Processing...</p>
                    <p>{processingProgress}%</p>
                  </div>
                  <Progress value={processingProgress} className='h-1' />
                </>
              )}
            </div>

            <p className='text-sm text-zinc-500 dark:text-zinc-400'>
              {uploadProgress === 100 ? 'Processing your PDF...' : 'Uploading your PDF...'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

const UploadButton = ({ isSubscribed }: UploadButtonProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(visible) => {
        if (!visible) {
          setIsOpen(visible)
        }
      }}>
      <DialogTrigger onClick={() => setIsOpen(true)} asChild>
        <Button>Upload PDF</Button>
      </DialogTrigger>

      <DialogContent>
        <UploadDropzone isSubscribed={isSubscribed} />
      </DialogContent>
    </Dialog>
  )
}

export default UploadButton
