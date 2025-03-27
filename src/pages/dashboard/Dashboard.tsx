"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { fetchUserProfile } from "@/redux/features/user/userThunks"
import type { RootState } from "../../redux/store"
import { DashboardLayout } from "../../components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { UserCircle } from "lucide-react"

export default function Dashboard() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, status } = useSelector((state: RootState) => state.users)
 const  userId  = useSelector((state: RootState) => state.auth.user.id)

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserProfile(userId) as any)
    }
  }, [dispatch, userId])

  const isLoading = status === "loading"

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <Button onClick={() => navigate("/dashboard/profile")}>Edit Profile</Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Profile</CardTitle>
              <CardDescription>Your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : user ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage || "/placeholder.svg"}
                        alt={user.name}
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                        <UserCircle className="h-10 w-10 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No profile data available</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Team Invitations</CardTitle>
              <CardDescription>Pending team invitations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/dashboard/invitations")}
                >
                  View Invitations
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Your recent notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/dashboard/notifications")}
                >
                  View Notifications
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

