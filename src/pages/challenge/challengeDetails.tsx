// src/pages/ChallengeDetail.tsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { TooltipProvider } from "@/components/ui/tooltip";


import { useChallengePermissions } from "@/hooks/useChallengePermissions"; // Adjust path
import { useChallengeExpiryTimer } from "@/hooks/useChallengeExpiryTimer"; // Adjust path
import { useConfirmationDialog } from "@/hooks/useConfirmationDialog"; // Adjust path


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

import {
    getChallenge, deleteChallenge, acceptTeamChallenge, declineChallenge,
    getChallengeSenderTeam, getChallengeReceiverTeam, withdrawTeamChallenge,
    requestAcceptOpenChallenge, getOpenChallengeAcceptanceRequests,
    approveChallengeAcceptanceRequest, withdrawChallengeAcceptanceRequest,
 
} from "@/redux/features/challenge/challengeThunks"; // Adjust path
import { clearCurrentChallenge } from "@/redux/features/challenge/challengeSlice"; // Adjust path
import type { AppDispatch, RootState } from "@/redux/store"; // Adjust path
import type { Team as CommonTeamType } from "@/redux/features/challenge/common.types"; // Import the specific Team type expected by hooks/components
// import type { Team as SourceTeamType } from "@/redux/features/teams/teamTypes"; // Import the Team type from the source slice
import type {  RequestAcceptOpenChallengeRequest } from "@/redux/features/challenge/challengeTypes"; // Import challenge types



export default function ChallengeDetail() {
    const { challengeId } = useParams<{ challengeId: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const {
        currentChallenge: challenge,
        senderTeam,
        receiverTeam, 
        acceptanceRequests,
        loading: challengeLoading,
        error: challengeError,
    } = useSelector((state: RootState) => state.challenges);

    const { user } = useSelector((state: RootState) => state.auth);
    const userTeamsSource = useSelector((state: RootState) => state.users.teams);


    const userTeams = userTeamsSource as CommonTeamType[] | null;


    const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
    const [modalActionType, setModalActionType] = useState<'accept' | 'request'>('accept');

    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);


    const permissions = useChallengePermissions({
        challenge,
        user,
        userTeams: userTeams, 
        acceptanceRequests
    });


    const { timeRemaining, expiryProgress } = useChallengeExpiryTimer({
        status: challenge?.status,
        expiresAt: challenge?.expiresAt,
        createdAt: challenge?.createdAt,
    });
    const confirmDialog = useConfirmationDialog();


    useEffect(() => {
        if (challengeId) {
      
            dispatch(clearCurrentChallenge());
            dispatch(getChallenge(challengeId));
        }

        return () => {
            dispatch(clearCurrentChallenge());
        };
    }, [dispatch, challengeId]);

    useEffect(() => {
        if (challengeId && challenge) {
            if (challenge.senderTeamId && (!senderTeam || senderTeam.id !== challenge.senderTeamId)) {
                dispatch(getChallengeSenderTeam(challengeId));
            }


            const opponentTeamId = challenge.firstAcceptorTeamId || challenge.receiverTeamId;



            if (opponentTeamId && (!receiverTeam || receiverTeam.id !== opponentTeamId)) {
                 dispatch(getChallengeReceiverTeam(challengeId));
            } else if (!opponentTeamId && receiverTeam) {
                // If there is no opponent ID (e.g., OPEN challenge not yet accepted)
                // but we have receiverTeam data from a previous state, clear it (or handle appropriately)
                // This case might need refinement based on specific app logic.
                // For now, we assume the `getChallengeReceiverTeam` handles fetching the correct data or null.
            }



            if (challenge.status === 'OPEN' && challengeId) {
         
                dispatch(getOpenChallengeAcceptanceRequests(challengeId));
            }
        }

    }, [dispatch, challengeId, challenge, senderTeam, receiverTeam]);


    const handleDelete = useCallback(() => {
        if (!challengeId) return;
        confirmDialog.show(
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

        if (!userTeams || userTeams.length === 0) { toast.error("You need to be part of a team first."); return; }
        setModalActionType(type);
        setIsTeamModalOpen(true);
    }, [user, userTeams]);

    const handleSelectTeam = useCallback(async (teamId: string) => {

        if (!challengeId || !user || !challenge) return;
        setIsTeamModalOpen(false);

        const isRequest = modalActionType === 'request';

        const actionThunk = isRequest ? requestAcceptOpenChallenge : acceptTeamChallenge;


        const payload = isRequest
            ? { challengeId, data: { acceptingTeamId: teamId } as unknown as RequestAcceptOpenChallengeRequest }
            : { challengeId, data: { teamId } }; 

        const baseMessage = isRequest ? "acceptance request" : "challenge";
        const successMessage = isRequest ? `Request to accept sent` : `Challenge accepted successfully`;
        const failureMessage = `Failed to ${isRequest ? 'send request for' : 'accept'} ${baseMessage}`;

        try {

            const resultAction = await dispatch(actionThunk(payload));


            if ((isRequest && requestAcceptOpenChallenge.fulfilled.match(resultAction)) ||
                (!isRequest && acceptTeamChallenge.fulfilled.match(resultAction)))
            {
                toast.success(successMessage);
  
            } else {

                const message = (resultAction.payload as { message: string })?.message || failureMessage;
                toast.error(`${failureMessage}: ${message}`);
            }
        } catch (err: any) {
            console.error(`Error during ${modalActionType} action:`, err);
            toast.error(`An unexpected error occurred: ${err.message || failureMessage}`);
        }
    }, [dispatch, challengeId, user, modalActionType, challenge]); // Added challenge dependency

    const handleApproveRequest = useCallback((requestId: string) => {
        if (!challengeId || !requestId) return;
    
        confirmDialog.show(
            "Approve Acceptance Request",
            "Approving this request will accept the challenge with this team and finalize it. Continue?",
            async () => {
                try {
                    setSelectedRequestId(requestId); // move this here
    
                    const resultAction = await dispatch(
                        approveChallengeAcceptanceRequest({ challengeId, requestId, data: {} })
                    );
    
                    if (approveChallengeAcceptanceRequest.fulfilled.match(resultAction)) {
                        toast.success("Acceptance request approved successfully!");
                    } else {
                        const message = (resultAction.payload as { message: string })?.message || "Failed to approve request";
                        toast.error(`Approval failed: ${message}`);
                    }
                } finally {
                    setSelectedRequestId(null);
                    confirmDialog.setIsOpen(false);
                }
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

                const resultAction = await dispatch(withdrawChallengeAcceptanceRequest(requestId));
                if (withdrawChallengeAcceptanceRequest.fulfilled.match(resultAction)) {
                    toast.success("Acceptance request withdrawn");
              
                } else {
                    const message = (resultAction.payload as { message: string })?.message || "Failed to withdraw request";
                    toast.error(`Withdrawal failed: ${message}`);
                    confirmDialog.setIsOpen(false);
                }
            }
        );
    }, [dispatch, challengeId, permissions.userPendingRequestId, confirmDialog]);


    if (challengeLoading && !challenge) {
        return <LoadingState />;
    }

    if (challengeError && !challenge) {
   
        const errorMessage = typeof challengeError === 'string' ? challengeError : "An unknown error occurred";
        return <ErrorState error={errorMessage} />;
    }


    if (!challenge) {
        return <NotFoundState />;
    }


    const isSenderLoading = challengeLoading && !senderTeam && !!challenge.senderTeamId;
    const opponentTeamId = challenge.firstAcceptorTeamId || challenge.receiverTeamId;
    const isReceiverLoading = challengeLoading && !receiverTeam && !!opponentTeamId;
  
    const isRequestsLoading = challenge.status === 'OPEN' && challengeLoading;
    console.log(challenge,"cccccccccccccccccccccccccccccccccccccccccccccccccccc")
    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <TooltipProvider delayDuration={100}>
                <div className="space-y-6">
   
                    <ChallengeHeader
                        challenge={challenge}
                        canWithdrawChallenge={permissions.canWithdrawChallenge}
                        canModify={permissions.canModify}
 
                        actionLoading={challengeLoading && !isSenderLoading && !isReceiverLoading} // Action buttons disabled if main data or teams still loading
                        onWithdraw={handleWithdraw}
                        onDelete={handleDelete}
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        <div className="lg:col-span-2 space-y-6">
                            <ChallengeInfoCard
                                challenge={challenge}
                                timeRemaining={timeRemaining}
                                expiryProgress={expiryProgress}
                            />

                            <MatchResultsCard
                                challenge={challenge} // Non-null here
                                senderTeam={senderTeam}
                                receiverTeam={receiverTeam} // This is the opponent team
                      
                            />


                            {challenge.status === 'OPEN' && permissions.canManageRequests && (
                                <AcceptanceRequestsCard
                                    requests={acceptanceRequests}
                                    isLoading={isRequestsLoading}
                                    actionLoading={!!selectedRequestId}
                                    selectedRequestId={selectedRequestId} // Pass the ID being acted upon
                                    onApprove={handleApproveRequest}
                                />
                            )}
                        </div>

                        <div className="space-y-6">
                            <ChallengeParticipantsCard
                                challenge={challenge} // Non-null here
                                senderTeam={senderTeam}
                                receiverTeam={receiverTeam} // Opponent team
                                permissions={permissions}
                                actionLoading={challengeLoading || !!selectedRequestId}
                                onOpenTeamModal={handleOpenTeamModal}
                                onDecline={handleDecline}
                                onWithdrawRequest={handleWithdrawRequest}
                                isSenderLoading={isSenderLoading}
                                isReceiverLoading={isReceiverLoading}
                                loggedInUser={user}
                                userTeams={userTeams}
                                acceptanceRequests={acceptanceRequests} // Pass requests for permission checks inside
                            />
                        </div>
                    </div>
                </div>


                <ConfirmationDialog
                    isOpen={confirmDialog.isOpen}
                    onOpenChange={(isOpen) => {
                        if (!isOpen) {
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
                 
                    isActionLoading={challengeLoading || !!selectedRequestId}
                />


                {challenge && userTeams && (
                    <TeamSelectionModal
                        isOpen={isTeamModalOpen}
                        onClose={() => setIsTeamModalOpen(false)}
                        onSelectTeam={handleSelectTeam}
                        teams={userTeams} // Pass asserted teams

                        isLoading={challengeLoading}
                 
                       
                 
                    />
                )}
            </TooltipProvider>
        </div>
    );
}