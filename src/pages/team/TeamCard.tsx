"use client"

import { useNavigate } from "react-router-dom"

import { Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Team } from "@/redux/features/teams/teamTypes"

interface TeamCardProps {
  team: Team
}

export default function TeamCard({ team }: TeamCardProps) {
  console.log(team)
  const router = useNavigate()

  const handleViewTeam = () => {
    router(`/teams/${team.id}`)
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          {team.logo ? (
            <div className="relative h-10 w-10 overflow-hidden rounded-md">
              <img src={team.logo || "/placeholder.svg"} alt={`${team.name} logo`}  className="object-cover" />
            </div>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
          )}
          <div>
            <CardTitle className="line-clamp-1">{team.name}</CardTitle>
            <div className="flex gap-2 mt-1">
              <Badge variant="outline" className="capitalize">
                {team.sport}
              </Badge>
              {team.level && (
                <Badge variant="secondary" className="capitalize">
                  {team.level}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3 min-h-[4.5rem]">
          {team.description || "No description provided."}
        </p>
        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>
              {team.minPlayers && team.maxPlayers
                ? `${team.minPlayers}-${team.maxPlayers} players`
                : team.maxPlayers
                  ? `Up to ${team.maxPlayers} players`
                  : "No player limit"}
            </span>
          </div>
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="pt-4">
        <Button onClick={handleViewTeam} className="w-full">
          View Team
        </Button>
      </CardFooter>
    </Card>
  )
}

