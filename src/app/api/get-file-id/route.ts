import { db } from '@/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  try {
    const { getUser } = getKindeServerSession()
    const user = getUser()

    if (!user || !user.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const url = new URL(req.url)
    const key = url.searchParams.get('key')

    if (!key) {
      return new NextResponse('Missing key parameter', { status: 400 })
    }

    // Log the search attempt
    console.log('Searching for file with key:', key)
    console.log('User ID:', user.id)

    const file = await db.file.findFirst({
      where: {
        key: key,
        userId: user.id,
      },
    })

    if (!file) {
      // Try searching without file extension
      const keyWithoutExt = key.split('.')[0]
      console.log('Trying without extension:', keyWithoutExt)
      
      const fileWithoutExt = await db.file.findFirst({
        where: {
          key: keyWithoutExt,
          userId: user.id,
        },
      })

      if (!fileWithoutExt) {
        // Log all files for this user to help debug
        const allUserFiles = await db.file.findMany({
          where: { userId: user.id },
          select: { id: true, key: true },
        })
        console.log('All user files:', allUserFiles)
        
        return new NextResponse('File not found', { status: 404 })
      }

      return NextResponse.json({ fileId: fileWithoutExt.id })
    }

    return NextResponse.json({ fileId: file.id })
  } catch (error) {
    console.error('Error in get-file-id:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
} 