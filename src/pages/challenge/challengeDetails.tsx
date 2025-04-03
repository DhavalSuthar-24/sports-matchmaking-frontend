// src/pages/ChallengeDetail.tsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";

// Custom Hooks
import { useChallengePermissions } from "@/hooks/useChallengePermissions"; // Adjust path
import { useChallengeExpiryTimer } from "@/hooks/useChallengeExpiryTimer"; // Adjust path
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog"; // Adjust path

// UI Components (adjust paths as needed)
import TeamSelectionModal from "./TeamSelectionModal"; // Assuming path is correct relative to pages
import ChallengeHeader from "./components/ChallengeHeader";
import ChallengeInfoCard from "./components/ChallengeInfoCard";
import MatchResultsCard from "./components/MatchResultsCard";
import ChallengeParticipantsCard from "./components/ChallengeParticipantsCard";
import AcceptanceRequestsCard from "./components/AcceptanceRequestsCard";
import ConfirmationDialog from "./components/ConfirmationDialog"; // Assuming path is correct relative to pages
import LoadingState from "./components/LoadingState"; // Assuming path is correct relative to pages
import ErrorState from "./components/ErrorState"; // Assuming path is correct relative to pages
import NotFoundState from "./components/NotFoundState"; // Assuming path is correct relative to pages

// Redux Imports (adjust paths as needed)
import {
    getChallenge, deleteChallenge, acceptTeamChallenge, declineChallenge,
    getChallengeSenderTeam, getChallengeReceiverTeam, withdrawTeamChallenge,
    requestAcceptOpenChallenge, getOpenChallengeAcceptanceRequests,
    approveChallengeAcceptanceRequest, withdrawChallengeAcceptanceRequest,
    // Define the types for the thunk payloads if not already exported
    // e.g., import type { RequestAcceptOpenChallengePayload, AcceptTeamChallengePayload } from '@/redux/features/challenge/challengeThunks';
} from "@/redux/features/challenge/challengeThunks"; // Adjust path
import { clearCurrentChallenge } from "@/redux/features/challenge/challengeSlice"; // Adjust path
import type { AppDispatch, RootState } from "@/redux/store"; // Adjust path
import type { Team as CommonTeamType } from "@/redux/features/challenge/common.types"; // Import the specific Team type expected by hooks/components
import type { Team as SourceTeamType } from "@/redux/features/teams/teamTypes"; // Import the Team type from the source slice
import type { Challenge , RequestAcceptOpenChallengeRequest, ChallengeAcceptanceRequest } from "@/redux/features/challenge/challengeTypes"; // Import challenge types


// *** Type Assumption: Ensure your Challenge type includes 'sport' and optionally 'level' ***
// interface Challenge {
//   // ... other properties
//   id: string;
//   senderTeamId: string;
//   receiverTeamId?: string | null; // Optional for OPEN challenges
//   firstAcceptorTeamId?: string | null; // Set when an OPEN challenge is accepted
//   status: 'PENDING' | 'OPEN' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED' | 'COMPLETED' | 'CONFIRMED'; // Example statuses
//   expiresAt: string; // ISO Date string
//   createdAt: string; // ISO Date string
//   sport: string; // Assumed to exist based on Solution 6
//   level?: string; // Assumed to optionally exist based on Solution 6
//   // ... any other relevant fields (e.g., matchId, score)
// }

export default function ChallengeDetail() {
    const { challengeId } = useParams<{ challengeId: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>(); // Ensure AppDispatch is correctly typed to handle thunks

    // --- Redux State Selection ---
    const {
        currentChallenge: challenge,
        senderTeam,
        receiverTeam, // This will hold the fetched opponent (original receiver or acceptor)
        acceptanceRequests,
        // Solution 1: Use the single loading state from challengeSlice
        loading: challengeLoading,
        error: challengeError,
    } = useSelector((state: RootState) => state.challenges);

    const { user } = useSelector((state: RootState) => state.auth);
    const userTeamsSource = useSelector((state: RootState) => state.users.teams);

    // Solution 2: Type Assertion Workaround for Team[] mismatch
    // !! IMPORTANT: Best practice is to unify the Team type definitions !!
    const userTeams = userTeamsSource as CommonTeamType[] | null;

    // --- Local State ---
    const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
    const [modalActionType, setModalActionType] = useState<'accept' | 'request'>('accept');
    // Solution 1: Local state for specific action loading (e.g., approving one request)
    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

    // --- Custom Hooks ---
    // Solution 5 & 2: Pass potentially null challenge/userTeams initially, hook handles nulls
    const permissions = useChallengePermissions({
        challenge,
        user,
        userTeams: userTeams, // Pass the correctly typed (or asserted) teams
        acceptanceRequests
    });

    // Solution 5: Use optional chaining for potentially null challenge properties
    const { timeRemaining, expiryProgress } = useChallengeExpiryTimer({
        status: challenge?.status,
        expiresAt: challenge?.expiresAt,
        createdAt: challenge?.createdAt,
    });
    const confirmDialog = useConfirmationDialog();

    // --- Data Fetching Effects ---
    useEffect(() => {
        if (challengeId) {
            // Clear previous data before fetching new
            dispatch(clearCurrentChallenge());
            dispatch(getChallenge(challengeId));
        }
        // Cleanup on unmount
        return () => {
            dispatch(clearCurrentChallenge());
        };
    }, [dispatch, challengeId]);

    useEffect(() => {
        // Fetch related data only if challengeId and the main challenge exist
        if (challengeId && challenge) {
            // Fetch sender if needed and not already loaded or different
            if (challenge.senderTeamId && (!senderTeam || senderTeam.id !== challenge.senderTeamId)) {
                dispatch(getChallengeSenderTeam(challengeId));
            }

            // Determine the ID of the opposing team (could be receiver or the one who accepted)
            const opponentTeamId = challenge.firstAcceptorTeamId || challenge.receiverTeamId;

            // Fetch opponent if needed and not already loaded correctly
            // Check if opponentTeamId exists and if receiverTeam state doesn't match
            if (opponentTeamId && (!receiverTeam || receiverTeam.id !== opponentTeamId)) {
                 // This thunk needs logic to fetch the correct opponent based on challenge status/fields
                 dispatch(getChallengeReceiverTeam(challengeId));
            } else if (!opponentTeamId && receiverTeam) {
                // If there is no opponent ID (e.g., OPEN challenge not yet accepted)
                // but we have receiverTeam data from a previous state, clear it (or handle appropriately)
                // This case might need refinement based on specific app logic.
                // For now, we assume the `getChallengeReceiverTeam` handles fetching the correct data or null.
            }


            // Solution 3: Use status check instead of non-existent 'isOpen'
            if (challenge.status === 'OPEN' && challengeId) {
                // Fetch open challenge acceptance requests if the challenge is OPEN
                // Consider adding a check if requests are already loading/fetched if needed
                dispatch(getOpenChallengeAcceptanceRequests(challengeId));
            }
        }
    // Ensure dependencies cover all conditions for fetching related data
    }, [dispatch, challengeId, challenge, senderTeam, receiverTeam]); // Added challenge dependency

    // --- Action Handlers (using useCallback for stability) ---

    const handleDelete = useCallback(() => {
        if (!challengeId) return;
        confirmDialog.show(
            "Confirm Deletion",
            "This action cannot be undone. Are you sure you want to permanently delete this challenge?",
            async () => {
                const resultAction = await dispatch(deleteChallenge(challengeId));
                if (deleteChallenge.fulfilled.match(resultAction)) {
                    toast.success("Challenge deleted successfully");
                    navigate("/challenges"); // Navigate away after successful deletion
                } else {
                    const message = (resultAction.payload as { message: string })?.message || "Failed to delete challenge";
                    toast.error(`Deletion failed: ${message}`);
                    // Keep dialog open on failure? Or close it? Assuming close:
                    confirmDialog.setIsOpen(false);
                }
            }
        );
    }, [dispatch, challengeId, navigate, confirmDialog]);

    const handleWithdraw = useCallback(() => {
        if (!challengeId) return;
        confirmDialog.show(
            "Confirm Withdrawal",
            "Are you sure you want to withdraw this challenge? It will be cancelled.",
            async () => {
                const resultAction = await dispatch(withdrawTeamChallenge(challengeId));
                if (withdrawTeamChallenge.fulfilled.match(resultAction)) {
                    toast.success("Challenge withdrawn successfully");
                    // No explicit re-fetch needed if slice updates state correctly
                    // The slice should update the challenge status, triggering re-render
                } else {
                    const message = (resultAction.payload as { message: string })?.message || "Failed to withdraw challenge";
                    toast.error(`Withdrawal failed: ${message}`);
                    confirmDialog.setIsOpen(false);
                }
            }
        );
    }, [dispatch, challengeId, confirmDialog]);

    const handleDecline = useCallback(() => {
        if (!challengeId) return;
        confirmDialog.show(
            "Confirm Decline",
            "Are you sure you want to decline this challenge?",
            async () => {
                const resultAction = await dispatch(declineChallenge(challengeId));
                if (declineChallenge.fulfilled.match(resultAction)) {
                    toast.success("Challenge declined");
                    // Slice should update challenge status, triggering re-render
                } else {
                    const message = (resultAction.payload as { message: string })?.message || "Failed to decline challenge";
                    toast.error(`Decline failed: ${message}`);
                    confirmDialog.setIsOpen(false);
                }
            }
        );
    }, [dispatch, challengeId, confirmDialog]);

    const handleOpenTeamModal = useCallback((type: 'accept' | 'request') => {
        if (!user) { toast.error("You must be logged in."); return; }
        // Solution 2: Check the asserted userTeams
        if (!userTeams || userTeams.length === 0) { toast.error("You need to be part of a team first."); return; }
        setModalActionType(type);
        setIsTeamModalOpen(true);
    }, [user, userTeams]);

    const handleSelectTeam = useCallback(async (teamId: string) => {
        // Solution 5: Ensure challenge is not null here
        if (!challengeId || !user || !challenge) return;
        setIsTeamModalOpen(false);

        const isRequest = modalActionType === 'request';
        // Solution 4: Dispatching logic - ensure types match thunk expectations
        const actionThunk = isRequest ? requestAcceptOpenChallenge : acceptTeamChallenge;

        // Adjust payload structure based on thunk expectations
        // Ensure RequestAcceptOpenChallengeRequest matches the thunk's expected 'data' type
        const payload = isRequest
            ? { challengeId, data: { acceptingTeamId: teamId } as RequestAcceptOpenChallengeRequest }
            : { challengeId, data: { teamId } }; // Assuming acceptTeamChallenge expects { teamId } in data

        const baseMessage = isRequest ? "acceptance request" : "challenge";
        const successMessage = isRequest ? `Request to accept sent` : `Challenge accepted successfully`;
        const failureMessage = `Failed to ${isRequest ? 'send request for' : 'accept'} ${baseMessage}`;

        try {
            // Type assertion on payload if necessary, but preferably fix thunk types/arguments
            // e.g., await dispatch(actionThunk(payload as CorrectPayloadType));
            const resultAction = await dispatch(actionThunk(payload));

            // Check specific fulfilled action
            if ((isRequest && requestAcceptOpenChallenge.fulfilled.match(resultAction)) ||
                (!isRequest && acceptTeamChallenge.fulfilled.match(resultAction)))
            {
                toast.success(successMessage);
                 // Slice should update challenge/requests state, triggering useEffect/re-render
            } else {
                // Handle rejected case
                const message = (resultAction.payload as { message: string })?.message || failureMessage;
                toast.error(`${failureMessage}: ${message}`);
            }
        } catch (err: any) {
            console.error(`Error during ${modalActionType} action:`, err);
            toast.error(`An unexpected error occurred: ${err.message || failureMessage}`);
        }
    }, [dispatch, challengeId, user, modalActionType, challenge]); // Added challenge dependency

    const handleApproveRequest = useCallback(async (requestId: string) => {
        if (!challengeId || !requestId) return;
        setSelectedRequestId(requestId); // Set loading state for *this* request ID

        confirmDialog.show(
            "Approve Acceptance Request",
            "Approving this request will accept the challenge with this team and finalize it. Continue?",
            async () => {
                try {
                    // Payload might be empty or require specific fields based on thunk
                    // Assuming it requires challengeId, requestId, and potentially empty data object
                    const resultAction = await dispatch(
                        approveChallengeAcceptanceRequest({ challengeId, requestId, data: {} })
                    );

                    if (approveChallengeAcceptanceRequest.fulfilled.match(resultAction)) {
                        toast.success("Acceptance request approved successfully!");
                        // Slice should update challenge status and filter acceptanceRequests, triggering re-render
                        // Close dialog on success
                        confirmDialog.setIsOpen(false);
                    } else {
                        const message = (resultAction.payload as { message: string })?.message || "Failed to approve request";
                        toast.error(`Approval failed: ${message}`);
                        confirmDialog.setIsOpen(false); // Close dialog on error
                    }
                } finally {
                    setSelectedRequestId(null); // Reset loading indicator *after* action completes or fails
                }
            },
             () => {
                 setSelectedRequestId(null); // Also reset loading if user cancels dialog via cancel button/overlay click
                 // confirmDialog hook handles setting isOpen to false on cancel
             }
        );

    }, [dispatch, challengeId, confirmDialog]);

     const handleWithdrawRequest = useCallback(async () => {
        // Get the ID of the request made by the current user's teams
        const requestId = permissions.userPendingRequestId;
        if (!requestId || !challengeId) return;

        confirmDialog.show(
            "Withdraw Acceptance Request",
            "Are you sure you want to withdraw your request to accept this challenge?",
            async () => {
                // Assuming the thunk only needs the request ID
                // Note: Slice reducer updates 'teamChallengeRequests', but UI shows 'acceptanceRequests'.
                // This might be a mismatch. Assuming the action should affect the requests shown.
                // Ideally, the slice reducer for withdrawChallengeAcceptanceRequest.fulfilled
                // should filter state.acceptanceRequests if that's what this action targets.
                const resultAction = await dispatch(withdrawChallengeAcceptanceRequest(requestId));
                if (withdrawChallengeAcceptanceRequest.fulfilled.match(resultAction)) {
                    toast.success("Acceptance request withdrawn");
                    // If the slice *doesn't* update acceptanceRequests, you might need to manually refetch:
                    // dispatch(getOpenChallengeAcceptanceRequests(challengeId));
                    // However, it's better to fix the slice reducer.
                } else {
                    const message = (resultAction.payload as { message: string })?.message || "Failed to withdraw request";
                    toast.error(`Withdrawal failed: ${message}`);
                    confirmDialog.setIsOpen(false);
                }
            }
        );
    }, [dispatch, challengeId, permissions.userPendingRequestId, confirmDialog]);

    // --- Render Logic ---

    // Initial loading state (before challenge is fetched for the first time)
    if (challengeLoading && !challenge) {
        return <LoadingState />;
    }

    // Error state (if fetching failed and we have no challenge data)
    if (challengeError && !challenge) {
        // Ensure ErrorState can handle potential non-string errors
        const errorMessage = typeof challengeError === 'string' ? challengeError : "An unknown error occurred";
        return <ErrorState error={errorMessage} />;
    }

    // Solution 5: Explicit check for challenge not found after loading/error states
    if (!challenge) {
        // This covers the case where loading finished, no error, but challenge is null (e.g., 404 Not Found)
        return <NotFoundState />;
    }

    // --- Challenge is guaranteed to be non-null from here ---

    // Determine if related data is loading
    const isSenderLoading = challengeLoading && !senderTeam && !!challenge.senderTeamId;
    const opponentTeamId = challenge.firstAcceptorTeamId || challenge.receiverTeamId;
    const isReceiverLoading = challengeLoading && !receiverTeam && !!opponentTeamId;
    // Check if requests are loading (only relevant if challenge is OPEN)
    // Using challengeLoading as a proxy, could be refined if requests had their own loading flag
    const isRequestsLoading = challenge.status === 'OPEN' && challengeLoading;

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <TooltipProvider delayDuration={100}>
                <div className="space-y-6">
                    {/* Pass non-nullable challenge */}
                    <ChallengeHeader
                        challenge={challenge}
                        canWithdrawChallenge={permissions.canWithdrawChallenge}
                        canModify={permissions.canModify}
                        // Solution 1: Pass general loading state for actions on header
                        actionLoading={challengeLoading && !isSenderLoading && !isReceiverLoading} // Action buttons disabled if main data or teams still loading
                        onWithdraw={handleWithdraw}
                        onDelete={handleDelete}
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-6">
                            <ChallengeInfoCard
                                challenge={challenge} // Non-null here
                                timeRemaining={timeRemaining}
                                expiryProgress={expiryProgress}
                            />

                            <MatchResultsCard
                                challenge={challenge} // Non-null here
                                senderTeam={senderTeam}
                                receiverTeam={receiverTeam} // This is the opponent team
                                isSenderLoading={isSenderLoading}
                                isReceiverLoading={isReceiverLoading}
                            />

                            {/* Solution 3: Check status === 'OPEN' & permissions */}
                            {challenge.status === 'OPEN' && permissions.canManageRequests && (
                                <AcceptanceRequestsCard
                                    requests={acceptanceRequests}
                                    // Solution 1: Use proxy loading state or a dedicated one if available
                                    isLoading={isRequestsLoading}
                                    // Action loading is true only if we are acting on a *specific* request
                                    actionLoading={!!selectedRequestId}
                                    selectedRequestId={selectedRequestId} // Pass the ID being acted upon
                                    onApprove={handleApproveRequest}
                                    // Assuming no "Decline Request" button here, handled by challenge creator approving one.
                                />
                            )}
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            <ChallengeParticipantsCard
                                challenge={challenge} // Non-null here
                                senderTeam={senderTeam}
                                receiverTeam={receiverTeam} // Opponent team
                                permissions={permissions}
                                // Solution 1: Disable buttons if any relevant action/fetch is in progress
                                actionLoading={challengeLoading || !!selectedRequestId}
                                onOpenTeamModal={handleOpenTeamModal}
                                onDecline={handleDecline}
                                onWithdrawRequest={handleWithdrawRequest}
                                isSenderLoading={isSenderLoading}
                                isReceiverLoading={isReceiverLoading}
                                loggedInUser={user}
                                // Solution 2: Pass the asserted userTeams
                                userTeams={userTeams}
                                acceptanceRequests={acceptanceRequests} // Pass requests for permission checks inside
                            />
                        </div>
                    </div>
                </div>

                {/* Modals and Dialogs */}
                <ConfirmationDialog
                    isOpen={confirmDialog.isOpen}
                    onOpenChange={(isOpen) => {
                        if (!isOpen) {
                            // Reset specific loading state if dialog is closed without confirming/cancelling via buttons
                           setSelectedRequestId(null);
                           confirmDialog.handleCancel(); // Ensure the callback state is cleared
                        } else {
                           confirmDialog.setIsOpen(true);
                        }
                    }}
                    title={confirmDialog.content.title}
                    description={confirmDialog.content.description}
                    onConfirm={confirmDialog.handleConfirm}
                    onCancel={() => {
                         setSelectedRequestId(null); // Reset loading if cancelled via button
                         confirmDialog.handleCancel();
                     }}
                    // Solution 1: Use general loading state for confirm button, or refine if needed
                    // Could also use selectedRequestId if only approval uses this dialog currently
                    isActionLoading={challengeLoading || !!selectedRequestId}
                />

                {/* Render Modal only if needed data is available */}
                {/* Solution 6: Pass assumed challenge.sport and challenge.level */}
                {/* Ensure teams are loaded and challenge exists */}
                {challenge && userTeams && (
                    <TeamSelectionModal
                        isOpen={isTeamModalOpen}
                        onClose={() => setIsTeamModalOpen(false)}
                        onSelectTeam={handleSelectTeam}
                        teams={userTeams} // Pass asserted teams
                        // Solution 1: Pass general challenge loading for modal actions
                        isLoading={challengeLoading}
                        // Solution 6: Pass sport/level - Requires Challenge type and API to provide these
                        // Ensure 'challenge.sport' is guaranteed to be a string if not optional
                        gameId={challenge.sport}
                        // Use optional chaining for level if it might not exist
                        challengeLevel={challenge.level}
                    />
                )}
            </TooltipProvider>
        </div>
    );
}