"use client"

import { useNavigate } from "react-router-dom"
import { Users, Trophy, BarChart2, CalendarDays, Swords } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Team } from "@/redux/features/teams/teamTypes"

interface TeamCardProps {
  team: Team
}

export default function TeamCard({ team }: TeamCardProps) {
  const router = useNavigate()

  const handleViewTeam = () => {
    router(`/teams/${team.id}`)
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          {team.logo ? (
            <Avatar className="h-12 w-12">
              <AvatarImage src={team.logo} alt={`${team.name} logo`} />
              <AvatarFallback>{getInitials(team.name)}</AvatarFallback>
            </Avatar>
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
          )}
          <div className="flex-1">
            <CardTitle className="line-clamp-1">{team.name}</CardTitle>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline" className="capitalize">
                {team.sport}
              </Badge>
              {team.level && (
                <Badge variant="secondary" className="capitalize">
                  {team.level}
                </Badge>
              )}
              {/* {team.rating && (
                <Badge>
                  <BarChart2 className="h-3 w-3 mr-1" />
                  {team.rating}
                </Badge>
              )} */}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-3 min-h-[4.5rem]">
          {team.description || "No description provided."}
        </p>

        <div className="mt-4 space-y-2 text-sm">
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>
                {/* {team._count?.members || 0} member{team._count?.members !== 1 ? 's' : ''} */}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Swords className="h-4 w-4" />
              <span>
                {/* {team.matchHistory?.wins || 0}W / {team.matchHistory?.losses || 0}L */}
              </span>
            </div>
          </div>

          {/* {team.trophyCount > 0 && (
            <div className="flex items-center gap-1">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span>{team.trophyCount} trophy{team.trophyCount !== 1 ? 's' : ''}</span>
            </div>
          )} */}

          {/* {team.createdAt && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              <span>Created {format(new Date(team.createdAt), 'MMM yyyy')}</span>
            </div>
          )} */}

          {/* {team.sportRank && team.sportRank[team.sport] && (
            <div className="flex items-center gap-1">
              <BarChart2 className="h-4 w-4" />
              <span>Rank #{team.sportRank[team.sport]} in {team.sport}</span>
            </div>
          )} */}
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