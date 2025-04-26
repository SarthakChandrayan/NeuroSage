'use client'

import { trpc } from '@/app/_trpc/client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Metric, Text, Title, AreaChart } from '@tremor/react'
import { Ghost, MessageSquare } from 'lucide-react'
import { format } from 'date-fns'

const Analytics = () => {
  const { data: files } = trpc.getUserFiles.useQuery()
  const { data: messages } = trpc.getFileMessages.useQuery(
    files?.[0]?.id ?? ''
  )

  // Prepare data for charts
  const messagesByDate = messages?.reduce((acc: any, message) => {
    const date = format(new Date(message.createdAt), 'MMM dd')
    if (!acc[date]) {
      acc[date] = 0
    }
    acc[date]++
    return acc
  }, {})

  const chartData = Object.entries(messagesByDate || {}).map(([date, count]) => ({
    date,
    messages: count,
  }))

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
      {/* Files Overview */}
      <Card className='lg:col-span-4'>
        <CardHeader>
          <CardTitle>Document Analytics</CardTitle>
          <CardDescription>
            Your document usage and interaction metrics
          </CardDescription>
        </CardHeader>
        <CardContent className='pl-2'>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="messages" fill="#0047E1" opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className='lg:col-span-3'>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
          <CardDescription>
            Key metrics at a glance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-8'>
            {/* Total Documents */}
            <div className='flex items-center gap-4'>
              <Ghost className='h-8 w-8 text-zinc-800' />
              <div className='flex flex-col'>
                <Text>Total Documents</Text>
                <Metric>{files?.length || 0}</Metric>
              </div>
            </div>

            {/* Total Messages */}
            <div className='flex items-center gap-4'>
              <MessageSquare className='h-8 w-8 text-zinc-800' />
              <div className='flex flex-col'>
                <Text>Total Messages</Text>
                <Metric>{messages?.length || 0}</Metric>
              </div>
            </div>

            {/* Usage Trend */}
            <div className='mt-4'>
              <Title>Weekly Usage Trend</Title>
              <AreaChart
                className='h-28 mt-4'
                data={chartData}
                index='date'
                categories={['messages']}
                colors={['blue']}
                showXAxis={true}
                showGridLines={false}
                startEndOnly={true}
                showYAxis={false}
                showLegend={false}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Analytics 