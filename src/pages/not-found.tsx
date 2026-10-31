import { Link } from 'react-router-dom'
import { EmptyState } from '@/components'
import { Button } from '@/components/ui/button'
import { FileQuestion, ArrowLeft, Home } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <EmptyState
        icon={<FileQuestion className="size-6 text-primary" />}
        title="Page Not Found (404)"
        description="The requested JusBid view, hotelier record, or call ID does not exist or has been moved."
        action={
          <div className="flex gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link to="/leads">
                <ArrowLeft className="mr-1.5 size-3.5" />
                Go to Leads
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/overview">
                <Home className="mr-1.5 size-3.5" />
                Agency Dashboard
              </Link>
            </Button>
          </div>
        }
      />
    </div>
  )
}

