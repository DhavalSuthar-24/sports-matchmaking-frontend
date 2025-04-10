import React from 'react';
import { formatDistanceToNowStrict, isValid } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ListChecks, Check } from 'lucide-react';
import TeamAvatar from '../TeamAvatar'; // Adjust path
import { cn } from "@/lib/utils";
import { ChallengeAcceptanceStatus, type ChallengeAcceptanceRequest } from '@/redux/features/challenge/challengeTypes'; // Adjust path

interface AcceptanceRequestsCardProps {
    requests: ChallengeAcceptanceRequest[] | null;
    isLoading: boolean; // Loading state specifically for requests
    actionLoading: boolean; // General action loading state
    selectedRequestId: string | null; // ID of the request being approved
    onApprove: (requestId: string) => void;
}

const AcceptanceRequestsCard: React.FC<AcceptanceRequestsCardProps> = React.memo(({
    requests,
    isLoading,
    actionLoading,
    selectedRequestId,
    onApprove,
}) => {
    const pendingRequests = requests?.filter(r => r.status === ChallengeAcceptanceStatus.PENDING_APPROVAL) ?? [];
     console.log(pendingRequests,"reqqqqqqqq")
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ListChecks className="h-5 w-5" /> Acceptance Requests ({pendingRequests.length} Pending)
                </CardTitle>
                <CardDescription>Teams requesting to accept this open challenge. Approve one to start the match.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading && <Skeleton className="h-20 w-full" />}
                {!isLoading && (!requests || requests.length === 0) && (
                    <p className="text-sm text-muted-foreground text-center py-4">No acceptance requests found.</p>
                )}
                {!isLoading && requests && requests.length > 0 && (
                    <div className="space-y-3">
                         <TooltipProvider delayDuration={100}>
                            {requests.map((req) => (
                                <div key={req.id} className="flex items-center justify-between gap-3 p-3 border rounded-lg bg-background">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <TeamAvatar team={req?.acceptingTeam} />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate" title={req.acceptingTeam?.name || `Team ID: ${req.acceptingTeam?.id}`}>
                                                {req.acceptingTeam?.name || <span className="italic">Unknown Team</span>}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Requested: {isValid(new Date(req.createdAt)) ? formatDistanceToNowStrict(new Date(req.createdAt), { addSuffix: true }) : 'N/A'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        {req.status === 'PENDING_APPROVAL' && (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-green-600 hover:bg-green-100 hover:text-green-700 p-1 h-auto"
                                                        onClick={() => onApprove(req.id)}
                                                        disabled={actionLoading}
                                                    >
                                                        <Check className={cn("h-5 w-5", actionLoading && selectedRequestId === req.id && "animate-spin")} />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Approve Request</TooltipContent>
                                            </Tooltip>
                                        )}
                                        {req.status === ChallengeAcceptanceStatus.APPROVED && <Badge variant="default" className="text-xs">Approved</Badge>}
                                        {req.status === ChallengeAcceptanceStatus.REJECTED && <Badge variant="destructive" className="text-xs">Declined</Badge>}
                                        {req.status === ChallengeAcceptanceStatus.WITHDRAWN && <Badge variant="outline" className="text-xs">Withdrawn</Badge>}
                                    </div>
                                </div>
                            ))}
                        </TooltipProvider>
                    </div>
                )}
            </CardContent>
        </Card>
    );
});

export default AcceptanceRequestsCard;