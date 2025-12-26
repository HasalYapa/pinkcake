import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CakesLK Admin',
  description: 'Manage orders for CakesLK',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="bg-background">{children}</div>
}
