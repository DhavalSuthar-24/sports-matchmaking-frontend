"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import {
  fetchTeamInvitations,
  acceptTeamInvitation,
  declineTeamInvitation,
} from "@/redux/features/user/userThunks"
import type { RootState } from "../../redux/store"
import { DashboardLayout } from "../../components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { CalendarClock, Users } from "lucide-react"

export default function Invitations() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { teamInvitations, status } = useSelector((state: RootState) => state.users)

  useEffect(() => {
    dispatch(fetchTeamInvitations() as any)
  }, [dispatch])

  const handleAcceptInvitation = (invitationId: string) => {
    toast.promise(dispatch(acceptTeamInvitation(invitationId) as any).unwrap(), {
      loading: "Accepting invitation...",
      success: "Invitation accepted successfully!",
      error: "Failed to accept invitation",
    })
  }

  const handleDeclineInvitation = (invitationId: string) => {
    toast.promise(dispatch(declineTeamInvitation(invitationId) as any).unwrap(), {
      loading: "Declining invitation...",
      success: "Invitation declined",
      error: "Failed to decline invitation",
    })
  }

  const isLoading = status === "loading"

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Team Invitations</h1>
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : teamInvitations.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {teamInvitations.map((invitation) => (
              <Card key={invitation.id}>
                <CardHeader>
                  <CardTitle>{invitation.team.name}</CardTitle>
                  {/* <CardDescription>Invited by {invitation.inviter.name}</CardDescription> */}
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {/* <span>{invitation.team.membersCount || "Unknown"} members</span> */}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarClock className="h-4 w-4 text-muted-foreground" />
                      {/* <span>Invited {new Date(invitation.createdAt).toLocaleDateString()}</span> */}
                    </div>
                    {invitation.role && (
                      <Badge variant="outline" className="mt-2">
                        Role: {invitation.role}
                      </Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button className="flex-1" onClick={() => handleAcceptInvitation(invitation.id)}>
                    Accept
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => handleDeclineInvitation(invitation.id)}>
                    Decline
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Invitations</CardTitle>
              <CardDescription>You don't have any pending team invitations at the moment.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                When someone invites you to join their team, the invitation will appear here.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}

