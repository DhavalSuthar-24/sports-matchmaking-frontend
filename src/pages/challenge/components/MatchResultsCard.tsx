import React from 'react';
import { format, isValid } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy } from 'lucide-react';
import type { Challenge } from '@/redux/features/challenge/challengeTypes'; // Adjust path
import type { Team } from '@/redux/features/challenge/common.types'; // Adjust path
import { ChallengeStatus } from '@/redux/features/challenge/challengeTypes';
interface MatchResultsCardProps {
    challenge: Challenge;
    senderTeam: Team | null;
    receiverTeam: Team | null; // Represents the opponent/acceptor
}

const MatchResultsCard: React.FC<MatchResultsCardProps> = React.memo(({
    challenge,
    senderTeam,
    receiverTeam,
}) => {
    if (challenge.status !== ChallengeStatus.COMPLETED || !challenge.matchResults) {
        return null;
    }

    const { matchResults } = challenge;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-600"><Trophy className="h-5 w-5" /> Match Results</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-around py-4 bg-muted/50 dark:bg-muted/20 rounded-lg mb-4 border">
                    {/* Sender */}
                    <div className="text-center px-2 sm:px-4">
                        <p className="font-semibold text-sm sm:text-base truncate max-w-[100px] sm:max-w-[150px]" title={senderTeam?.name || "Challenger"}>
                            {senderTeam?.name || "Challenger"}
                        </p>
                        <p className="text-4xl font-bold my-1 sm:my-2">{matchResults?.senderScore ?? "-"}</p>
                        {matchResults?.winner === 'SENDER' && (<Badge variant="default" className="bg-green-600 hover:bg-green-700 text-xs">Winner</Badge>)}
                    </div>
                    {/* VS */}
                    <div className="text-center px-1 sm:px-2"><p className="text-xl font-semibold text-muted-foreground">VS</p></div>
                    {/* Receiver/Opponent */}
                    <div className="text-center px-2 sm:px-4">
                        <p className="font-semibold text-sm sm:text-base truncate max-w-[100px] sm:max-w-[150px]" title={receiverTeam?.name || "Opponent"}>
                            {receiverTeam?.name || "Opponent"}
                        </p>
                        <p className="text-4xl font-bold my-1 sm:my-2">{matchResults?.receiverScore ?? "-"}</p>
                        {matchResults?.winner === 'RECEIVER' && (<Badge variant="default" className="bg-green-600 hover:bg-green-700 text-xs">Winner</Badge>)}
                        {matchResults?.winner === 'DRAW' && (<Badge variant="secondary" className="text-xs">Draw</Badge>)}
                    </div>
                </div>
                {matchResults?.notes && (
                    <div className="mt-4 p-3 bg-muted dark:bg-muted/30 rounded-md border dark:border-muted/50">
                        <h4 className="text-sm font-medium mb-1 text-foreground">Match Notes</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{matchResults.notes}</p>
                    </div>
                )}
                {matchResults?.completedAt && isValid(new Date(matchResults.completedAt)) && (
                    <p className="text-xs text-muted-foreground text-right mt-3">
                        Completed: {format(new Date(matchResults.completedAt), "PPP 'at' p")}
                    </p>
                )}
            </CardContent>
        </Card>
    );
});

export default MatchResultsCard;