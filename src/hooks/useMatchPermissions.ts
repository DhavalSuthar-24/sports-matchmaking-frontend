// src/hooks/useMatchPermissions.ts
import { useMemo } from 'react';
import { Match } from '@/redux/features/match/matchTypes';

interface UseMatchPermissionsProps {
  match: Match | null;
  user: any | null; // Replace with your User type
  userTeams: any[] | null; // Replace with your Team type
}

export function useMatchPermissions({
  match,
  user,
  userTeams
}: UseMatchPermissionsProps) {
  const permissions = useMemo(() => {
    if (!match || !user) {
      return {
        canEdit: false,
        canDelete: false,
        canUpdateStatus: false,
        canUpdateScore: false,
        canUpdateScoreboard: false,
        canUploadMedia: false,
        canDeleteMedia: false,
        isParticipant: false,
        isCreator: false,
        isTeamCaptain: false,
        isMatchManager: false,
      };
    }

    // Check if user is the match creator
    const isCreator = match.createdById === user.id;
    
    // Check if user is a member of participating teams
    const userTeamIds = userTeams?.map(team => team.id) || [];
    const matchTeamIds = match.teams?.map(t => t.team.id) || [];
    const isParticipant = userTeamIds.some(id => matchTeamIds.includes(id));

    // Check if user is a team captain in any of the participating teams
    const isTeamCaptain = userTeams?.some(team => 
      matchTeamIds.includes(team.id) && 
      team.members?.some((member: any) => 
        member.userId === user.id && 
        (member.role === 'CAPTAIN' || member.role === 'VICE_CAPTAIN')
      )
    ) || false;

    // Check if user has a manager role (either match creator or team captain)
    const isMatchManager = isCreator || isTeamCaptain;

    // Define permissions based on roles
    const canEdit = isCreator;
    const canDelete = isCreator;
    const canUpdateStatus = isMatchManager;
    const canUpdateScore = isMatchManager;
    const canUpdateScoreboard = isMatchManager;
    const canUploadMedia = isParticipant;
    const canDeleteMedia = isMatchManager;

    return {
      canEdit,
      canDelete,
      canUpdateStatus,
      canUpdateScore,
      canUpdateScoreboard,
      canUploadMedia,
      canDeleteMedia,
      isParticipant,
      isCreator,
      isTeamCaptain,
      isMatchManager,
    };
  }, [match, user, userTeams]);

  return permissions;
}