"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchUserNotifications } from "../../redux/features/user/userThunks"
import type { RootState } from "../../redux/store"
import { Badge } from "@/components/ui/badge"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NotificationBadgeProps {
  onClick?: () => void
}

export function NotificationBadge({ onClick }: NotificationBadgeProps) {
  const dispatch = useDispatch()
  const { notifications, user } = useSelector((state: RootState) => state.users)

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserNotifications(user.id) as any)
    }
  }, [dispatch, user])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return (
    <Button variant="ghost" size="icon" className="relative" onClick={onClick}>
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive p-0 text-xs font-medium text-destructive-foreground">
          {unreadCount}
        </Badge>
      )}
    </Button>
  )
}

