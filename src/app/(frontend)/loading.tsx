import { Loader2 } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <main className="flex-1">
      <article className="min-h-[70vh]">
        <div className="w-full h-64 bg-muted animate-pulse mb-8" />

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-4 lg:grid-cols-12 gap-4">
            <div className="col-span-4 lg:col-span-8 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />

              <div className="pt-6 space-y-3">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>

            <div className="col-span-4 space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </article>
    </main>
  )
}
