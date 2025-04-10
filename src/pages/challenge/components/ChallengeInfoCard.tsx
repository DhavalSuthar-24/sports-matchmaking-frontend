import React from 'react';
import { format, isValid } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Info, MapPin, Calendar, User, Hourglass } from 'lucide-react';
import type { Challenge } from '@/redux/features/challenge/challengeTypes'; // Adjust path

interface ChallengeInfoCardProps {
    challenge: Challenge;
    timeRemaining: string | null;
    expiryProgress: number;
}

const ChallengeInfoCard: React.FC<ChallengeInfoCardProps> = React.memo(({
    challenge,
    timeRemaining,
    expiryProgress,
}) => {
    console.log("first,",challenge)
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Info className="h-5 w-5" /> Challenge Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {challenge.status === "OPEN" && challenge.expiresAt && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg space-y-1 border border-blue-200 dark:border-blue-800">
                        <div className="flex justify-between items-center gap-2">
                            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 flex items-center gap-1"><Hourglass className="h-4 w-4" /> Expires</h3>
                            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                                {timeRemaining ?? <Skeleton className="h-4 w-20 inline-block" />}
                            </span>
                        </div>
                        <Progress value={expiryProgress} className="h-1.5 [&>div]:bg-blue-500" />
                        {isValid(new Date(challenge.expiresAt)) && (
                            <p className="text-xs text-muted-foreground text-right pt-1">
                                {format(new Date(challenge.expiresAt), "MMM d, yyyy, h:mm a")}
                            </p>
                        )}
                    </div>
                )}
                <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                    <p className="text-sm leading-relaxed prose dark:prose-invert max-w-none">
                        {challenge.description || <span className="italic text-muted-foreground">No description provided.</span>}
                    </p>
                </div>
                <Separator />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Created On</h3>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span className="text-sm">{challenge.createdAt && isValid(new Date(challenge.createdAt)) ? format(new Date(challenge.createdAt), "PPP") : "N/A"}</span>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Created By</h3>
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span className="text-sm truncate" title={challenge.createdBy || "Unknown"}>
                                { challenge.createdBy || <span className="italic text-muted-foreground">Unknown User</span>}
                            </span>
                        </div>
                    </div>
                    {challenge?.teamMatch?.venue.name && (
                        <div className="sm:col-span-2">
                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Location</h3>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                                <span className="text-sm">{challenge?.teamMatch?.venue.name}</span>
                            </div>
                        </div>
                    )}
                </div>
                {challenge.teamMatch && Object.keys(challenge.teamMatch).length > 0 && (
                    <>
                        <Separator />
                        <div className="space-y-3">
                            <h3 className="text-base font-semibold">Match Details</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
                                {challenge.teamMatch.gameId && <p><strong>Game:</strong> {challenge.teamMatch.gameId}</p>}
                                {challenge.teamMatch.matchType && <p><strong>Type:</strong> {challenge.teamMatch.matchType}</p>}
                                {challenge.teamMatch.customRules && <p className="sm:col-span-2"><strong>Rules:</strong> <span className="whitespace-pre-wrap">{challenge.teamMatch.customRules}</span></p>}
                            </div>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
});

export default ChallengeInfoCard;