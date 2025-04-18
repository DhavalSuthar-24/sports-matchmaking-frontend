import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users } from 'lucide-react'; // Use Users icon as fallback
import { MatchTeam } from '@/redux/features/match/matchTypes'; // Adjust path

interface MatchTeamsProps {
    teams: MatchTeam[];
}

const MatchTeams: React.FC<MatchTeamsProps> = ({ teams }) => {
    // Ensure we only display the first two teams if more are present unexpectedly
    const displayTeams = teams.slice(0, 2);

    return (
        // Removed the wrapping Card to integrate directly into MatchDetails CardContent
        <div className="teams-section">
            <h3 className="text-lg font-semibold mb-4">Teams</h3>
            <div className="flex flex-col sm:flex-row justify-around items-center gap-6 sm:gap-10">
                {displayTeams.map((team, index) => (
                    <React.Fragment key={team.teamId}>
                        <div className="text-center flex flex-col items-center">
                            <Avatar className="h-16 w-16 mb-2">
                                <AvatarImage src={team.team.logo || undefined} alt={`${team.team.name} logo`} />
                                <AvatarFallback>
                                    <Users className="h-8 w-8" />
                                </AvatarFallback>
                            </Avatar>
                            <h4 className="text-md font-medium mb-1">
                                {team.team.name}
                            </h4>
                            {/* Display score if available (from overall match data, might differ per innings) */}
                            {/* Example: You might want to show final score here if match completed */}
                            {/* {team.score !== undefined && (
                                <p className="text-sm font-semibold">{team.score} runs</p>
                             )} */}
                        </div>
                        {/* Add "vs" between teams on larger screens */}
                        {index === 0 && displayTeams.length > 1 && (
                           <span className="hidden sm:inline-block font-semibold text-muted-foreground text-lg">vs</span>
                        )}
                         {/* Add "vs" between teams on smaller screens */}
                         {index === 0 && displayTeams.length > 1 && (
                           <span className="sm:hidden font-semibold text-muted-foreground text-lg my-2">vs</span>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default MatchTeams;