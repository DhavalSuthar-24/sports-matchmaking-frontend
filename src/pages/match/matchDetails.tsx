import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store'; // Adjust path if necessary
import { clearCurrentMatch } from '@/redux/features/match/matchSlice'; // Adjust path
import { getMatch } from '@/redux/features/match/matchThunks';
import { MatchStatus, MatchType } from '@/redux/features/match/matchTypes'; // Adjust path
import { Button } from '@/components/ui/button'; // shadcn button
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'; // shadcn card
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'; // shadcn alert
import { Separator } from '@/components/ui/separator'; // shadcn separator
import { Badge } from '@/components/ui/badge'; // shadcn badge
import { Loader2, Calendar, Clock, Trophy, MapPin, AlertCircle, CheckCircle, Info } from 'lucide-react'; // Icons


import MatchScoreCard from './components/MatchScoreCard'; // Adjust path
import MatchTeams from './components/MatchTeams'; // Adjust path
import MatchTossInfo from './components/MatchTossInfo'; // Adjust path

// Helper function to get badge variant based on match status
const getMatchStatusVariant = (status: MatchStatus): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
        case MatchStatus.COMPLETED:
            return 'default';
        case MatchStatus.ONGOING:
            return 'default';
        case MatchStatus.SCHEDULED:
            return 'secondary';
        case MatchStatus.CANCELLED:
            return 'destructive';
        case MatchStatus.POSTPONED:
            return 'outline';
        case MatchStatus.INNINGS_BREAK:
            return 'secondary';
        default:
            return 'secondary';
    }
};

const MatchDetails: React.FC = () => {
    const { matchId } = useParams<{ matchId: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentMatch, loading, error } = useSelector((state: RootState) => state.matches); // Changed from state.match to state.matches

    useEffect(() => {
        if (matchId) {
            dispatch(getMatch(matchId) as any); // Added type assertion
        }

        return () => {
            dispatch(clearCurrentMatch());
        };
    }, [dispatch, matchId]);

    const handleStartScoring = () => {
        if (currentMatch?.id) {
            navigate(`/matches/${currentMatch.id}/scorecard`);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive" className="my-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    if (!currentMatch) {
        return (
            <Alert variant="default" className="my-4 bg-yellow-100 border-yellow-300 text-yellow-800">
                <Info className="h-4 w-4" />
                <AlertTitle>Not Found</AlertTitle>
                <AlertDescription>Match details could not be loaded.</AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="match-details-container p-4">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start mb-1">
                        <CardTitle className="text-2xl">
                            {currentMatch.game?.name} Match
                        </CardTitle>
                        <Badge variant={getMatchStatusVariant(currentMatch.status)} className="capitalize">
                            {currentMatch.status.toLowerCase().replace('_', ' ')}
                        </Badge>
                    </div>
                    <CardDescription>
                        Details and score of the match.
                    </CardDescription>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground mt-3">
                        <div className="flex items-center">
                            <Calendar className="mr-1.5 h-4 w-4" />
                            <span>{currentMatch.scheduledAt}</span>
                        </div>
                        <div className="flex items-center">
                            <Clock className="mr-1.5 h-4 w-4" />
                            <span>{currentMatch.scheduledAt}</span>
                        </div>
                        {currentMatch.venue && (
                            <div className="flex items-center">
                                <MapPin className="mr-1.5 h-4 w-4" />
                                <span>{currentMatch.venue.name}</span>
                            </div>
                        )}
                        <div className="flex items-center">
                            <Trophy className="mr-1.5 h-4 w-4" />
                            <span className="capitalize">
                                {MatchType[currentMatch.matchType as keyof typeof MatchType]?.toLowerCase() || currentMatch.matchType}
                            </span>
                        </div>
                    </div>
                </CardHeader>

                <CardContent>
                    <Separator className="my-4" />

                    {/* Match Teams Section */}
                    <MatchTeams teams={currentMatch.teams} />

                    {/* Match Result Section */}
                    {currentMatch.status === MatchStatus.COMPLETED && currentMatch.matchWinnerTeamId && (
                        <div className="my-6 text-center">
                            <Separator className="my-4" />
                            <h3 className="text-lg font-semibold mb-1">
                                Match Result
                            </h3>
                            <p className="font-medium text-primary">
                                <CheckCircle className="inline h-5 w-5 mr-1 mb-0.5" />
                                {currentMatch.teams.find(t => t.teamId === currentMatch.matchWinnerTeamId)?.team.name} won
                                {currentMatch.resultDescription && ` (${currentMatch.resultDescription})`}
                            </p>
                        </div>
                    )}

                    {/* Score display for completed or ongoing matches */}
                    {[MatchStatus.ONGOING, MatchStatus.COMPLETED, MatchStatus.INNINGS_BREAK].includes(currentMatch.status) && currentMatch.innings && currentMatch.innings.length > 0 && (
                        <>
                            <Separator className="my-4" />
                            <MatchScoreCard match={currentMatch} />
                        </>
                    )}

                    {/* Toss information if available */}
                    {currentMatch.toss && (
                        <>
                            <Separator className="my-4" />
                            <MatchTossInfo toss={currentMatch.toss} teams={currentMatch.teams} />
                        </>
                    )}

                    {/* Action buttons */}
                    <div className="mt-6 flex gap-4">
                        {[MatchStatus.SCHEDULED, MatchStatus.PENDING].includes(currentMatch.status) && (
                            <Button onClick={handleStartScoring}>
                                Start Scoring
                            </Button>
                        )}
                        {currentMatch.status === MatchStatus.ONGOING && (
                            <Button onClick={handleStartScoring}>
                                Continue Scoring
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default MatchDetails;