import { cn } from '@/lib/utils'
import { ExtendedMessage } from '@/types/message'
import { Icons } from '../Icons'
import ReactMarkdown from 'react-markdown'
import { format } from 'date-fns'
import { forwardRef } from 'react'

interface MessageProps {
  message: ExtendedMessage
  isNextMessageSamePerson: boolean
}

const Message = forwardRef<HTMLDivElement, MessageProps>(
  ({ message, isNextMessageSamePerson }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-end', {
          'justify-end': message.isUserMessage,
        })}>
        <div
          className={cn(
            'relative flex h-8 w-8 aspect-square items-center justify-center',
            {
              'order-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-lg':
                message.isUserMessage,
              'order-1 bg-gradient-to-br from-gray-900 to-gray-800 rounded-full shadow-lg':
                !message.isUserMessage,
              'opacity-0': isNextMessageSamePerson,
            }
          )}>
          {message.isUserMessage ? (
            <Icons.user className='fill-white text-white h-4 w-4' />
          ) : (
            <Icons.logo className='fill-white h-5 w-5' />
          )}
        </div>

        <div
          className={cn(
            'flex flex-col space-y-2 text-base max-w-md mx-3',
            {
              'order-1 items-end': message.isUserMessage,
              'order-2 items-start': !message.isUserMessage,
            }
          )}>
          <div
            className={cn(
              'px-4 py-2 rounded-2xl inline-block shadow-md transition-all duration-200',
              {
                'bg-gradient-to-br from-indigo-500 to-purple-600 text-white hover:shadow-lg':
                  message.isUserMessage,
                'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:shadow-lg':
                  !message.isUserMessage,
                'rounded-br-lg':
                  !isNextMessageSamePerson &&
                  message.isUserMessage,
                'rounded-bl-lg':
                  !isNextMessageSamePerson &&
                  !message.isUserMessage,
              }
            )}>
            {typeof message.text === 'string' ? (
              <ReactMarkdown
                className={cn('prose max-w-none', {
                  'text-zinc-50 prose-headings:text-zinc-50 prose-p:text-zinc-50 prose-strong:text-zinc-50': 
                    message.isUserMessage,
                  'prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-800 dark:prose-p:text-gray-200':
                    !message.isUserMessage
                })}>
                {message.text}
              </ReactMarkdown>
            ) : (
              message.text
            )}
            {message.id !== 'loading-message' ? (
              <div
                className={cn(
                  'text-xs select-none mt-2 w-full text-right font-medium',
                  {
                    'text-gray-200 dark:text-gray-400': !message.isUserMessage,
                    'text-indigo-100': message.isUserMessage,
                  }
                )}>
                {format(
                  new Date(message.createdAt),
                  'HH:mm'
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    )
  }
)

Message.displayName = 'Message'

export default Message
