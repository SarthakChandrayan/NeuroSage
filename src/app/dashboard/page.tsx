import Dashboard from '@/components/Dashboard'
import { db } from '@/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation'

const Page = async () => {
  try {
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    if (!user || !user.id) {
      return redirect('/auth-callback?origin=dashboard')
    }

    const dbUser = await db.user.findFirst({
      where: {
        id: user.id
      }
    })

    if (!dbUser) {
      return redirect('/auth-callback?origin=dashboard')
    }

    return <Dashboard />
  } catch (error) {
    console.error('Dashboard page error:', error)
    return redirect('/auth-callback?origin=dashboard')
  }
}

export default Page
