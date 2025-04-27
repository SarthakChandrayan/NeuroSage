'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Cloud, File, Loader2 } from 'lucide-react'
import { Progress } from './ui/progress'
import { useUploadThing } from '@/lib/uploadthing'
import { useToast } from './ui/use-toast'
import { useRouter } from 'next/navigation'

interface UploadButtonProps {
  isSubscribed: boolean
}

const UploadDropzone = ({ isSubscribed }: UploadButtonProps) => {
  const router = useRouter()
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [currentFile, setCurrentFile] = useState<string>('')
  const { toast } = useToast()

  const { startUpload } = useUploadThing(
    isSubscribed ? 'proPlanUploader' : 'freePlanUploader'
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

                // Simple redirect with the key
                router.push(`/dashboard/${key}`)
              } catch (error) {
                clearInterval(progressInterval)
                setIsUploading(false)
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

            <div className='w-full space-y-2'>
              <div className='flex items-center justify-between text-zinc-700 dark:text-zinc-300 text-sm'>
                <p>Uploading...</p>
                <p>{uploadProgress}%</p>
              </div>
              <Progress value={uploadProgress} className='h-1' />

              <div className="flex gap-1 items-center justify-center text-sm text-zinc-700 text-center pt-2">
                <Loader2 className="h-3 w-3 animate-spin" />
                Uploading your PDF...
              </div>
            </div>
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
