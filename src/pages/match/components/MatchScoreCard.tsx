import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,

    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Match } from '@/redux/features/match/matchTypes'; // Adjust path
import { Badge } from '@/components/ui/badge'; // Optional: For current innings indicator

interface MatchScoreCardProps {
    match: Match;
}

const MatchScoreCard: React.FC<MatchScoreCardProps> = ({ match }) => {
    // Filter out innings that might not have scoring data yet or are invalid
    const validInnings = match.innings?.filter(inning => inning.battingTeam && typeof inning.totalRuns === 'number') || [];

    if (!validInnings || validInnings.length === 0) {
        // Don't render the card if there are no valid innings to display
        return null;
        // Or return a placeholder:
        // return (
        //     <Card>
        //         <CardHeader>
        //             <CardTitle>Scorecard</CardTitle>
        //             <CardDescription>Score summary will appear here once available.</CardDescription>
        //         </CardHeader>
        //         <CardContent>
        //             <p className="text-sm text-muted-foreground">No innings data yet.</p>
        //         </CardContent>
        //     </Card>
        // );
    }

    // Function to calculate overs from legal balls bowled
    const formatOvers = (balls: number | null | undefined): string => {
        if (typeof balls !== 'number' || balls < 0) return '0.0';
        const overs = Math.floor(balls / 6);
        const remainingBalls = balls % 6;
        return `${overs}.${remainingBalls}`;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Scorecard</CardTitle>
                {match.currentInningsId && (
                    <CardDescription>
                        Current Innings:{' '}
                        <Badge variant="outline" className="ml-1">
                           {match.innings?.find(i => i.id === match.currentInningsId)?.battingTeam.name} batting
                        </Badge>
                    </CardDescription>
                 )}
                  {!match.currentInningsId && match.status === MatchStatus.COMPLETED && (
                     <CardDescription>Match Completed</CardDescription>
                  )}
            </CardHeader>
            <CardContent>
                <Table>
                    {/* Optional: <TableCaption>A summary of the match innings.</TableCaption> */}
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Innings</TableHead>
                            <TableHead>Batting Team</TableHead>
                            <TableHead className="text-right">Score</TableHead>
                            <TableHead className="text-right">Overs</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {validInnings.map((inning) => (
                            <TableRow key={inning.id}>
                                <TableCell className="font-medium">{`Innings ${inning.inningsNumber}`}</TableCell>
                                <TableCell>{inning.battingTeam?.name || 'N/A'}</TableCell>
                                <TableCell className="text-right">{`${inning.totalRuns ?? 0}/${inning.totalWickets ?? 0}`}</TableCell>
                                <TableCell className="text-right">{formatOvers(inning.totalLegalBallsBowled)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

// Make sure MatchStatus is imported or defined if used here for COMPLETED check
import { MatchStatus } from '@/redux/features/match/matchTypes';

export default MatchScoreCard;