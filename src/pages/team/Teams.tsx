"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchTeams}  from "@/redux/features/teams/teamThunks"
import type { AppDispatch, RootState } from "@/redux/store"
import TeamCard from "./TeamCard"

export default function TeamsList() {
  const router = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { teams, status, error } = useSelector((state: RootState) => state.teams)

  const [filters, setFilters] = useState({
    name: "",
    sport: "",
    level: "",
  })

  useEffect(() => {
    dispatch(fetchTeams({}))
  }, [dispatch])

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)

    // Remove empty filters before dispatching
    const cleanedFilters = Object.fromEntries(Object.entries(newFilters).filter(([_, v]) => v !== ""))

    dispatch(fetchTeams(cleanedFilters))
  }

  const handleCreateTeam = () => {
    router("/teams/create")
  }

  console.log(teams,"teams")

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Teams</h1>
          <p className="text-muted-foreground">Browse and manage your teams</p>
        </div>
        <Button onClick={handleCreateTeam}>
          <Plus className="mr-2 h-4 w-4" />
          Create Team
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search teams..."
            className="pl-8"
            value={filters.name}
            onChange={(e) => handleFilterChange("name", e.target.value)}
          />
        </div>
        <Select value={filters.sport} onValueChange={(value) => handleFilterChange("sport", value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sport" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sports</SelectItem>
            <SelectItem value="football">Football</SelectItem>
            <SelectItem value="basketball">Basketball</SelectItem>
            <SelectItem value="volleyball">Volleyball</SelectItem>
            <SelectItem value="tennis">Tennis</SelectItem>
            <SelectItem value="cricket">Cricket</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.level} onValueChange={(value) => handleFilterChange("level", value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
            <SelectItem value="professional">Professional</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {status === "loading" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-0">
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full mt-4" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {status === "failed" && (
        <Card className="bg-destructive/10">
          <CardHeader>
            <CardTitle>Error Loading Teams</CardTitle>
            <CardDescription>
  {"There was an error loading the teams. Please try again."}
</CardDescription>

          </CardHeader>
          <CardFooter>
            <Button variant="outline" onClick={() => dispatch(fetchTeams({}))}>
              Retry
            </Button>
          </CardFooter>
        </Card>
      )}

      {status === "succeeded" && teams.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>No Teams Found</CardTitle>
            <CardDescription>
              {Object.values(filters).some((v) => v !== "")
                ? "No teams match your current filters. Try adjusting your search criteria."
                : "You don't have any teams yet. Create your first team to get started."}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={handleCreateTeam}>
              <Plus className="mr-2 h-4 w-4" />
              Create Team
            </Button>
          </CardFooter>
        </Card>
      )}

      {status === "succeeded" && teams.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      )}
    </div>
  )
}

