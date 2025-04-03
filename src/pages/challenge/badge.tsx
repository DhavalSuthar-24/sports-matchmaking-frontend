import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const getStatusBadge = (status: string | undefined | null) => {
  const baseClasses = "border rounded-full px-3 py-1 text-xs font-medium";

  switch (status) {
    case "OPEN":
    case "PENDING": // Treat PENDING similar to OPEN visually on card? Or specific badge?
      return (
        <Badge className={cn(baseClasses, "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700")}> 
          {status === "PENDING" ? "Pending" : "Open"}
        </Badge>
      );
    case "ACCEPTED":
      return (
        <Badge className={cn(baseClasses, "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700")}> 
          Accepted
        </Badge>
      );
    case "DECLINED":
      return (
        <Badge className={cn(baseClasses, "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700")}> 
          Declined
        </Badge>
      );
    case "COMPLETED":
      return (
        <Badge className={cn(baseClasses, "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700")}> 
          Completed
        </Badge>
      );
    case "EXPIRED":
      return (
        <Badge className={cn(baseClasses, "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700")}> 
          Expired
        </Badge>
      );
    case "CANCELLED":
    case "WITHDRAWN":
      return (
        <Badge className={cn(baseClasses, "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-700/30 dark:text-gray-300 dark:border-gray-600")}> 
          Cancelled
        </Badge>
      );
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};
