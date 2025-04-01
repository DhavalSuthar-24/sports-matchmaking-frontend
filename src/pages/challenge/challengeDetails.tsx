// src/components/challenges/ChallengeDetail.tsx
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { format, formatDistanceToNowStrict, isValid } from "date-fns"; // Added isValid
import {
    MapPin, Calendar, Clock, ArrowLeft, Shield, Users, Trash2, Edit,
    CheckCircle, XCircle, Trophy, AlertCircle, Info, User, Send,
    Hourglass, Check, MinusCircle, ListChecks,
} from "lucide-react";
import toast from "react-hot-toast";

// UI Components (adjust paths as needed)
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import TeamSelectionModal from "./TeamSelectionModal"; // Adjust path
import { getStatusBadge } from "./badge"; // Adjust path

// Redux Imports (adjust paths as needed)
import {
    getChallenge, deleteChallenge, acceptTeamChallenge, declineChallenge,
    getChallengeSenderTeam, getChallengeReceiverTeam, withdrawTeamChallenge,
    requestAcceptOpenChallenge, getOpenChallengeAcceptanceRequests,
    approveChallengeAcceptanceRequest, withdrawChallengeAcceptanceRequest,
    // expireChallenge, // Uncomment if needed
    // getChallengeAcceptorTeam, // Uncomment if acceptor needs separate fetch
    // getChallengeMatch, // Uncomment if match details aren't nested/need separate fetch
} from "@/redux/features/challenge/challengeThunks"; // Adjust path
import  {clearCurrentChallenge} from "@/redux/features/challenge/challengeSlice";
 // Corrected import assuming named export
import type { AppDispatch, RootState } from "@/redux/store"; // Adjust path

// Type Imports (Ensure these types accurately reflect your API and Redux state structure)
// You might need to define these based on challengeTypes.ts and the actual API responses
import type {
    Challenge, // Define this type accurately

} from "@/redux/features/challenge/challengeTypes";
import {Team} from "@/redux/features/challenge/common.types";
import TeamAvatar from "./TeamAvatar"; // Adjust path if necessary




export default function ChallengeDetail() {
    const { challengeId } = useParams<{ challengeId: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    // --- Redux State Selection ---
    const {
        currentChallenge,
        senderTeam,
        receiverTeam, // This usually represents the ACCEPTOR team after acceptance
        // acceptorTeam, // Only needed if fetched separately
        acceptanceRequests,
        loading, // Loading main challenge details
        error,   // Error fetching main challenge details
        actionLoading, // Loading state for specific actions
        // actionError,   // Error from actions (mainly handled by toast)
    } = useSelector((state: RootState) => state.challenges);
    const { user } = useSelector((state: RootState) => state.auth);
    // Assuming userTeams are the teams the logged-in user is a member of
    const { teams: userTeams } = useSelector((state: RootState) => state.teams);

    // --- Local State ---
    const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
    const [modalActionType, setModalActionType] = useState<'accept' | 'request'>('accept');
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
    const [confirmDialogContent, setConfirmDialogContent] = useState({ title: "", description: "" });
    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null); // For tracking approval action

    const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
    const [expiryProgress, setExpiryProgress] = useState(0);

    // --- Data Fetching Effects ---
    useEffect(() => {
        if (challengeId) {
            dispatch(getChallenge(challengeId));
        }
        // Cleanup on unmount
        return () => {
            dispatch(clearCurrentChallenge());
        };
    }, [dispatch, challengeId]);

    // Fetch related entities *after* main challenge data is loaded
    useEffect(() => {
        if (currentChallenge && challengeId) {
            // Fetch sender team if ID exists but data isn't loaded
            if (currentChallenge.senderTeamId && !senderTeam) {
                dispatch(getChallengeSenderTeam(challengeId));
            }
            // Fetch receiver/acceptor team if ID exists but data isn't loaded
            // The receiverTeam state usually holds the team that accepted
            if (currentChallenge.receiverTeamId && !receiverTeam) {
                 dispatch(getChallengeReceiverTeam(challengeId));
            } else if (currentChallenge.acceptedByTeamId && !receiverTeam) {
                // Fallback if acceptedByTeamId is present but receiverTeam isn't loaded yet
                // This assumes getChallengeReceiverTeam fetches the team that accepted
                 dispatch(getChallengeReceiverTeam(challengeId));
            }

            // Fetch acceptance requests for open challenges
            if (currentChallenge.isOpen && currentChallenge.status === 'OPEN') {
                dispatch(getOpenChallengeAcceptanceRequests(challengeId));
            }
            // Optional: Fetch match details separately if needed
            // if (currentChallenge.matchId && !challengeMatch) dispatch(getChallengeMatch(challengeId));
        }
    }, [dispatch, currentChallenge, challengeId, senderTeam, receiverTeam]); // Removed acceptorTeam dependency unless separate fetching is added


    // --- Calculate Expiry Time ---
    useEffect(() => {
        if (currentChallenge?.status === "OPEN" && currentChallenge?.expiresAt) {
            const expiryDate = new Date(currentChallenge.expiresAt);
            const creationDate = currentChallenge.createdAt ? new Date(currentChallenge.createdAt) : new Date();

            if (!isValid(expiryDate)) {
                setTimeRemaining("Invalid date");
                setExpiryProgress(0);
                return;
            }

            const updateTimer = () => {
                const now = new Date();
                const remainingMillis = expiryDate.getTime() - now.getTime();
                const totalDuration = expiryDate.getTime() - creationDate.getTime();

                if (remainingMillis > 0 && totalDuration > 0) {
                    setTimeRemaining(formatDistanceToNowStrict(expiryDate, { addSuffix: true }));
                    const elapsed = now.getTime() - creationDate.getTime();
                    setExpiryProgress(Math.min(Math.max(0, Math.round((elapsed / totalDuration) * 100)), 100));
                } else {
                    setTimeRemaining("Expired");
                    setExpiryProgress(100);
                }
            };

            updateTimer();
            const intervalId = setInterval(updateTimer, 60000); // Update every minute
            return () => clearInterval(intervalId);

        } else {
            setTimeRemaining(null);
            setExpiryProgress(0);
        }
    }, [currentChallenge?.status, currentChallenge?.expiresAt, currentChallenge?.createdAt]);


    // --- Derived State & Permissions ---
    const userTeamIds = useMemo(() => {
        if (!user || !userTeams) return [];
        return userTeams.map(team => team.id);
    }, [user, userTeams]);

    const permissions = useMemo(() => {
        const defaultPermissions = {
            isCreator: false, isSenderMember: false, isReceiverMember: false, isAcceptorMember: false,
            canModify: false, canAcceptDirectly: false, canDeclineDirectly: false, canRequestAccept: false,
            canWithdrawRequest: false, canManageRequests: false, canWithdrawChallenge: false,
            userHasPendingRequest: false, userPendingRequestId: null,
        };

        if (!user || !currentChallenge) return defaultPermissions;

        const userId = user.id;
        const challengeStatus = currentChallenge.status;
        // Ensure Challenge type has 'isOpen' boolean property
        const isOpenChallenge = !!currentChallenge.isOpen;

        // Ensure Challenge type has 'createdById' property matching user ID structure
        // Use senderId as fallback if createdById isn't primary
        const isCreator = currentChallenge.createdBy === userId || currentChallenge.senderId === userId;
        const isSenderMember = userTeamIds.includes(currentChallenge.senderTeamId);

        // Check membership in the *specified* receiver team (for specific challenges before acceptance)
        const isReceiverMember = !!currentChallenge.receiverTeamId && userTeamIds.includes(currentChallenge.receiverTeamId);

        // Check membership in the team that *actually* accepted
        const isAcceptorMember = !!currentChallenge.acceptedByTeamId && userTeamIds.includes(currentChallenge.acceptedByTeamId);

        // Find user's pending request among the fetched requests
        const userPendingRequest = acceptanceRequests?.find(req =>
            req.status === 'PENDING' &&
            !!req.requestingTeamId && userTeamIds.includes(req.requestingTeamId)
        );

        // --- Determine Actions ---
        const canModify = (isCreator || isSenderMember) && ['PENDING', 'OPEN'].includes(challengeStatus);
        const canWithdrawChallenge = (isCreator || isSenderMember) && ['PENDING', 'OPEN'].includes(challengeStatus);

        // Can accept a *specific* challenge (receiverTeamId is set, status PENDING, not open)
        const canAcceptDirectly = isReceiverMember && challengeStatus === 'PENDING' && !isOpenChallenge;
        // Can decline a *specific* challenge
        const canDeclineDirectly = isReceiverMember && challengeStatus === 'PENDING' && !isOpenChallenge;

        // Can request to accept an *open* challenge
        const canRequestAccept = !isCreator && !isSenderMember && challengeStatus === 'OPEN' && isOpenChallenge && !userPendingRequest && userTeams && userTeams.length > 0;

        // Can withdraw *own* pending request for an open challenge
        const canWithdrawRequest = !!userPendingRequest;

        // Can manage (approve/reject) requests for *own* open challenge
        const canManageRequests = (isCreator || isSenderMember) && challengeStatus === 'OPEN' && isOpenChallenge; // Simplified: show section if creator/sender

        return {
            ...defaultPermissions, // Start with defaults
            isCreator, isSenderMember, isReceiverMember, isAcceptorMember,
            canModify, canAcceptDirectly, canDeclineDirectly, canRequestAccept,
            canWithdrawRequest, canManageRequests, canWithdrawChallenge,
            userHasPendingRequest: !!userPendingRequest,
            userPendingRequestId: userPendingRequest?.id ?? null,
        };
    }, [user, currentChallenge, userTeams, acceptanceRequests, userTeamIds]); // Removed sender/receiverTeam direct dependency


    // --- Action Handlers ---

    const showConfirmDialog = (title: string, description: string, onConfirm: () => void) => {
        setConfirmDialogContent({ title, description });
        setConfirmAction(() => onConfirm);
        setIsConfirmDialogOpen(true);
    };

    const handleConfirm = () => {
        if (confirmAction) {
            confirmAction();
        }
        setIsConfirmDialogOpen(false);
        setConfirmAction(null);
    };

    const handleDelete = () => {
        if (!challengeId) return;
        showConfirmDialog(
            "Confirm Deletion",
            "This action cannot be undone. Are you sure you want to permanently delete this challenge?",
            async () => {
                const resultAction = await dispatch(deleteChallenge(challengeId));
                if (deleteChallenge.fulfilled.match(resultAction)) {
                    toast.success("Challenge deleted successfully");
                    navigate("/challenges");
                } else {
                    const message = (resultAction.payload as { message: string })?.message || "Failed to delete challenge";
                    toast.error(`Deletion failed: ${message}`);
                }
            }
        );
    };

    const handleWithdraw = () => {
        if (!challengeId) return;
        showConfirmDialog(
            "Confirm Withdrawal",
            "Are you sure you want to withdraw this challenge? It will be cancelled.",
            async () => {
                const resultAction = await dispatch(withdrawTeamChallenge(challengeId));
                if (withdrawTeamChallenge.fulfilled.match(resultAction)) {
                    toast.success("Challenge withdrawn successfully");
                    dispatch(getChallenge(challengeId)); // Re-fetch to update status
                } else {
                    const message = (resultAction.payload as { message: string })?.message || "Failed to withdraw challenge";
                    toast.error(`Withdrawal failed: ${message}`);
                }
            }
        );
    };

    const handleDecline = () => {
        if (!challengeId) return;
        showConfirmDialog(
            "Confirm Decline",
            "Are you sure you want to decline this challenge?",
            async () => {
                const resultAction = await dispatch(declineChallenge(challengeId));
                if (declineChallenge.fulfilled.match(resultAction)) {
                    toast.success("Challenge declined");
                    dispatch(getChallenge(challengeId)); // Re-fetch to update status
                } else {
                    const message = (resultAction.payload as { message: string })?.message || "Failed to decline challenge";
                    toast.error(`Decline failed: ${message}`);
                }
            }
        );
    };

    const handleOpenTeamModal = (type: 'accept' | 'request') => {
        if (!user) { toast.error("You must be logged in."); return; }
        if (!userTeams || userTeams.length === 0) { toast.error("You need to be part of a team first."); return; }
        setModalActionType(type);
        setIsTeamModalOpen(true);
    };

    const handleSelectTeam = async (teamId: string) => {
        if (!challengeId || !user) return;
        setIsTeamModalOpen(false);

        let actionThunk: any;
        let payload: any;
        let successMessage: string;
        let failureMessage: string;
        let isRequest = false;

        if (modalActionType === 'accept') {
            actionThunk = acceptTeamChallenge;
            payload = { challengeId, data: { teamId } };
            successMessage = "Challenge accepted successfully";
            failureMessage = "Failed to accept challenge";
        } else { // 'request'
            actionThunk = requestAcceptOpenChallenge;
            payload = { challengeId, data: { teamId } };
            successMessage = "Request to accept sent";
            failureMessage = "Failed to send acceptance request";
            isRequest = true;
        }

        try {
            const resultAction = await dispatch(actionThunk(payload));
            if (actionThunk.fulfilled.match(resultAction)) {
                toast.success(successMessage);
                dispatch(getChallenge(challengeId)); // Re-fetch challenge details
                if (isRequest) {
                    dispatch(getOpenChallengeAcceptanceRequests(challengeId)); // Re-fetch requests
                }
            } else {
                const message = (resultAction.payload as { message: string })?.message || failureMessage;
                toast.error(`${failureMessage}: ${message}`);
            }
        } catch (err: any) {
            console.error("Error during team selection action:", err);
            toast.error(`An unexpected error occurred: ${err.message || failureMessage}`);
        }
    };

    const handleApproveRequest = async (requestId: string) => {
        if (!challengeId || !requestId) return;
        setSelectedRequestId(requestId); // Indicate which request is being processed

        showConfirmDialog(
            "Approve Acceptance Request",
            "Approving this request will accept the challenge with this team and decline other pending requests. Continue?",
            async () => {
                const resultAction = await dispatch(
                    approveChallengeAcceptanceRequest({
                        challengeId,
                        requestId,
                        // Ensure 'data' matches ApproveChallengeAcceptanceRequest type definition
                        data: { /* matchDetails: {} */ } // Add any required data here
                    })
                );

                if (approveChallengeAcceptanceRequest.fulfilled.match(resultAction)) {
                    toast.success("Acceptance request approved successfully!");
                    dispatch(getChallenge(challengeId)); // Refresh challenge data
                    dispatch(getOpenChallengeAcceptanceRequests(challengeId)); // Refresh request list
                } else {
                    const message = (resultAction.payload as { message: string })?.message || "Failed to approve request";
                    toast.error(`Approval failed: ${message}`);
                }
                setSelectedRequestId(null); // Reset loading indicator after completion/error
            }
        );
        // Keep dialog open until confirmed, reset selectedRequestId if cancelled
        if (!isConfirmDialogOpen) setSelectedRequestId(null);
    };

    const handleWithdrawRequest = async () => {
        const requestId = permissions.userPendingRequestId;
        if (!requestId) return;

        showConfirmDialog(
            "Withdraw Acceptance Request",
            "Are you sure you want to withdraw your request to accept this challenge?",
            async () => {
                const resultAction = await dispatch(withdrawChallengeAcceptanceRequest(requestId));
                if (withdrawChallengeAcceptanceRequest.fulfilled.match(resultAction)) {
                    toast.success("Acceptance request withdrawn");
                    dispatch(getOpenChallengeAcceptanceRequests(challengeId!)); // Re-fetch requests
                } else {
                    const message = (resultAction.payload as { message: string })?.message || "Failed to withdraw request";
                    toast.error(`Withdrawal failed: ${message}`);
                }
            }
        );
    };


    // --- Render Logic ---

    // Loading State
    if (loading && !currentChallenge) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Simplified Skeleton for brevity */}
                <Skeleton className="h-10 w-1/4 mb-4" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6"> <Skeleton className="h-64 w-full" /> <Skeleton className="h-32 w-full" /> </div>
                    <div className="space-y-6"> <Skeleton className="h-80 w-full" /> <Skeleton className="h-48 w-full" /> </div>
                </div>
            </div>
        );
    }

    // Error State
    if (error && !currentChallenge) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <Card className="border-destructive">
                    <CardHeader> <CardTitle className="flex items-center gap-2 text-destructive"><AlertCircle className="h-6 w-6" /> Error Loading Challenge</CardTitle> </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-muted-foreground mb-4">{error || "An unexpected error occurred."}</p>
                        <Button onClick={() => navigate("/challenges")} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Challenges </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Not Found State (API returned successfully but no challenge data)
    if (!loading && !currentChallenge) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <Card>
                    <CardHeader> <CardTitle className="flex items-center gap-2 text-muted-foreground"><Info className="h-6 w-6" /> Challenge Not Found</CardTitle> </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-muted-foreground mb-4">This challenge may have been deleted, expired, or does not exist.</p>
                        <Button onClick={() => navigate("/challenges")} variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Challenges </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }


    const challenge: Challenge = currentChallenge;

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <TooltipProvider delayDuration={100}>
                <div className="space-y-6">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="shrink-0" aria-label="Go back"> <ArrowLeft className="h-4 w-4" /> </Button>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
                                    {challenge.title}
                                    {challenge.isOpen && (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                               <Badge variant="outline" className="text-xs border-blue-500 text-blue-600 cursor-help">Open</Badge>
                                            </TooltipTrigger>
                                            <TooltipContent>Open challenge: any eligible team can request to accept.</TooltipContent>
                                        </Tooltip>
                                    )}
                                </h1>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                    {getStatusBadge(challenge.status)}
                                    {challenge.sport && (
                                      <Badge variant="secondary" className="capitalize"> <Trophy className="h-3 w-3 mr-1" /> {challenge.sport} </Badge>
                                    )}
                                    {challenge.level && (
                                      <Badge variant="outline" className="capitalize"> Level: {challenge.level} </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* Action Buttons Header */}
                        <div className="flex gap-2 w-full sm:w-auto justify-end flex-wrap">
                            {permissions.canWithdrawChallenge && (
                                <Button variant="outline" onClick={handleWithdraw} disabled={actionLoading} className="border-amber-500 text-amber-600 hover:bg-amber-50">
                                    <MinusCircle className={cn("mr-2 h-4 w-4", actionLoading && "animate-spin")} />
                                    {actionLoading ? "Withdrawing..." : "Withdraw"}
                                </Button>
                            )}
                            {permissions.canModify && (
                                <Button variant="destructive" onClick={handleDelete} disabled={actionLoading}>
                                    <Trash2 className={cn("mr-2 h-4 w-4", actionLoading && "animate-spin")} />
                                    {actionLoading ? "Deleting..." : "Delete"}
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Challenge Details & Results */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader> <CardTitle className="flex items-center gap-2"><Info className="h-5 w-5" /> Challenge Information</CardTitle> </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Expiry Info */}
                                    {challenge.status === "OPEN" && challenge.expiresAt && (
                                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg space-y-1 border border-blue-200 dark:border-blue-800">
                                            <div className="flex justify-between items-center gap-2">
                                                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 flex items-center gap-1"><Hourglass className="h-4 w-4" /> Expires</h3>
                                                <span className="text-sm font-semibold text-blue-700 dark:text-blue-300"> {timeRemaining ?? <Skeleton className="h-4 w-20 inline-block" />} </span>
                                            </div>
                                            <Progress value={expiryProgress} className="h-1.5 [&>div]:bg-blue-500" />
                                            {isValid(new Date(challenge.expiresAt)) && (
                                              <p className="text-xs text-muted-foreground text-right pt-1"> {format(new Date(challenge.expiresAt), "MMM d, yyyy, h:mm a")} </p>
                                            )}
                                        </div>
                                    )}
                                    {/* Description */}
                                    <div>
                                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                                        <p className="text-sm leading-relaxed prose dark:prose-invert max-w-none"> {challenge.description || <span className="italic text-muted-foreground">No description provided.</span>} </p>
                                    </div>
                                    <Separator />
                                    {/* Details Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Created On</h3>
                                            <div className="flex items-center gap-2"> <Calendar className="h-4 w-4 text-muted-foreground shrink-0" /> <span className="text-sm">{challenge.createdAt && isValid(new Date(challenge.createdAt)) ? format(new Date(challenge.createdAt), "PPP") : "N/A"}</span> </div>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Created By</h3>
                                            {/* Assumes challenge.createdByUser { id, username } exists */}
                                            <div className="flex items-center gap-2"> <User className="h-4 w-4 text-muted-foreground shrink-0" /> <span className="text-sm truncate" title={challenge.createdByUser?.username || challenge.createdBy || "Unknown"}>{challenge.createdByUser?.username || challenge.createdBy || <span className="italic text-muted-foreground">Unknown User</span>}</span> </div>
                                        </div>
                                        {challenge.location && (
                                            <div className="sm:col-span-2">
                                                <h3 className="text-sm font-medium text-muted-foreground mb-1">Location</h3>
                                                <div className="flex items-center gap-2"> <MapPin className="h-4 w-4 text-muted-foreground shrink-0" /> <span className="text-sm">{challenge.location}</span> </div>
                                            </div>
                                        )}
                                    </div>
                                    {/* Match Details - Access safely */}
                                    {/* Assumes Challenge type has optional matchDetails: MatchDetails */}
                                    {challenge.matchDetails && Object.keys(challenge.matchDetails).length > 0 && (
                                        <> <Separator />
                                            <div className="space-y-3">
                                                <h3 className="text-base font-semibold">Match Details</h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
                                                    {challenge.matchDetails.gameId && <p><strong>Game:</strong> {challenge.matchDetails.gameId}</p>}
                                                    {challenge.matchDetails.matchType && <p><strong>Type:</strong> {challenge.matchDetails.matchType}</p>}
                                                    {challenge.matchDetails.format && <p><strong>Format:</strong> {challenge.matchDetails.format}</p>}
                                                    {challenge.matchDetails.rules && <p className="sm:col-span-2"><strong>Rules:</strong> <span className="whitespace-pre-wrap">{challenge.matchDetails.rules}</span></p>}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Match Results Section - Access safely */}
                             {/* Assumes Challenge type has optional matchResults: MatchResults */}
                            {challenge.status === "COMPLETED" && challenge.matchResults && (
                                <Card>
                                    <CardHeader> <CardTitle className="flex items-center gap-2 text-amber-600"><Trophy className="h-5 w-5" /> Match Results</CardTitle> </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-around py-4 bg-muted/50 dark:bg-muted/20 rounded-lg mb-4 border">
                                            <div className="text-center px-2 sm:px-4">
                                                <p className="font-semibold text-sm sm:text-base truncate max-w-[100px] sm:max-w-[150px]" title={senderTeam?.name || "Challenger"}>{senderTeam?.name || "Challenger"}</p>
                                                <p className="text-4xl font-bold my-1 sm:my-2">{challenge.matchResults?.senderScore ?? "-"}</p>
                                                {challenge.matchResults?.winner === 'SENDER' && (<Badge variant="default" className="bg-green-600 hover:bg-green-700 text-xs">Winner</Badge>)}
                                            </div>
                                            <div className="text-center px-1 sm:px-2"><p className="text-xl font-semibold text-muted-foreground">VS</p></div>
                                            <div className="text-center px-2 sm:px-4">
                                                {/* Use receiverTeam as the opponent here */}
                                                <p className="font-semibold text-sm sm:text-base truncate max-w-[100px] sm:max-w-[150px]" title={receiverTeam?.name || "Opponent"}>{receiverTeam?.name || "Opponent"}</p>
                                                <p className="text-4xl font-bold my-1 sm:my-2">{challenge.matchResults?.receiverScore ?? "-"}</p>
                                                {challenge.matchResults?.winner === 'RECEIVER' && (<Badge variant="default" className="bg-green-600 hover:bg-green-700 text-xs">Winner</Badge>)}
                                                {challenge.matchResults?.winner === 'DRAW' && (<Badge variant="secondary" className="text-xs">Draw</Badge>)}
                                            </div>
                                        </div>
                                        {challenge.matchResults?.notes && (
                                            <div className="mt-4 p-3 bg-muted dark:bg-muted/30 rounded-md border dark:border-muted/50">
                                                <h4 className="text-sm font-medium mb-1 text-foreground">Match Notes</h4>
                                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{challenge.matchResults.notes}</p>
                                            </div>
                                        )}
                                        {challenge.matchResults?.completedAt && isValid(new Date(challenge.matchResults.completedAt)) && (
                                            <p className="text-xs text-muted-foreground text-right mt-3"> Completed: {format(new Date(challenge.matchResults.completedAt), "PPP 'at' p")} </p>
                                        )}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Acceptance Requests Section */}
                            {challenge.isOpen && challenge.status === 'OPEN' && permissions.canManageRequests && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2"><ListChecks className="h-5 w-5" /> Acceptance Requests ({acceptanceRequests?.filter(r => r.status === 'PENDING').length ?? 0} Pending)</CardTitle>
                                        <CardDescription>Teams requesting to accept this open challenge. Approve one to start the match.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {loading && !acceptanceRequests && <Skeleton className="h-20 w-full" />}
                                        {!loading && (!acceptanceRequests || acceptanceRequests.length === 0) && (<p className="text-sm text-muted-foreground text-center py-4">No acceptance requests found.</p>)}
                                        {acceptanceRequests && acceptanceRequests.length > 0 && (
                                            <div className="space-y-3">
                                                {acceptanceRequests.map((req) => (
                                                    <div key={req.id} className="flex items-center justify-between gap-3 p-3 border rounded-lg bg-background">
                                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                                            {/* Assumes req.requestingTeam: Team exists */}
                                                            <TeamAvatar team={req.requestingTeam} />
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-medium truncate" title={req.requestingTeam?.name || `Team ID: ${req.requestingTeamId}`}>{req.requestingTeam?.name || <span className="italic">Unknown Team</span>}</p>
                                                                <p className="text-xs text-muted-foreground">Requested: {isValid(new Date(req.createdAt)) ? formatDistanceToNowStrict(new Date(req.createdAt), { addSuffix: true }) : 'N/A'}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 flex-shrink-0">
                                                            {req.status === 'PENDING' && (
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button size="sm" variant="ghost" className="text-green-600 hover:bg-green-100 hover:text-green-700 p-1 h-auto" onClick={() => handleApproveRequest(req.id)} disabled={actionLoading}>
                                                                            <Check className={cn("h-5 w-5", actionLoading && selectedRequestId === req.id && "animate-spin")} />
                                                                        </Button>
                                                                    </TooltipTrigger> <TooltipContent>Approve Request</TooltipContent>
                                                                </Tooltip>
                                                            )}
                                                            {req.status === 'APPROVED' && <Badge variant="success" className="text-xs">Approved</Badge>}
                                                            {req.status === 'DECLINED' && <Badge variant="destructive" className="text-xs">Declined</Badge>}
                                                            {req.status === 'WITHDRAWN' && <Badge variant="outline" className="text-xs">Withdrawn</Badge>}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}
                        </div> {/* End Left Column */}

                        {/* Right Column - Teams & Actions */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader> <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Participants</CardTitle> </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Challenger Team */}
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5"><Users className="h-4 w-4" /> Challenger Team</h4>
                                        <div className="flex items-center gap-3 p-3 bg-muted/30 dark:bg-muted/10 rounded-lg border dark:border-muted/30">
                                            <TeamAvatar team={senderTeam} />
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium truncate" title={senderTeam?.name || "Unknown Team"}> {loading && !senderTeam ? <Skeleton className="h-5 w-32" /> : senderTeam?.name || <span className="italic text-muted-foreground">Loading...</span>} </div>
                                            </div>
                                            {permissions.isSenderMember && (
                                                <Tooltip> <TooltipTrigger><Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary shrink-0 px-1.5 py-0.5"><User className="h-3 w-3" /></Badge></TooltipTrigger> <TooltipContent>You are in this team</TooltipContent> </Tooltip>
                                            )}
                                        </div>
                                    </div>
                                    <Separator />
                                    {/* Opponent Team / Accept Actions */}
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5"><Users className="h-4 w-4" /> Opponent Team</h4>
                                        {/* Case 1: Accepted/Completed - Show Receiver/Acceptor Team */}
                                        {['ACCEPTED', 'COMPLETED'].includes(challenge.status) && receiverTeam ? (
                                            <div className="flex items-center gap-3 p-3 bg-muted/30 dark:bg-muted/10 rounded-lg border dark:border-muted/30">
                                                <TeamAvatar team={receiverTeam} />
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium truncate" title={receiverTeam.name}> {receiverTeam.name} </div>
                                                </div>
                                                {permissions.isAcceptorMember && (
                                                    <Tooltip> <TooltipTrigger><Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary shrink-0 px-1.5 py-0.5"><User className="h-3 w-3" /></Badge></TooltipTrigger> <TooltipContent>You accepted with this team</TooltipContent> </Tooltip>
                                                )}
                                            </div>
                                        /* Case 2: Specific Challenge Pending - Show Accept/Decline for Receiver */
                                        ) : challenge.status === 'PENDING' && challenge.receiverTeamId && !challenge.isOpen ? (
                                            <div className="p-4 bg-muted/30 dark:bg-muted/10 rounded-lg border border-dashed dark:border-muted/30 space-y-3 text-center">
                                                <p className="text-sm text-muted-foreground"> Waiting for {receiverTeam ? `Team "${receiverTeam.name}"` : "designated team"} to respond. </p>
                                                {permissions.canAcceptDirectly && (
                                                    <div className="flex flex-col sm:flex-row gap-2">
                                                        <Button onClick={() => handleOpenTeamModal('accept')} disabled={actionLoading} className="flex-1"> <CheckCircle className={cn("mr-2 h-4 w-4", actionLoading && "animate-spin")} /> {actionLoading ? "Accepting..." : "Accept Challenge"} </Button>
                                                        <Button variant="outline" onClick={handleDecline} disabled={actionLoading} className="flex-1"> <XCircle className={cn("mr-2 h-4 w-4", actionLoading && "animate-spin")} /> {actionLoading ? "Declining..." : "Decline"} </Button>
                                                    </div>
                                                )}
                                                {permissions.isSenderMember && (<p className="text-xs text-blue-600">You sent this specific challenge.</p>)}
                                            </div>
                                        /* Case 3: Open Challenge Pending - Show Request Actions */
                                        ) : challenge.status === 'OPEN' ? (
                                            <div className="p-4 bg-muted/30 dark:bg-muted/10 rounded-lg border border-dashed dark:border-muted/30 space-y-3 text-center">
                                                <p className="text-sm text-muted-foreground"> This is an open challenge. </p>
                                                {permissions.canRequestAccept && ( <Button onClick={() => handleOpenTeamModal('request')} disabled={actionLoading} className="w-full"> <Send className={cn("mr-2 h-4 w-4", actionLoading && "animate-spin")} /> {actionLoading ? "Sending..." : "Request to Accept"} </Button> )}
                                                {permissions.canWithdrawRequest && ( <Button variant="outline" onClick={handleWithdrawRequest} disabled={actionLoading} className="w-full border-amber-500 text-amber-600 hover:bg-amber-50"> <MinusCircle className={cn("mr-2 h-4 w-4", actionLoading && "animate-spin")} /> {actionLoading ? "Withdrawing..." : "Withdraw My Request"} </Button> )}
                                                {permissions.isSenderMember && (<p className="text-xs text-blue-600">{permissions.canManageRequests && acceptanceRequests && acceptanceRequests.length > 0 ? "Review acceptance requests below." : "Waiting for teams to request acceptance."}</p> )}
                                                {!user && (<p className="text-xs text-destructive">Login to interact.</p>)}
                                                {user && !permissions.canRequestAccept && !permissions.isSenderMember && !permissions.userHasPendingRequest && (!userTeams || userTeams.length === 0) && (<p className="text-xs text-destructive">Join a team to accept challenges.</p>)}
                                                {user && !permissions.isSenderMember && permissions.userHasPendingRequest && (<p className="text-xs text-green-600">Your request to accept is pending.</p>)}
                                            </div>
                                        /* Case 4: Other Statuses (Declined, Expired, Cancelled) */
                                        ) : (
                                            <div className="p-4 bg-muted/50 dark:bg-muted/20 rounded-lg border border-muted dark:border-muted/50 text-center">
                                                <p className="text-sm font-medium text-muted-foreground">
                                                    {challenge.status === "DECLINED" && "Challenge was declined."}
                                                    {challenge.status === "EXPIRED" && "Challenge expired."}
                                                    {challenge.status === "CANCELLED" && "Challenge was withdrawn/cancelled."}
                                                    {/* Fallback for unexpected states */}
                                                    {challenge.status === "PENDING" && !challenge.receiverTeamId && !challenge.isOpen && "Challenge is pending."}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div> {/* End Right Column */}
                    </div> {/* --- End Main Content Grid --- */}
                </div> {/* --- End Main Container --- */}

                {/* Confirmation Dialog */}
                <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader> <AlertDialogTitle>{confirmDialogContent.title}</AlertDialogTitle> <AlertDialogDescription>{confirmDialogContent.description}</AlertDialogDescription> </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => { setConfirmAction(null); setSelectedRequestId(null); }} disabled={actionLoading}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleConfirm} disabled={actionLoading} className={cn(confirmDialogContent.title.toLowerCase().includes("delete") && "bg-destructive hover:bg-destructive/90")}> {actionLoading ? "Processing..." : "Confirm"} </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Team Selection Modal */}
                {challenge && userTeams && (
                    <TeamSelectionModal
                        isOpen={isTeamModalOpen}
                        onClose={() => setIsTeamModalOpen(false)}
                        onSelectTeam={handleSelectTeam}
                        teams={userTeams || []}
                        isLoading={actionLoading}
                        // Pass relevant details from the challenge
                        gameId={challenge.sport ?? ""}
                        challengeLevel={challenge?.level}
                    />
                )}
            </TooltipProvider>
        </div>
    );
}