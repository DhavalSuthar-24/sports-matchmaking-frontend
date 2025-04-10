import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, MinusCircle, Trophy } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { getStatusBadge } from "../badge"; // Adjust path
import type { Challenge } from '@/redux/features/challenge/challengeTypes'; // Adjust path

interface ChallengeHeaderProps {
    challenge: Challenge;
    canWithdrawChallenge: boolean;
    canModify: boolean;
    actionLoading: boolean;
    onWithdraw: () => void;
    onDelete: () => void;
}

const ChallengeHeader: React.FC<ChallengeHeaderProps> = React.memo(({
    challenge,
    canWithdrawChallenge,
    canModify,
    actionLoading,
    onWithdraw,
    onDelete
}) => {
    console.log(canModify,"canModify")
    const navigate = useNavigate();

    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="shrink-0" aria-label="Go back">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
                        {challenge.title}
                        {challenge.status=="OPEN" && (
                             <TooltipProvider delayDuration={100}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Badge variant="outline" className="text-xs border-blue-500 text-blue-600 cursor-help">Open</Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>Open challenge: any eligible team can request to accept.</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </h1>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {getStatusBadge(challenge.status)}
                        {challenge?.match && (
                            <Badge variant="secondary" className="capitalize"> <Trophy className="h-3 w-3 mr-1" /> {challenge?.match?.game ||"Cricket"} </Badge>
                        )}
                        {challenge?.match && (
                            <Badge variant="outline" className="capitalize"> Level: {challenge?.match?.skillLevel} </Badge>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto justify-end flex-wrap">
                {canWithdrawChallenge && (
                    <Button variant="outline" onClick={onWithdraw} disabled={actionLoading} className="border-amber-500 text-amber-600 hover:bg-amber-50">
                        <MinusCircle className={cn("mr-2 h-4 w-4", actionLoading && "animate-spin")} />
                        {actionLoading ? "Withdrawing..." : "Withdraw"}
                    </Button>
                )}
                {canModify && (
                    <Button variant="destructive" onClick={onDelete} disabled={actionLoading}>
                        <Trash2 className={cn("mr-2 h-4 w-4", actionLoading && "animate-spin")} />
                        {actionLoading ? "Deleting..." : "Delete"}
                    </Button>
                )}
            </div>
        </div>
    );
});

export default ChallengeHeader;