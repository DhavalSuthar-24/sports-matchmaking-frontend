import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Trophy, BarChart2, CalendarDays, Swords } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Team } from "@/redux/features/teams/teamTypes";

interface TeamCardProps {
  team: Team;
}

export default function TeamCard({ team }: TeamCardProps) {
  const router = useNavigate();

  const handleViewTeam = useCallback(() => {
    router(`/teams/${team.id}`);
  }, [router, team.id]);

  const teamInitials = useMemo(
    () => team.name.split(' ').map(n => n[0]).join('').toUpperCase(),
    [team.name]
  );

  const teamLogo = useMemo(() => (
    team.logo ? (
      <Avatar className="h-12 w-12 border">
        <AvatarImage src={team.logo} alt={`${team.name} logo`} />
        <AvatarFallback className="font-medium">
          {teamInitials}
        </AvatarFallback>
      </Avatar>
    ) : (
      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 border">
        <Users className="h-5 w-5 text-primary" />
      </div>
    )
  ), [team.logo, team.name, teamInitials]);

  const teamBadges = useMemo(() => (
    <div className="flex flex-wrap gap-2 mt-2">
      <Badge variant="outline" className="capitalize">
        {team.sport || "Unknown"}
      </Badge>
      {team.level && (
        <Badge variant="secondary" className="capitalize">
          {team.level}
        </Badge>
      )}
    </div>
  ), [team.sport, team.level]);

  const teamStats = useMemo(() => {
    const stats = [];
    
    if (team.memberCount !== undefined) {
      stats.push(
        <div key="members" className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>{team.memberCount} member{team.memberCount !== 1 ? 's' : ''}</span>
        </div>
      );
    }

    if (team.matchHistory) {
      stats.push(
        <div key="record" className="flex items-center gap-2 text-sm">
          <Swords className="h-4 w-4 text-muted-foreground" />
          <span>
            {team.matchHistory.wins || 0}W / {team.matchHistory.losses || 0}L
          </span>
        </div>
      );
    }

    if (team.trophyCount) {
      stats.push(
        <div key="trophies" className="flex items-center gap-2 text-sm">
          <Trophy className="h-4 w-4 text-yellow-500" />
          <span>{team.trophyCount} trophy{team.trophyCount !== 1 ? 's' : ''}</span>
        </div>
      );
    }

    if (team.createdAt) {
      stats.push(
        <div key="created" className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4" />
          <span>Created {format(new Date(team.createdAt), 'MMM yyyy')}</span>
        </div>
      );
    }

    if (team.sportRank?.[team.sport || '']) {
      stats.push(
        <div key="rank" className="flex items-center gap-2 text-sm">
          <BarChart2 className="h-4 w-4" />
          <span>Rank #{team.sportRank[team.sport || '']}</span>
        </div>
      );
    }

    return <div className="mt-3 space-y-2">{stats}</div>;
  }, [team]);

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          {teamLogo}
          <div className="flex-1 min-w-0">
            <CardTitle className="truncate">{team.name}</CardTitle>
            {teamBadges}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {team.description || "No description provided."}
        </p>
        {teamStats}
      </CardContent>
      
      <Separator className="mt-auto" />
      <CardFooter className="py-4">
        <Button 
          onClick={handleViewTeam} 
          className="w-full"
          variant="outline"
        >
          View Team
        </Button>
      </CardFooter>
    </Card>
  );
}