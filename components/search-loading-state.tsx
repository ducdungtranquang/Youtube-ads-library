import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface SearchLoadingStateProps {
  isSearching: boolean
  isPending: boolean
  searchType?: string
  className?: string
}

export function SearchLoadingState({ 
  isSearching, 
  isPending, 
  searchType = "ads",
  className = "" 
}: SearchLoadingStateProps) {
  if (!isSearching && !isPending) return null

  const getMessage = () => {
    if (isPending) {
      return `Processing ${searchType} search in background...`
    }
    return `Searching for ${searchType}...`
  }

  const getDescription = () => {
    if (isPending) {
      return "This may take a few moments. We'll automatically update when results are ready."
    }
    return "Please wait while we find the best results for you."
  }

  return (
    <Card className={`${className}`}>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
        <h3 className="text-lg font-semibold mb-2">{getMessage()}</h3>
        <p className="text-muted-foreground text-center max-w-md">
          {getDescription()}
        </p>
        {isPending && (
          <div className="mt-4 text-sm text-muted-foreground">
            Status: Processing in background...
          </div>
        )}
      </CardContent>
    </Card>
  )
}