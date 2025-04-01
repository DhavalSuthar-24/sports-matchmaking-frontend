
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Shield } from 'lucide-react';

// Define the Team type or import it if it exists in another file
type Team = {
    name?: string;
    logoUrl?: string;
};
const TeamAvatar: React.FC<{ team: Team | null | undefined }> = ({ team }) => {
    const fallbackName = team?.name ? team.name.substring(0, 2).toUpperCase() : <Shield size={20} />;
    return (
        <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border">
            {/* Assuming team object has logoUrl */}
            <AvatarImage src={team?.logoUrl || undefined} alt={team?.name || "Team Logo"} />
            <AvatarFallback className="bg-muted text-muted-foreground">
                {fallbackName}
            </AvatarFallback>
        </Avatar>
    );
}

export default TeamAvatar