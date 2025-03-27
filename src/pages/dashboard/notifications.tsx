"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { fetchUserNotifications, markNotificationAsRead } from "../../redux/features/user/userThunks"
import type { RootState } from "../../redux/store"
import { DashboardLayout } from "../../components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Bell } from "lucide-react"

export default function Notifications() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { notifications, status, user } = useSelector((state: RootState) => state.users)

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserNotifications(user.id) as any)
    }
  }, [dispatch, user])

  const handleMarkAsRead = (notificationId: string) => {
    if (user?.id) {
      dispatch(
        markNotificationAsRead({
          userId: user.id,
          notificationId,
        }) as any,
      )
    }
  }

  const isLoading = status === "loading"

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-5 w-1/3" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="mt-2 h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card key={notification.id} className={notification.isRead ? "bg-card" : "bg-accent"}>
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <div>
                    {/* <CardTitle className="text-base">{notification.title}</CardTitle> */}
                    <CardDescription className="text-xs">
                      {new Date(notification.createdAt).toLocaleString()}
                    </CardDescription>
                  </div>
                  {!notification.isRead && <Badge variant="secondary">New</Badge>}
                </CardHeader>
                <CardContent>
                  {/* <p className="text-sm">{notification.message}</p> */}
                  {!notification.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 h-8 px-2 text-xs"
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      Mark as read
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Notifications</CardTitle>
              <CardDescription>You don't have any notifications at the moment.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-6 text-center">
              <Bell className="h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">When you receive notifications, they will appear here.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}

