"use client"

import { useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/redux/store"
import {
  fetchGameById,
  deleteGame,
  getGamePositions,
  getGameSkillSets,
  getGameTournaments,
  getGameMatches,
} from "@/redux/features/game/gameThunks"
import { clearSelectedGame } from "@/redux/features/game/gameSlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { ArrowLeft, Edit, Trash2, Trophy, Users, Calendar } from "lucide-react"
import toast from "react-hot-toast"
import { Skeleton } from "@/components/ui/skeleton"

export default function GameDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { selectedGame } = useSelector((state: RootState) => state.games)
  const { game, positions, skillSets, tournaments, matches, loading, error } = selectedGame

  useEffect(() => {
    if (id) {
      dispatch(fetchGameById(id))
      dispatch(getGamePositions(id))
      dispatch(getGameSkillSets(id))
      dispatch(getGameTournaments(id))
      dispatch(getGameMatches(id))
    }

    return () => {
      dispatch(clearSelectedGame())
    }
  }, [dispatch, id])

  const handleDelete = async () => {
    if (id) {
      try {
        await dispatch(deleteGame(id)).unwrap()
        toast.success("Game deleted successfully")
        navigate("/games")
      } catch (error) {
        toast.error("Failed to delete game")
      }
    }
  }

  if (loading && !game) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <Skeleton className="h-10 w-24" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <Skeleton className="aspect-square w-full" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-1/3" />
              <div className="flex flex-wrap gap-2">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-8 w-20" />
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (error && !game) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <Button asChild variant="ghost" className="mb-4">
          <Link to="/games">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Games
          </Link>
        </Button>
        <div className="bg-destructive/15 text-destructive p-4 rounded-md">{error}</div>
      </div>
    )
  }

  if (!game) {
    return (
      <div className="container mx-auto p-4 text-center py-12">
        <h3 className="text-lg font-medium mb-2">Game not found</h3>
        <Button asChild className="mt-4">
          <Link to="/games">Back to Games</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header with back button and actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Button asChild variant="ghost" className="w-full sm:w-auto">
          <Link to="/games" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <span className="whitespace-nowrap">Back to Games</span>
          </Link>
        </Button>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link to={`/games/${id}/edit`} className="flex items-center">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full sm:w-auto">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the game and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Game info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="overflow-hidden">
            <div className="aspect-square relative">
              <img
                src={game.image || "/placeholder.svg?height=400&width=400"}
                alt={game.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">{game.name}</CardTitle>
              <CardDescription>
                Created: {new Date(game.createdAt || Date.now()).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Positions</h4>
                <div className="flex flex-wrap gap-2">
                  {positions.length > 0 ? (
                    positions.map((position, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {position}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No positions defined</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Skill Sets</h4>
                <div className="flex flex-wrap gap-2">
                  {skillSets && skillSets.length > 0 ? (
                    skillSets.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {skill.name}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No skill sets defined</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column - Details and tabs */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{game.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{game.rules}</p>
            </CardContent>
          </Card>

          {/* Tabs section */}
          <Tabs defaultValue="tournaments">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tournaments" className="flex items-center justify-center gap-2">
                <Trophy className="h-4 w-4" />
                <span className="hidden sm:inline">Tournaments</span>
              </TabsTrigger>
              <TabsTrigger value="matches" className="flex items-center justify-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Matches</span>
              </TabsTrigger>
              <TabsTrigger value="media" className="flex items-center justify-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Media</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="tournaments" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tournaments</CardTitle>
                  <CardDescription>All tournaments for this game</CardDescription>
                </CardHeader>
                <CardContent>
                  {tournaments.length > 0 ? (
                    <div className="space-y-4">
                      {tournaments.map((tournament) => (
                        <Card key={tournament.id} className="hover:shadow-md transition-shadow">
                          <CardHeader>
                            <CardTitle className="text-lg">{tournament.name}</CardTitle>
                            <CardDescription>{tournament.description}</CardDescription>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No tournaments found for this game</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="matches" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Matches</CardTitle>
                  <CardDescription>All matches for this game</CardDescription>
                </CardHeader>
                <CardContent>
                  {matches.length > 0 ? (
                    <div className="space-y-4">
                      {matches.map((match) => (
                        <Card key={match.id} className="hover:shadow-md transition-shadow">
                          <CardHeader>
                            <CardTitle className="text-lg">
                              {match.name || `Match #${match.id}`}
                            </CardTitle>
                            <CardDescription>
                              {new Date(match.scheduledAt || Date.now()).toLocaleString()}
                            </CardDescription>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No matches found for this game</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="media" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Media</CardTitle>
                  <CardDescription>Images and videos for this game</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">No media found for this game</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}