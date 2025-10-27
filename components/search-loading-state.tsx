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
      return `Đang tìm kiếm ...`
    }
    return `Đang tìm kiếm ...`
  }

  const getDescription = () => {
    if (isPending) {
      return "Điều này có thể mất một thời gian. Chúng tôi sẽ tự động cập nhật khi có kết quả."
    }
    return "Vui lòng chờ trong khi chúng tôi tìm kiếm kết quả tốt nhất cho bạn."
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
            Trạng thái: Đang xử lý trong nền...
          </div>
        )}
      </CardContent>
    </Card>
  )
}