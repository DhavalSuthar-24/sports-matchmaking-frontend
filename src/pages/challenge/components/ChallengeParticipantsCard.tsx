import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Shield, Users, User, CheckCircle, XCircle, Send, MinusCircle } from 'lucide-react';
import TeamAvatar from '../TeamAvatar'; // Adjust path
import { cn } from "@/lib/utils";
import type { Challenge } from '@/redux/features/challenge/challengeTypes'; // Adjust path
import type { Team } from '@/redux/features/challenge/common.types'; // Adjust path
import type { User as AuthUser } from '@/redux/features/user/userTypes'; // Adjust path


// Define Permissions type based on the hook's return type
type Permissions = ReturnType<typeof import('@/hooks/useChallengePermissions').useChallengePermissions>;

interface ChallengeParticipantsCardProps {
    challenge: Challenge;
    senderTeam: Team | null;
    receiverTeam: Team | null; // Represents opponent/acceptor
    permissions: Permissions;
    actionLoading: boolean;
    onOpenTeamModal: (type: 'accept' | 'request') => void;
    onDecline: () => void;
    onWithdrawRequest: () => void;
    isSenderLoading: boolean; // Pass loading state for sender team
    isReceiverLoading: boolean; // Pass loading state for receiver team
    loggedInUser: AuthUser | null; // Pass logged-in user
    userTeams: Team[] | null; // Pass user's teams
    acceptanceRequests: any[] | null; // Pass acceptance requests for display logic
}

const ChallengeParticipantsCard: React.FC<ChallengeParticipantsCardProps> = React.memo(({
    challenge,
    senderTeam,
    receiverTeam,
    permissions,
    actionLoading,
    onOpenTeamModal,
    onDecline,
    onWithdrawRequest,
    isSenderLoading,
    isReceiverLoading,
    loggedInUser,
    userTeams,
    acceptanceRequests,
}) => {
    const isOpen = challenge.status == "OPEN"
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Participants</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Challenger Team */}
                <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5"><Users className="h-4 w-4" /> Challenger Team</h4>
                    <div className="flex items-center gap-3 p-3 bg-muted/30 dark:bg-muted/10 rounded-lg border dark:border-muted/30">
                        <TeamAvatar team={senderTeam} />
                        <div className="flex-1 min-w-0">
                            <div className="font-medium truncate" title={senderTeam?.name || "Unknown Team"}>
                                {isSenderLoading ? <Skeleton className="h-5 w-32" /> : senderTeam?.name || <span className="italic text-muted-foreground">Loading...</span>}
                            </div>
                        </div>
                        {permissions.isSenderMember && (
                             <TooltipProvider delayDuration={100}><Tooltip> <TooltipTrigger><Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary shrink-0 px-1.5 py-0.5"><User className="h-3 w-3" /></Badge></TooltipTrigger> <TooltipContent>You are in this team</TooltipContent> </Tooltip></TooltipProvider>
                        )}
                    </div>
                </div>
                <Separator />
                {/* Opponent Team / Accept Actions */}
                <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5"><Users className="h-4 w-4" /> Opponent Team</h4>
                    {isReceiverLoading ? (
                         <div className="flex items-center gap-3 p-3 bg-muted/30 dark:bg-muted/10 rounded-lg border dark:border-muted/30">
                             <Skeleton className="h-10 w-10 rounded-full" />
                             <Skeleton className="h-5 w-32" />
                         </div>
                    ) : ['ACCEPTED', 'COMPLETED'].includes(challenge.status) && receiverTeam ? (
                        // Case 1: Accepted/Completed - Show Receiver/Acceptor Team
                        <div className="flex items-center gap-3 p-3 bg-muted/30 dark:bg-muted/10 rounded-lg border dark:border-muted/30">
                            <TeamAvatar team={receiverTeam} />
                            <div className="flex-1 min-w-0">
                                <div className="font-medium truncate" title={receiverTeam.name}> {receiverTeam.name} </div>
                            </div>
                            {permissions.isAcceptorMember && (
                                <TooltipProvider delayDuration={100}><Tooltip> <TooltipTrigger><Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary shrink-0 px-1.5 py-0.5"><User className="h-3 w-3" /></Badge></TooltipTrigger> <TooltipContent>You accepted with this team</TooltipContent> </Tooltip></TooltipProvider>
                            )}
                        </div>
                    ) : challenge.status === 'PENDING' && challenge.receiverTeamId && !isOpen ? (
                        // Case 2: Specific Challenge Pending - Show Accept/Decline for Receiver
                        <div className="p-4 bg-muted/30 dark:bg-muted/10 rounded-lg border border-dashed dark:border-muted/30 space-y-3 text-center">
                            <p className="text-sm text-muted-foreground">
                                Waiting for {receiverTeam ? `Team "${receiverTeam.name}"` : "designated team"} to respond.
                            </p>
                            {permissions.canAcceptDirectly && (
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <Button onClick={() => onOpenTeamModal('accept')} disabled={actionLoading} className="flex-1">
                                        <CheckCircle className={cn("mr-2 h-4 w-4", actionLoading && "animate-spin")} /> {actionLoading ? "Accepting..." : "Accept Challenge"}
                                    </Button>
                                    <Button variant="outline" onClick={onDecline} disabled={actionLoading} className="flex-1">
                                        <XCircle className={cn("mr-2 h-4 w-4", actionLoading && "animate-spin")} /> {actionLoading ? "Declining..." : "Decline"}
                                    </Button>
                                </div>
                            )}
                            {permissions.isSenderMember && (<p className="text-xs text-blue-600">You sent this specific challenge.</p>)}
                        </div>
                    ) : challenge.status === 'OPEN' ? (
                        // Case 3: Open Challenge Pending - Show Request Actions
                         <div className="p-4 bg-muted/30 dark:bg-muted/10 rounded-lg border border-dashed dark:border-muted/30 space-y-3 text-center">
                            <p className="text-sm text-muted-foreground"> This is an open challenge. </p>
                            {permissions.canRequestAccept && (
                                <Button onClick={() => onOpenTeamModal('request')} disabled={actionLoading} className="w-full">
                                    <Send className={cn("mr-2 h-4 w-4", actionLoading && "animate-spin")} /> {actionLoading ? "Sending..." : "Request to Accept"}
                                </Button>
                            )}
                            {permissions.canWithdrawRequest && (
                                <Button variant="outline" onClick={onWithdrawRequest} disabled={actionLoading} className="w-full border-amber-500 text-amber-600 hover:bg-amber-50">
                                    <MinusCircle className={cn("mr-2 h-4 w-4", actionLoading && "animate-spin")} /> {actionLoading ? "Withdrawing..." : "Withdraw My Request"}
                                </Button>
                            )}
                             {permissions.isSenderMember && (<p className="text-xs text-blue-600">{permissions.canManageRequests && acceptanceRequests && acceptanceRequests.length > 0 ? "Review acceptance requests below." : "Waiting for teams to request acceptance."}</p> )}
                             {!loggedInUser && (<p className="text-xs text-destructive">Login to interact.</p>)}
                             {loggedInUser && !permissions.canRequestAccept && !permissions.isSenderMember && !permissions.userHasPendingRequest && (!userTeams || userTeams.length === 0) && (<p className="text-xs text-destructive">Join a team to accept challenges.</p>)}
                             {loggedInUser && !permissions.isSenderMember && permissions.userHasPendingRequest && (<p className="text-xs text-green-600">Your request to accept is pending.</p>)}
                        </div>
                    ) : (
                         // Case 4: Other Statuses (Declined, Expired, Cancelled)
                        <div className="p-4 bg-muted/50 dark:bg-muted/20 rounded-lg border border-muted dark:border-muted/50 text-center">
                             <p className="text-sm font-medium text-muted-foreground">
                                {challenge.status === "DECLINED" && "Challenge was declined."}
                                {challenge.status === "EXPIRED" && "Challenge expired."}
                                {challenge.status === "PENDING" && !challenge.receiverTeamId && !isOpen && "Challenge is pending." /* Fallback */}
                             </p>
                         </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
});

export default ChallengeParticipantsCard;