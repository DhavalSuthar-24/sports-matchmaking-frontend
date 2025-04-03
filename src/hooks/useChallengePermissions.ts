import { useMemo } from 'react';

import type { Challenge, ChallengeAcceptanceRequest, ChallengeStatus } from '@/redux/features/challenge/challengeTypes'; // Adjust path
import type { User } from '@/redux/features/user/userTypes'; // Adjust path
import type { Team } from '@/redux/features/challenge/common.types'; // Adjust path


enum ChallengeAcceptanceStatus {
    PENDING_APPROVAL = "PENDING_APPROVAL",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    WITHDRAWN = "WITHDRAWN",
}


interface UseChallengePermissionsArgs {
    challenge: Challenge | null;
    user: User | null;
    userTeams: Team[] | null;
    acceptanceRequests: ChallengeAcceptanceRequest[] | null;
}

export function useChallengePermissions({
    challenge,
    user,
    userTeams,
    acceptanceRequests,
}: UseChallengePermissionsArgs) {



    console.log(challenge,"Cccccccccc")
    console.log(user,"uuuuuuuuuu")
    console.log(userTeams,"utttttttttttt"
    )
    console.log(acceptanceRequests,"aaaaaaaaaaaaaaa")
    const userTeamIds = useMemo(() => {

        if (!user || !userTeams) return [];
        return userTeams.map(team => team.id);
    }, [user, userTeams]);

    return useMemo(() => {
        const defaultPermissions = {
            isCreator: false, isSenderMember: false, isReceiverMember: false, isAcceptorMember: false,
            canModify: false, canAcceptDirectly: false, canDeclineDirectly: false, canRequestAccept: false,
            canWithdrawRequest: false, canManageRequests: false, canWithdrawChallenge: false,
            userHasPendingRequest: false, userPendingRequestId: null as string | null,
        };

        if (!user || !challenge) return defaultPermissions;

        const userId = user.id;
        const userName = user.name
        const challengeStatus = challenge.status as ChallengeStatus; // Cast if necessary, or ensure Challenge type uses the enum
        const isOpenChallenge = challengeStatus === "OPEN"; // Assuming "OPEN" is a valid string literal in ChallengeStatus

        const isCreator = challenge.createdBy === userName || challenge.senderId === userId;

        // Fix 1: Add truthiness check for optional team IDs
        const isSenderMember = !!challenge.senderTeamId && userTeamIds.includes(challenge.senderTeamId);
        const isReceiverMember = !!challenge.receiverTeamId && userTeamIds.includes(challenge.receiverTeamId);

        // Fix 4: Use firstAcceptorTeamId instead of acceptedByTeamId and add truthiness check
        const isAcceptorMember = !!challenge.firstAcceptorTeamId && userTeamIds.includes(challenge.firstAcceptorTeamId);

        const userPendingRequest = acceptanceRequests?.find(req =>
            // Fix 2: Compare with the correct enum value or string literal
            req.status === ChallengeAcceptanceStatus.PENDING_APPROVAL &&
            // Fix 3: Use acceptingTeamId instead of requestingTeamId and add truthiness check
            !!req.acceptingTeamId && userTeamIds.includes(req.acceptingTeamId)
        );

        // Use string literals for status comparison if ChallengeStatus is defined as such
        const isPendingOrOpen = ['PENDING', 'OPEN'].includes(challengeStatus);
        console.log(isCreator,"iscreator",isSenderMember,"isSenderMember")

        const canModify = (isCreator || isSenderMember) && isPendingOrOpen;
        const canWithdrawChallenge = (isCreator || isSenderMember) && isPendingOrOpen;
        // Added check for receiverTeamId existence for direct actions
        const canAcceptDirectly = !!challenge.receiverTeamId && isReceiverMember && challengeStatus === 'PENDING';
        const canDeclineDirectly = !!challenge.receiverTeamId && isReceiverMember && challengeStatus === 'PENDING';
        // User must have teams to request acceptance
        const canRequestAccept = !isCreator && !isSenderMember && !isReceiverMember && challengeStatus === 'OPEN' && !userPendingRequest && userTeams && userTeams.length > 0;
        const canWithdrawRequest = !!userPendingRequest;
        const canManageRequests = (isCreator || isSenderMember) && challengeStatus === 'OPEN';

        return {
            isCreator, isSenderMember, isReceiverMember, isAcceptorMember,
            canModify, canAcceptDirectly, canDeclineDirectly, canRequestAccept,
            canWithdrawRequest, canManageRequests, canWithdrawChallenge,
            userHasPendingRequest: !!userPendingRequest,
            userPendingRequestId: userPendingRequest?.id ?? null,
        };
        // Ensure all dependencies used inside useMemo are listed
    }, [user, challenge, userTeams, acceptanceRequests, userTeamIds]);
}