import type React from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Trophy, MapPin, Calendar, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Challenge } from "@/redux/features/challenge/challengeTypes";

interface ChallengeCardProps {
  challenge: Challenge;
  onAccept?: (challengeId: string) => void;
  showActions?: boolean;
}

export default function ChallengeCard({ challenge, onAccept, showActions = true }: ChallengeCardProps) {
  
  console.log(challenge)
  const router = useNavigate();

  const handleViewChallenge = () => {
    router(`/challenges/${challenge.id}`);
  };

  const handleAcceptChallenge = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAccept) {
      onAccept(challenge.id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
            Open
          </Badge>
        );
      case "ACCEPTED":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            Accepted
          </Badge>
        );
      case "DECLINED":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
            Declined
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
            Completed
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={handleViewChallenge}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="line-clamp-1">{challenge.title}</CardTitle>
          {getStatusBadge(challenge.status)}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium capitalize">{challenge.sport}</span>
          </div>
          {challenge.level && (
            <Badge variant="secondary" className="capitalize">
              {challenge.level}
            </Badge>
          )}
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {challenge.description || "No description provided."}
        </p>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            {/* <span>{format(new Date(challenge.date), "MMM d, yyyy")}</span> */}
          </div>
          {challenge.time && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>{challenge.time}</span>
            </div>
          )}
          {challenge.location && (
            <div className="flex items-center gap-1 text-muted-foreground col-span-2">
              <MapPin className="h-3.5 w-3.5" />
              <span className="truncate">{challenge.location}</span>
            </div>
          )}
        </div>
      </CardContent>

      <Separator />

      <div className="p-4 bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {challenge.senderTeam?.logo ? (
              <div className="relative h-8 w-8 overflow-hidden rounded-full">
                <img
                  src={challenge.senderTeam.logo || "/placeholder.svg"}
                  alt={challenge.senderTeam.name}
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-4 w-4 text-primary" />
              </div>
            )}
            <div className="text-sm font-medium">{challenge.senderTeam?.name}</div>
          </div>

          <div className="text-sm text-muted-foreground">vs</div>

          <div className="flex items-center gap-2">
            {challenge.receiverTeam ? (
              <>
                <div className="text-sm font-medium text-right">{challenge.receiverTeam.name}</div>
                {challenge.receiverTeam?.logo ? (
                  <div className="relative h-8 w-8 overflow-hidden rounded-full">
                    <img
                      src={challenge.receiverTeam.logo || "/placeholder.svg"}
                      alt={challenge.receiverTeam.name}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                )}
              </>
            ) : (
              <div className="text-sm font-medium text-muted-foreground">Open Challenge</div>
            )}
          </div>
        </div>
      </div>

      {showActions && (
        <CardFooter className="pt-4">
          {challenge.status === "OPEN" && !challenge.receiverTeam && (
            <Button onClick={handleAcceptChallenge} className="w-full">
              Accept Challenge
            </Button>
          )}
          {(challenge.status !== "OPEN" || challenge.receiverTeam) && (
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
