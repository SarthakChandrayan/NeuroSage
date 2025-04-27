import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation'
import Dashboard from '@/components/Dashboard'
import Analytics from '@/components/Analytics'

export const dynamic = 'force-dynamic'

const Page = async () => {
  const { getUser } = getKindeServerSession()
  const user = await getUser()

  if (!user || !user.id) {
    redirect('/auth-callback?origin=dashboard')
  }

  return (
    <main className='mx-auto max-w-7xl md:p-10'>
      <div className='mt-8 flex flex-col gap-8'>
        <Analytics />
        <Dashboard />
      </div>
    </main>
  )
}

export default Page
