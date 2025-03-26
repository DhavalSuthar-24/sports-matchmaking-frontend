"use client"

import { useEffect, useState } from "react"
import { useNavigate,useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"

import { Users, UserPlus, Settings, Trash2, ArrowLeft, Mail, PersonStanding, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchTeamById, fetchTeamMembers, deleteTeam } from "@/redux/features/teams/teamThunks"
import type { AppDispatch, RootState } from "@/redux/store"
import type { TeamMember } from "@/redux/features/teams/teamTypes"
import TeamMemberInviteDialog from "./team-member-invite-dialog"



export default function TeamDetail() {
  const { teamId } = useParams<{ teamId: string }>();
  const router = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { selectedTeam, status, error } = useSelector((state: RootState) => state.teams)
  const { teamMembers, membersStatus } = useSelector((state: RootState) => state.teams)
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchTeamById(teamId))
    dispatch(fetchTeamMembers(teamId))
  }, [dispatch, teamId])

  const handleDeleteTeam = async () => {
    try {
      const resultAction = await dispatch(deleteTeam(teamId))
      if (deleteTeam.fulfilled.match(resultAction)) {
        router("/teams")
      }
    } catch (error) {
      console.error("Failed to delete team:", error)
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "CAPTAIN":
        return <Badge className="bg-yellow-500">Captain</Badge>
      case "MANAGER":
        return <Badge className="bg-blue-500">Manager</Badge>
      default:
        return <Badge variant="outline">Player</Badge>
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "CAPTAIN":
        return <Shield className="h-4 w-4" />
      case "MANAGER":
        return <Settings className="h-4 w-4" />
      default:
        return <PersonStanding className="h-4 w-4" />
    }
  }

  if (status === "loading") {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div>
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-24 mt-2" />
          </div>
        </div>
        <Skeleton className="h-40 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-60 w-full" />
          <Skeleton className="h-60 w-full" />
          <Skeleton className="h-60 w-full" />
        </div>
      </div>
    )
  }

  if (status === "failed" || !selectedTeam) {
    return (
      <Card className="bg-destructive/10">
        <CardHeader>
          <CardTitle>Error Loading Team</CardTitle>
          <CardDescription>{error || "There was an error loading the team details. Please try again."}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" onClick={() => router("/teams")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Teams
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router("/teams")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{selectedTeam.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="capitalize">
                {selectedTeam.sport}
              </Badge>
              {selectedTeam.level && (
                <Badge variant="secondary" className="capitalize">
                  {selectedTeam.level}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router(`/teams/${teamId}/edit`)}>
            <Settings className="mr-2 h-4 w-4" />
            Edit Team
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Team</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this team? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteTeam} className="bg-destructive text-destructive-foreground">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="bg-muted/30 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              {selectedTeam.logo ? (
                <div className="relative h-20 w-20 overflow-hidden rounded-md">
                  <img
                    src={selectedTeam.logo || "/placeholder.svg"}
                    alt={`${selectedTeam.name} logo`}
            
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-md bg-primary/10">
                  <Users className="h-10 w-10 text-primary" />
                </div>
              )}
              <div>
                <h2 className="text-xl font-semibold">{selectedTeam.name}</h2>
                {selectedTeam.createdBy && (
                  <p className="text-sm text-muted-foreground mt-1">Created by {selectedTeam.createdBy.name}</p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-medium">Description</h3>
              <p className="text-sm text-muted-foreground">{selectedTeam.description || "No description provided."}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-medium">Sport</h3>
                <p className="text-sm text-muted-foreground capitalize">{selectedTeam.sport}</p>
              </div>

              {selectedTeam.level && (
                <div className="space-y-1">
                  <h3 className="text-sm font-medium">Level</h3>
                  <p className="text-sm text-muted-foreground capitalize">{selectedTeam.level}</p>
                </div>
              )}

              {(selectedTeam.minPlayers || selectedTeam.maxPlayers) && (
                <div className="space-y-1">
                  <h3 className="text-sm font-medium">Team Size</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedTeam.minPlayers && selectedTeam.maxPlayers
                      ? `${selectedTeam.minPlayers}-${selectedTeam.maxPlayers} players`
                      : selectedTeam.maxPlayers
                        ? `Up to ${selectedTeam.maxPlayers} players`
                        : `Min ${selectedTeam.minPlayers} players`}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="members">
        <TabsList>
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
          <TabsTrigger value="requests">Join Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Members ({teamMembers.length || 0})</h3>
            <Button onClick={() => setIsInviteDialogOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Member
            </Button>
          </div>

          {membersStatus === "loading" && (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-6 w-20 ml-auto" />
                </div>
              ))}
            </div>
          )}

          {membersStatus === "failed" && (
            <Card className="bg-destructive/10">
              <CardHeader>
                <CardTitle>Error Loading Team Members</CardTitle>
                <CardDescription>There was an error loading the team members. Please try again.</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="outline" onClick={() => dispatch(fetchTeamMembers(teamId))}>
                  Retry
                </Button>
              </CardFooter>
            </Card>
          )}

          {membersStatus === "succeeded" && teamMembers.length === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>No Team Members</CardTitle>
                <CardDescription>
                  This team doesn't have any members yet. Invite members to join your team.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button onClick={() => setIsInviteDialogOpen(true)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Invite Member
                </Button>
              </CardFooter>
            </Card>
          )}

          {membersStatus === "succeeded" && teamMembers.length > 0 && (
            <div className="space-y-4">
              {teamMembers.map((member: TeamMember) => (
                <div key={member.id} className="flex items-center gap-4 p-4 rounded-lg border">
                  <Avatar>
                    <AvatarImage src={`https://avatar.vercel.sh/${member.userId}`} />
                    <AvatarFallback>{member.userId.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">User {member.userId.substring(0, 8)}</div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      {getRoleIcon(member.role)}
                      <span>{member.role}</span>
                    </div>
                  </div>
                  <div className="ml-auto">{getRoleBadge(member.role)}</div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="invitations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Invitations</CardTitle>
              <CardDescription>Manage your pending team invitations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <Mail className="mx-auto h-12 w-12 text-muted-foreground/60" />
                <h3 className="mt-4 text-lg font-medium">No Pending Invitations</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  There are no pending invitations for this team at the moment.
                </p>
                <Button className="mt-4" onClick={() => setIsInviteDialogOpen(true)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Invite Member
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Join Requests</CardTitle>
              <CardDescription>Manage requests from players wanting to join your team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <Users className="mx-auto h-12 w-12 text-muted-foreground/60" />
                <h3 className="mt-4 text-lg font-medium">No Join Requests</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  There are no pending requests to join this team at the moment.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <TeamMemberInviteDialog
        teamId={teamId}
        isOpen={isInviteDialogOpen}
        onClose={() => setIsInviteDialogOpen(false)}
      />
    </div>
  )
}

