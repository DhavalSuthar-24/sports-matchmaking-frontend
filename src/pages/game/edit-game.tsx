"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/redux/store"
import { fetchGameById, updateGame } from "@/redux/features/game/gameThunks"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, X, Plus } from "lucide-react"
import toast from "react-hot-toast"
import { Badge } from "@/components/ui/badge"

export default function EditGamePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { selectedGame } = useSelector((state: RootState) => state.games)
  const { game, loading, error } = selectedGame

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    rules: "",
    image: "",
    positions: [] as string[]
  })
  const [currentPosition, setCurrentPosition] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (id) {
      dispatch(fetchGameById(id))
    }
  }, [dispatch, id])

  useEffect(() => {
    if (game) {
      setFormData({
        name: game.name || "",
        description: game.description || "",
        rules: game.rules || "",
        image: game.image || "",
        positions: game.positions || []
      })
    }
  }, [game])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddPosition = () => {
    if (currentPosition.trim() && !formData.positions.includes(currentPosition.trim())) {
      setFormData(prev => ({
        ...prev,
        positions: [...prev.positions, currentPosition.trim()]
      }))
      setCurrentPosition("")
    }
  }

  const handleRemovePosition = (positionToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      positions: prev.positions.filter(pos => pos !== positionToRemove)
    }))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentPosition.trim()) {
      e.preventDefault()
      handleAddPosition()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return

    setIsSubmitting(true)

    try {
      await dispatch(updateGame({ gameId: id, gameData: formData })).unwrap()
      toast.success("Game updated successfully")
      navigate(`/games/${id}`)
    } catch (error: any) {
      toast.error(error?.message || "Failed to update game")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading && !game) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error && !game) {
    return (
      <div className="space-y-4">
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

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" className="flex items-center">
          <Link to={`/games/${id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Game
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Game</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Game Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter game name"
                  required
                  className="focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="image" className="text-sm font-medium">
                  Image URL
                </Label>
                <Input
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="Enter image URL"
                  required
                  className="focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter game description"
                  rows={4}
                  required
                  className="focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="rules" className="text-sm font-medium">
                  Rules
                </Label>
                <Textarea
                  id="rules"
                  name="rules"
                  value={formData.rules}
                  onChange={handleChange}
                  placeholder="Enter game rules"
                  rows={6}
                  required
                  className="focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="positions" className="text-sm font-medium">
                  Positions
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="positions"
                    value={currentPosition}
                    onChange={(e) => setCurrentPosition(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add a position (e.g., Forward, Goalkeeper)"
                    className="flex-1 focus-visible:ring-2 focus-visible:ring-primary"
                  />
                  <Button
                    type="button"
                    onClick={handleAddPosition}
                    disabled={!currentPosition.trim()}
                    variant="secondary"
                    className="shrink-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {formData.positions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.positions.map((position) => (
                      <Badge 
                        key={position} 
                        variant="outline"
                        className="px-3 py-1 text-sm flex items-center gap-1"
                      >
                        {position}
                        <button
                          type="button"
                          onClick={() => handleRemovePosition(position)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full py-6 text-lg font-semibold"
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                  Updating Game...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Update Game
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}