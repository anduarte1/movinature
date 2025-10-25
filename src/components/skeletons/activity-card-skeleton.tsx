import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ActivityCardSkeleton() {
  return (
    <Card className="overflow-hidden border-2 border-gray-100 h-full">
      <div className="relative h-56 w-full">
        <Skeleton className="h-full w-full" />
      </div>

      <CardContent className="p-5">
        <Skeleton className="h-6 w-3/4 mb-3" />
        <Skeleton className="h-4 w-1/2 mb-3" />

        <div className="flex items-center gap-5">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
      </CardContent>

      <CardFooter className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-gray-100">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-8 w-20" />
        </div>
        <Skeleton className="h-10 w-28 rounded-lg" />
      </CardFooter>
    </Card>
  )
}
