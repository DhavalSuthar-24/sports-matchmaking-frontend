"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"

import { format } from "date-fns"
import { MapPin, Calendar, Clock, ArrowLeft, Shield, Users, Trash2, Edit, CheckCircle, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
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
import { fetchChallengeById, deleteChallenge, acceptChallenge, declineChallenge } from "@/redux/features/challenge/challengeThunks"
import type { AppDispatch, RootState } from "@/redux/store"
import toast from "react-hot-toast"

interface ChallengeDetailProps {
  challengeId: string
}

export default function ChallengeDetail({ challengeId }: ChallengeDetailProps) {
  const router = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { selectedChallenge, status, error } = useSelector((state: RootState) => state.challenges)
  const { teams } = useSelector((state: RootState) => state.teams)
  const [teamForAction, setTeamForAction] = useState<string | null>(null)

  useEffect(() => {
    dispatch(fetchChallengeById(challengeId))
  }, [dispatch, challengeId])

  const handleDeleteChallenge = async () => {
    try {
      const resultAction = await dispatch(deleteChallenge(challengeId))
      if (deleteChallenge.fulfilled.match(resultAction)) {
        toast("The challenge has been deleted successfully.")
        router("/challenges")
      } else {
        toast( resultAction.error.message || "Something went wrong. Please try again.")
      }
    } catch (error) {
      toast(
      "An unexpected error occurred.")
    }
  }

  const handleacceptChallenge = async () => {
    if (!teams || teams.length === 0) {
      toast("You need to create or join a team before accepting challenges.")
      return
    }

    // For simplicity, we're using the first team. In a real app, you'd show a team selector
    const teamId = teams[0].id
    setTeamForAction(teamId)

    try {
      const resultAction = await dispatch(acceptChallenge({ challengeId, teamId }))
      if (acceptChallenge.fulfilled.match(resultAction)) {
        toast( "You have successfully accepted the challenge."
        )
      } else {
        toast(resultAction.error.message || "Something went wrong. Please try again.")
      }
    } catch (err) {
      toast("An unexpected error occurred.",
    )
    } finally {
      setTeamForAction(null)
    }
  }

  const handleDeclineChallenge = async () => {
    if (!teams || teams.length === 0) {
      toast( "You need to be part of a team to decline challenges.")
      return
    }

    // For simplicity, we're using the first team. In a real app, you'd show a team selector
    const teamId = teams[0].id
    setTeamForAction(teamId)

    try {
      const resultAction = await dispatch(declineChallenge({ challengeId, teamId }))
      if (declineChallenge.fulfilled.match(resultAction)) {
        toast(
          "You have declined the challenge.")
      } else {
        toast( resultAction.error.message || "Something went wrong. Please try again.",
     )
      }
    } catch (err) {
      toast(
      "An unexpected error occurred.")
    } finally {
      setTeamForAction(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
            Open
          </Badge>
        )
      case "ACCEPTED":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            Accepted
          </Badge>
        )
      case "DECLINED":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
            Declined
          </Badge>
        )
      case "COMPLETED":
        return (
          <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
            Completed
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-60 w-full" />
          <Skeleton className="h-60 w-full" />
        </div>
      </div>
    )
  }

  if (status === "failed" || !selectedChallenge) {
    return (
      <Card className="bg-destructive/10">
        <CardHeader>
          <CardTitle>Error Loading Challenge</CardTitle>
          <CardDescription>
            {error || "There was an error loading the challenge details. Please try again."}
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" onClick={() => router("/challenges")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Challenges
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router("/challenges")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{selectedChallenge.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              {getStatusBadge(selectedChallenge.status)}
              <Badge variant="outline" className="capitalize">
                {selectedChallenge.sport}
              </Badge>
              {selectedChallenge.level && (
                <Badge variant="secondary" className="capitalize">
                  {selectedChallenge.level}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {selectedChallenge.status === "OPEN" && (
            <Button variant="outline" onClick={() => router(`/challenges/${challengeId}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Challenge</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this challenge? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteChallenge}
                  className="bg-destructive text-destructive-foreground"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Challenge Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                <p className="mt-1">{selectedChallenge.description || "No description provided."}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{format(new Date(selectedChallenge.date), "MMMM d, yyyy")}</span>
                  </div>
                </div>

                {selectedChallenge.time && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Time</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedChallenge.time}</span>
                    </div>
                  </div>
                )}
              </div>

              {selectedChallenge.location && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedChallenge.location}</span>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Created By</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedChallenge.createdBy.name}</span>
                </div>
              </div>
            </div>

            <div className="bg-muted/30 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Teams</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Challenger</h4>
                  <div className="flex items-center gap-3">
                    {selectedChallenge.senderTeam.logo ? (
                      <div className="relative h-12 w-12 overflow-hidden rounded-full">
                        <img
                          src={selectedChallenge.senderTeam.logo || "/placeholder.svg"}
                          alt={selectedChallenge.senderTeam.name}
                   
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Shield className="h-6 w-6 text-primary" />
                      </div>
                    )}
                    <div>
                      <div className="font-medium">{selectedChallenge.senderTeam.name}</div>
                      <div className="text-sm text-muted-foreground">Challenger</div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Opponent</h4>
                  {selectedChallenge.receiverTeam ? (
                    <div className="flex items-center gap-3">
                      {selectedChallenge.receiverTeam.logo ? (
                        <div className="relative h-12 w-12 overflow-hidden rounded-full">
                          <img
                            src={selectedChallenge.receiverTeam.logo || "/placeholder.svg"}
                            alt={selectedChallenge.receiverTeam.name}
                 
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                          <Shield className="h-6 w-6 text-primary" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{selectedChallenge.receiverTeam.name}</div>
                        <div className="text-sm text-muted-foreground">Opponent</div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-background p-4 rounded-lg text-center">
                      <p className="text-muted-foreground mb-2">This is an open challenge. Any team can accept it.</p>

                      {selectedChallenge.status === "OPEN" && (
                        <div className="flex gap-2 justify-center">
                          <Button onClick={handleacceptChallenge} disabled={!!teamForAction}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Accept Challenge
                          </Button>
                          <Button variant="outline" onClick={handleDeclineChallenge} disabled={!!teamForAction}>
                            <XCircle className="mr-2 h-4 w-4" />
                            Decline
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

