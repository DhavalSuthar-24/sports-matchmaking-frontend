import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
export const getStatusBadge = (status: string) => {
    const baseClasses = "border rounded-full px-3 py-1 text-xs font-medium";

    switch (status) {
      case "OPEN":
        
        return (
          <Badge className={cn(baseClasses, "bg-blue-50 text-blue-700 border-blue-200")}>
            Open
          </Badge>
        );
      case "ACCEPTED":
        return (
          <Badge className={cn(baseClasses, "bg-green-50 text-green-700 border-green-200")}>
            Accepted
          </Badge>
        );
      case "DECLINED":
        return (
          <Badge className={cn(baseClasses, "bg-red-50 text-red-700 border-red-200")}>
            Declined
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge className={cn(baseClasses, "bg-purple-50 text-purple-700 border-purple-200")}>
            Completed
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className={cn(baseClasses, "bg-yellow-50 text-yellow-700 border-yellow-200")}>
            Pending
          </Badge>
        );
      case "EXPIRED":
        return (
          <Badge className={cn(baseClasses, "bg-gray-50 text-gray-700 border-gray-200")}>
            Expired
          </Badge>
        );
        
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };