import React from "react";
import { useNavigate } from "react-router-dom";
import { format, isValid } from "date-fns";
import {
  Trophy,
  MapPin,
  Calendar,
  Clock,
  Shield,
  UserPlus, // Icon for Request to Join
  Check,    // Icon for Accept
  X,        // Icon for Decline
  // LogOut,  // Optional: Icon for Withdraw
  // Ban,     // Optional: Icon for Expire
  Eye,      // Icon for View Details (if needed, though card click handles it)
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import type { Challenge, ChallengeStatus } from "@/redux/features/challenge/challengeTypes"; // Adjust path if necessary
import { getStatusBadge } from "./badge";




interface SimpleTeam {
  id: string;
  name: string;
  // Add logo if available in the SimpleTeam type passed down
  logo?: string | null;
}

interface ChallengeCardProps {
  challenge: Challenge; // Use the detailed Challenge type from your features
  userId?: string | null; // Current logged-in user's ID
  userTeams?: SimpleTeam[]; // Array of teams the current user belongs to
  onAccept: (challengeId: string) => void;
  onDecline: (challengeId: string) => void;
  onRequestJoin: (challengeId: string, challengeTitle?: string) => void; // Handler to open the request modal
  // Optional: Add handlers if Withdraw/Expire logic is handled here instead of parent
  onWithdraw?: (challengeId: string) => void;
  onExpire?: (challengeId: string) => void;
  isAccepting?: boolean; // Loading state for accept action
  isDeclining?: boolean; // Loading state for decline action
  // Optional: Loading states if Withdraw/Expire logic is handled here
  isWithdrawing?: boolean;
  isExpiring?: boolean;
}

export default function ChallengeCard({
  challenge,
  userId,
  userTeams = [], // Default to empty array to prevent errors
  onAccept,
  onDecline,
  onRequestJoin,
  onWithdraw, // Receive optional props if needed
  onExpire,   // Receive optional props if needed
  isAccepting = false,
  isDeclining = false,
  isWithdrawing = false, // Default optional props
  isExpiring = false,    // Default optional props
}: ChallengeCardProps) {
  const navigate = useNavigate();

  // Function to navigate to the challenge details page
  const handleViewChallenge = () => {
    navigate(`/challenges/${challenge.id}`);
  };

  // Return null or a placeholder if challenge data is missing
  if (!challenge || !challenge.id) {
    // console.warn("ChallengeCard rendered without valid challenge data.");
    return null; // Or render a skeleton/error state
  }

  // --- Action Button Logic ---
  const userTeamIds = userTeams.map(t => t.id);

  // Check if the current user is the sender of the challenge
  const isSender = userId === challenge.senderId;

  // Check if the current user is part of the designated receiver team
  const isDesignatedReceiver = !!challenge.receiverTeamId && userTeamIds.includes(challenge.receiverTeamId);

  // Determine if Accept/Decline buttons should be shown
  // Condition: User is the designated receiver AND the challenge is in PENDING state
  const canAcceptDecline = isDesignatedReceiver && challenge.status === 'PENDING';

  // Determine if Request to Join button should be shown
  // Condition: Challenge is OPEN, has NO specific receiver team, AND user is NOT the sender
  const canRequest = challenge.status === 'OPEN' && challenge.receiverTeamId === null && !isSender;

  // Optional: Determine if Withdraw button should be shown (if handled here)
  // Condition: User is the sender AND challenge is in a withdrawable state (e.g., OPEN or PENDING)
  const canWithdraw = isSender && (challenge.status === 'OPEN' || challenge.status === 'PENDING') && !!onWithdraw;

  // Optional: Determine if Expire button should be shown (if handled here)
  // Condition: User is the sender AND challenge is in an expirable state (e.g., OPEN or ACCEPTED beyond expiry date)
  // Note: Actual expiry might be better handled by backend or scheduled jobs based on 'expiresAt'
  const canExpire = isSender && (challenge.status === 'OPEN' || challenge.status === 'ACCEPTED') && !!onExpire; // Simplified condition


  // Format creation date safely
  const createdAtDate = challenge.createdAt ? new Date(challenge.createdAt) : null;
  const isCreationDateValid = createdAtDate && isValid(createdAtDate);

  // Format scheduled date/time safely
  const scheduledAtDate = challenge.teamMatch?.scheduledAt ? new Date(challenge.teamMatch.scheduledAt) : null;
  const isScheduledDateValid = scheduledAtDate && isValid(scheduledAtDate);

  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-shadow duration-200 ease-in-out border group flex flex-col h-full"
      aria-label={`Challenge: ${challenge.title || 'Untitled'}`}
    >
      {/* Make the main content area clickable for navigation */}
      <div onClick={handleViewChallenge} className="cursor-pointer flex-grow flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            {/* Challenge Title */}
            <CardTitle className="line-clamp-2 text-lg font-semibold group-hover:text-primary transition-colors">
              {challenge.title || "Untitled Challenge"}
            </CardTitle>
            {/* Status Badge */}
            <div className="flex-shrink-0">
              {getStatusBadge(challenge.status)}
            </div>
          </div>
        </CardHeader>

        {/* Card Content */}
        <CardContent className="pb-4 flex-grow space-y-3">
          {/* Sport and Skill Level */}
          <div className="flex items-center gap-3 flex-wrap">
            {challenge.teamMatch?.game?.name && (
              <div className="flex items-center gap-1.5 text-sm font-medium text-primary">
                <Trophy className="h-4 w-4 flex-shrink-0" />
                <span className="capitalize">{challenge.teamMatch.game.name}</span>
              </div>
            )}
            {challenge.teamMatch?.skillLevel && (
              <Badge variant="secondary" className="capitalize text-xs">
                {challenge.teamMatch.skillLevel.replace('_', ' ').toLowerCase()}
              </Badge>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {challenge.description || <span className="italic">No description provided.</span>}
          </p>

          {/* Details Section */}
          <div className="space-y-1.5 text-xs text-muted-foreground pt-1">
            {/* Creation Date */}
            {isCreationDateValid && (
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                <span>Created: {format(createdAtDate!, "MMM d, yyyy")}</span> {/* Use non-null assertion as it's checked */}
              </div>
            )}
            {/* Scheduled Date */}
            {isScheduledDateValid && (
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 flex-shrink-0 text-green-600" />
                <span className="font-medium text-foreground/90">
                  {format(scheduledAtDate!, "eee, MMM d, yyyy")} {/* Use non-null assertion */}
                </span>
              </div>
            )}
            {/* Scheduled Time */}
            {isScheduledDateValid && (
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 flex-shrink-0 text-green-600" />
                <span className="font-medium text-foreground/90">
                    {format(scheduledAtDate!, "h:mm a")} {/* Use non-null assertion */}
                </span>
              </div>
            )}
            {/* Location */}
            {(challenge.teamMatch?.location || challenge.teamMatch?.venue?.name) && (
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">
                  {challenge.teamMatch.locationType === 'VENUE' && challenge.teamMatch.venue
                    ? `${challenge.teamMatch.venue.name}${challenge.teamMatch.venue.location ? ` (${challenge.teamMatch.venue.location})` : ''}`
                    : challenge.teamMatch.location || 'Location not specified'}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </div> {/* End of clickable area */}

      {/* Separator */}
      <Separator />

      {/* Teams Display Section */}
      <div className="p-3 bg-muted/40 dark:bg-muted/20">
        <div className="flex items-center justify-between gap-2">
          {/* Sender Team */}
          <div className="flex items-center gap-2 min-w-0 flex-1 justify-start" title={`Sender: ${challenge.senderTeam?.name || 'N/A'}`}>
            {challenge.senderTeam?.logo ? (
              <img
                src={challenge.senderTeam.logo}
                alt={challenge.senderTeam.name || "Sender"}
                className="h-6 w-6 rounded-full object-cover border"
                onError={(e) => (e.currentTarget.style.display = 'none')} // Hide img on error
              />
            ) : (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary border text-secondary-foreground text-[10px] font-semibold">
                {challenge.senderTeam?.name?.charAt(0).toUpperCase() || 'S'}
              </div>
            )}
            <span className="text-sm font-medium truncate">
              {challenge.senderTeam?.name || <span className="italic text-muted-foreground">Sender Team</span>}
            </span>
          </div>

          {/* VS Separator */}
          <div className="text-xs font-semibold text-muted-foreground px-1">VS</div>

          {/* Receiver Team / Open Slot */}
          <div className="flex items-center gap-2 min-w-0 flex-1 justify-end" title={`Receiver: ${challenge.receiverTeam?.name || (challenge.status === 'OPEN' ? 'Open Slot' : 'Not Specified')}`}>
            {challenge.receiverTeam ? (
              <>
                <span className="text-sm font-medium truncate text-right">
                  {challenge.receiverTeam.name || <span className="italic text-muted-foreground">Opponent</span>}
                </span>
                {challenge.receiverTeam?.logo ? (
                  <img
                    src={challenge.receiverTeam.logo}
                    alt={challenge.receiverTeam.name || "Receiver"}
                    className="h-6 w-6 rounded-full object-cover border"
                    onError={(e) => (e.currentTarget.style.display = 'none')} // Hide img on error
                  />
                ) : (
                   <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary border text-secondary-foreground text-[10px] font-semibold">
                    {challenge.receiverTeam?.name?.charAt(0).toUpperCase() || 'R'}
                   </div>
                )}
              </>
            ) : challenge.status === 'OPEN' ? (
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400 text-right italic">
                Open Challenge
              </span>
            ) : (
              <span className="text-sm font-medium text-muted-foreground text-right italic">
                Awaiting Opponent
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer - Render only if there are actions */}
      {(canAcceptDecline || canRequest || canWithdraw || canExpire) && (
        <CardFooter className="pt-3 pb-3 flex justify-end gap-2 bg-muted/30 dark:bg-muted/20 border-t">
          {/* Accept/Decline Buttons */}
          {canAcceptDecline && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => { e.stopPropagation(); onDecline(challenge.id); }}
                disabled={isDeclining || isAccepting}
                aria-label="Decline Challenge"
                className="flex-1 sm:flex-none" // Make buttons flexible on small screens
              >
                <X className="mr-1 h-4 w-4" />
                {isDeclining ? "Declining..." : "Decline"}
              </Button>
              <Button
                size="sm"
                onClick={(e) => { e.stopPropagation(); onAccept(challenge.id); }}
                disabled={isAccepting || isDeclining}
                aria-label="Accept Challenge"
                className="flex-1 sm:flex-none" // Make buttons flexible on small screens
              >
                <Check className="mr-1 h-4 w-4" />
                {isAccepting ? "Accepting..." : "Accept"}
              </Button>
            </>
          )}

          {/* Request to Join Button */}
          {canRequest && (
            <Button
              size="sm"
              onClick={(e) => { e.stopPropagation(); onRequestJoin(challenge.id, challenge.title); }}
              aria-label="Request to Join Challenge"
              className="flex-1" // Takes full width if it's the only button
            >
              <UserPlus className="mr-1.5 h-4 w-4" />
              Request to Join
            </Button>
          )}

          {/* Optional: Withdraw Button */}
          {canWithdraw && onWithdraw && (
            <Button
              variant="destructive_outline" // Assuming you have this variant or use "outline" + destructive intent styling
              size="sm"
              onClick={(e) => { e.stopPropagation(); onWithdraw(challenge.id); }}
              disabled={isWithdrawing}
              aria-label="Withdraw Challenge"
              className="flex-1" // Takes full width if it's the only button
            >
              {/* <LogOut className="mr-1 h-4 w-4" /> */} {/* Optional icon */}
              {isWithdrawing ? 'Withdrawing...' : 'Withdraw'}
            </Button>
          )}

           {/* Optional: Expire Button */}
           {canExpire && onExpire && (
             <Button
               variant="outline"
               size="sm"
               onClick={(e) => { e.stopPropagation(); onExpire(challenge.id); }}
               disabled={isExpiring}
               aria-label="Mark as Expired"
               className="flex-1" // Takes full width if it's the only button
             >
               {/* <Ban className="mr-1 h-4 w-4" /> */} {/* Optional icon */}
               {isExpiring ? 'Expiring...' : 'Expire'}
             </Button>
           )}
        </CardFooter>
      )}
       {/* Fallback Footer: If no actions available, maybe show a simple view button or nothing */}
       {!(canAcceptDecline || canRequest || canWithdraw || canExpire) && challenge.status !== 'COMPLETED' && (
          <CardFooter className="pt-3 pb-3 flex justify-end gap-2 bg-muted/30 dark:bg-muted/20 border-t">
            <Button
               variant="ghost"
               size="sm"
               onClick={handleViewChallenge} // Still allows navigation
               aria-label="View Details"
               className="text-muted-foreground hover:text-primary"
            >
               <Eye className="mr-1.5 h-4 w-4" /> View Details
             </Button>
           </CardFooter>
       )}
    </Card>
  );
}