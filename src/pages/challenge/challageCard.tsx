import React from "react";
import { useNavigate } from "react-router-dom";
import { format, isValid } from "date-fns"; // Import isValid
import { Trophy, MapPin, Calendar, Clock, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Challenge } from "@/redux/features/challenge/challengeTypes"; // Ensure this path and type are correct

interface ChallengeCardProps {
  challenge: Challenge;
}

// Helper Function for Status Badges (moved outside or import from shared location)
const getStatusBadge = (status: string | undefined | null) => {
  switch (status) {
    case "OPEN":
    case "PENDING": // Treat PENDING similar to OPEN visually on card? Or specific badge?
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700">
          Open
        </Badge>
      );
    case "ACCEPTED":
      return (
        <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700">
          Accepted
        </Badge>
      );
    case "DECLINED":
      return (
        <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700">
          Declined
        </Badge>
      );
    case "COMPLETED":
      return (
        <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700">
          Completed
        </Badge>
      );
    case "CANCELLED":
    case "WITHDRAWN":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-700/30 dark:text-gray-300 dark:border-gray-600">
            Cancelled
          </Badge>
        );
    case "EXPIRED":
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700">
          Expired
        </Badge>
      );
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
};


export default function ChallengeCard({ challenge }: ChallengeCardProps) {
  const navigate = useNavigate();

  const handleViewChallenge = () => {
    navigate(`/challenges/${challenge.id}`);
  };

  // Ensure challenge and its properties exist before rendering
  if (!challenge) {
    // Optionally return a Skeleton or null
    return null;
  }

  const createdAtDate = challenge.createdAt ? new Date(challenge.createdAt) : null;
  const isDateValid = createdAtDate && isValid(createdAtDate);

  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-shadow duration-200 ease-in-out cursor-pointer border group flex flex-col h-full" // Added flex container
      onClick={handleViewChallenge}
      role="link"
      aria-label={`View details for challenge: ${challenge.title}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          {/* Ensure title doesn't push badge off */}
          <CardTitle className="line-clamp-2 text-lg font-semibold group-hover:text-primary transition-colors">
            {challenge.title || "Untitled Challenge"}
          </CardTitle>
          {/* Badge aligned to the right */}
          <div className="flex-shrink-0">
             {getStatusBadge(challenge.status)}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-4 flex-grow"> {/* Added flex-grow */}
        {/* Sport and Level */}
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          {challenge.sport && (
            <div className="flex items-center gap-1.5 text-sm font-medium text-primary">
              <Trophy className="h-4 w-4 " />
              <span className="capitalize">{challenge.sport}</span>
            </div>
          )}
          {challenge.level && (
            <Badge variant="secondary" className="capitalize text-xs">
              {challenge.level}
            </Badge>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {challenge.description || <span className="italic">No description provided.</span>}
        </p>

        {/* Details Grid */}
        <div className="space-y-1 text-xs text-muted-foreground">
           {isDateValid && (
             <div className="flex items-center gap-1.5 ">
                <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                <span>Created: {format(createdAtDate, "MMM d, yyyy")}</span>
             </div>
           )}
          {/* If challenge object has a specific time property */}
          {challenge.time && (
            <div className="flex items-center gap-1.5 ">
              <Clock className="h-3.5 w-3.5 flex-shrink-0" />
              <span>{challenge.time}</span>
            </div>
          )}
          {challenge.location && (
            <div className="flex items-center gap-1.5 ">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">{challenge.location}</span>
            </div>
          )}
        </div>
      </CardContent>

      {/* Separator before Teams Section */}
      <Separator />

      {/* Teams Section */}
      <div className="p-3 bg-muted/40 dark:bg-muted/20">
        <div className="flex items-center justify-between gap-2">
          {/* Sender Team */}
          <div className="flex items-center gap-2 min-w-0 flex-1 justify-start">
            {/* Use senderTeam logoUrl if exists, otherwise fallback */}
            {challenge.senderTeam?.logoUrl ? (
              <img
                src={challenge.senderTeam.logoUrl}
                // Add onError handler maybe?
                alt={challenge.senderTeam.name || "Sender Team Logo"}
                className="h-6 w-6 rounded-full object-cover border"
              />
            ) : (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted border">
                <Shield className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            )}
            <span className="text-sm font-medium truncate" title={challenge.senderTeam?.name || "Sender Team"}>
              {challenge.senderTeam?.name || <span className="italic text-muted-foreground">Sender</span>}
            </span>
          </div>

          {/* VS Separator */}
          <div className="text-xs font-semibold text-muted-foreground px-1">VS</div>

          {/* Receiver Team / Open Challenge */}
          <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
            {challenge.receiverTeam ? (
              <>
                <span className="text-sm font-medium truncate text-right" title={challenge.receiverTeam.name || "Receiver Team"}>
                    {challenge.receiverTeam.name || <span className="italic text-muted-foreground">Opponent</span>}
                </span>
                 {/* Use receiverTeam logoUrl if exists, otherwise fallback */}
                 {challenge.receiverTeam?.logoUrl ? (
                  <img
                    src={challenge.receiverTeam.logoUrl}
                    alt={challenge.receiverTeam.name || "Receiver Team Logo"}
                    className="h-6 w-6 rounded-full object-cover border"
                  />
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted border">
                    <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                )}
              </>
            ) : challenge.isOpen ? (
                 <span className="text-sm font-medium text-blue-600 dark:text-blue-400 text-right italic">
                   Open
                 </span>
            ) : (
                 <span className="text-sm font-medium text-muted-foreground text-right italic">
                   TBD
                 </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer is removed to eliminate action buttons */}
      {/* <CardFooter className="pt-4"> ... buttons removed ... </CardFooter> */}
    </Card>
  );
}