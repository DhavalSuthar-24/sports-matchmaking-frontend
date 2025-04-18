import React from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MatchToss, MatchTeam, TossDecision } from '@/redux/features/match/matchTypes'; // Adjust path

interface MatchTossInfoProps {
    toss: MatchToss;
    teams: MatchTeam[]; // Needed to display team names maybe? Or assume winnerTeam has name.
}

const MatchTossInfo: React.FC<MatchTossInfoProps> = ({ toss, teams }) => {
    const getDecisionText = (decision: TossDecision | undefined): string => {
        switch (decision) {
            case 'BAT':
                return 'elected to Bat first';
            case 'BOWL':
                return 'elected to Bowl first';
            case 'FIELD':
                return 'elected to Field first'; // Often same as Bowl
            default:
                return 'decision pending'; // Or handle null/undefined case
        }
    };

    // Find the team name who called (Optional - might not be needed)
    // const calledByTeamName = teams.find(t => t.teamId === toss.calledByTeamId)?.team.name;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Toss Information</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm">
                    <span className="font-semibold">{toss.winnerTeam?.name || 'N/A'}</span> won the toss and{' '}
                    <Badge variant="secondary">{getDecisionText(toss.decision)}</Badge>.
                </p>
                {/* Optional: Add who called the toss */}
                {/* {calledByTeamName && <p className="text-xs text-muted-foreground mt-1">Called by: {calledByTeamName}</p>} */}
            </CardContent>
        </Card>
    );
};

export default MatchTossInfo;