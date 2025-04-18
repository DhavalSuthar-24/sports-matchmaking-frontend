import React from 'react';
import { Match } from '@/redux/features/match/matchTypes';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Calendar, Clock, MapPin, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MatchCardProps {
  match: Match;
  userId: string;
  onUpdateStatus: (matchId: string, newStatus: string) => void;
  isUpdatingStatus: boolean;
}

const MatchCard: React.FC<MatchCardProps> = ({
  match,
  userId,
  onUpdateStatus,
  isUpdatingStatus,
}) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'default';
      case 'ONGOING':
        return 'default';
      case 'SCHEDULED':
        return 'secondary';
      case 'CANCELLED':
        return 'destructive';
      case 'POSTPONED':
        return 'outline';
      default:
        return 'secondary';
    }
  };
  const navigate = useNavigate();
  const handleViewMatch = (id:any) => {
    navigate(`/matches/${id}`)
  };

  const isOrganizer = match.createdById === userId;
  const canUpdateStatus = isOrganizer && ['SCHEDULED', 'ONGOING'].includes(match.status);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">
              {match.teams[0]?.team.name} vs {match.teams[1]?.team.name}
            </CardTitle>
            <CardDescription className="mt-1">
              {match.game?.name} Match
            </CardDescription>
          </div>
          <Badge variant={getStatusVariant(match.status)} className="capitalize">
            {match.status.toLowerCase()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground mb-4">
          <div className="flex items-center">
            <Calendar className="mr-1.5 h-4 w-4" />
            <span>{match.scheduledAt}</span>
          </div>
          <div className="flex items-center">
            <Clock className="mr-1.5 h-4 w-4" />
            <span>{match.scheduledAt}</span>
          </div>
          {match.venue && (
            <div className="flex items-center">
              <MapPin className="mr-1.5 h-4 w-4" />
              <span>{match.venue.name}</span>
            </div>
          )}
          <div className="flex items-center">
            <Trophy className="mr-1.5 h-4 w-4" />
            <span className="capitalize">{match.matchType.toLowerCase()}</span>
          </div>
        </div>

        {match.status === 'COMPLETED' && match.matchWinnerTeamId && (
          <div className="mb-4 p-2 bg-green-50 rounded-md text-green-800 text-sm">
            Winner: {match.teams.find(t => t.teamId === match.matchWinnerTeamId)?.team.name}
          </div>
        )}

        {canUpdateStatus && (
          <div className="flex gap-2 mt-4">
            {match.status === 'SCHEDULED' && (
              <Button
                size="sm"
                onClick={() => handleViewMatch(match.id)}
                disabled={isUpdatingStatus}
              >
                {isUpdatingStatus ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'View Match'
                )}
              </Button>
            )}
            {match.status === 'ONGOING' && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleViewMatch('COMPLETED')}
                disabled={isUpdatingStatus}
              >
                {isUpdatingStatus ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'End Match'
                )}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MatchCard;