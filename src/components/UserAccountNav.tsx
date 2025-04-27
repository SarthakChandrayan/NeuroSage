'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Button } from './ui/button'
import { Avatar, AvatarFallback } from './ui/avatar'
import Image from 'next/image'
import Link from 'next/link'
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/server'

interface UserAccountNavProps {
  email: string | undefined
  name: string
  imageUrl: string
}

const UserAccountNav = ({
  email,
  imageUrl,
  name,
}: UserAccountNavProps) => {
  // Get initials for fallback
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className='overflow-visible'>
        <Button className='rounded-full h-8 w-8 aspect-square bg-slate-100 hover:bg-slate-200'>
          <Avatar className='relative w-8 h-8'>
            {imageUrl ? (
              <div className='relative aspect-square h-full w-full'>
                <Image
                  fill
                  src={imageUrl}
                  alt='profile picture'
                  referrerPolicy='no-referrer'
                  className='rounded-full object-cover'
                />
              </div>
            ) : (
              <AvatarFallback className='bg-primary text-primary-foreground'>
                <span className='text-sm font-medium'>{initials}</span>
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className='bg-white' align='end'>
        <div className='flex items-center justify-start gap-2 p-2'>
          <div className='flex flex-col space-y-0.5 leading-none'>
            {name && (
              <p className='font-medium text-sm text-black'>
                {name}
              </p>
            )}
            {email && (
              <p className='w-[200px] truncate text-xs text-zinc-700'>
                {email}
              </p>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href='/dashboard' className='cursor-pointer w-full'>Dashboard</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className='cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50'>
          <LogoutLink className='w-full'>Log out</LogoutLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserAccountNav
