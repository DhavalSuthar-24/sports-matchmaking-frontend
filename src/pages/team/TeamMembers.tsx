import React, { useCallback, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Shield, Settings, PersonStanding } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeamMembers } from "@/redux/features/teams/teamThunks";
import type { TeamMember } from "@/redux/features/teams/teamTypes";
import type { AppDispatch, RootState } from "@/redux/store";
import { toast } from "react-hot-toast";

interface TeamMembersTabProps {
  teamMembers: TeamMember[];
  membersStatus: "idle" | "loading" | "succeeded" | "failed";
  teamId: string;
  isCaptain: boolean;
  setIsInviteDialogOpen: (isOpen: boolean) => void;
}

const TeamMembersTab: React.FC<TeamMembersTabProps> = ({
  teamMembers,
  membersStatus,
  teamId,
  isCaptain,
  setIsInviteDialogOpen,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.auth.user.id);

  // Fetch team members when teamId changes
  useEffect(() => {
    if (teamId) {
      const loadMembers = async () => {
        try {
          await dispatch(fetchTeamMembers(teamId)).unwrap();
        } catch (error) {
          toast.error("Failed to load team members");
        }
      };
      loadMembers();
    }
  }, [dispatch, teamId]);

  const getRoleBadge = useCallback((role: string) => {
    switch (role) {
      case "CAPTAIN":
        return <Badge className="bg-yellow-500 hover:bg-yellow-500/80">Captain</Badge>;
      case "MANAGER":
        return <Badge className="bg-blue-500 hover:bg-blue-500/80">Manager</Badge>;
      default:
        return <Badge variant="outline">Player</Badge>;
    }
  }, []);

  const getRoleIcon = useCallback((role: string) => {
    switch (role) {
      case "CAPTAIN":
        return <Shield className="h-4 w-4" />;
      case "MANAGER":
        return <Settings className="h-4 w-4" />;
      default:
        return <PersonStanding className="h-4 w-4" />;
    }
  }, []);

  const renderMemberItem = useCallback((member: TeamMember) => (
    <div key={member.id} className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
      <Avatar>
        <AvatarImage src={member.user?.image || `https://avatar.vercel.sh/${member.userId}`} />
        <AvatarFallback>
          {member.name ? member.name.substring(0, 2).toUpperCase() : "US"}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="font-medium flex items-center gap-2">
          {member.name}
          {member.userId === userId && (
            <Badge variant="secondary">You</Badge>
          )}
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          {getRoleIcon(member.role)}
          <span className="capitalize">{member.role.toLowerCase()}</span>
        </div>
      </div>
      <div>{getRoleBadge(member.role)}</div>
    </div>
  ), [getRoleBadge, getRoleIcon, userId]);

  const loadingSkeletons = useMemo(() => (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
      ))}
    </div>
  ), []);

  const emptyState = useMemo(() => (
    <Card>
      <CardHeader>
        <CardTitle>No Team Members</CardTitle>
        <CardDescription>
          This team doesn't have any members yet. Invite members to join your team.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        {isCaptain && (
          <Button onClick={() => setIsInviteDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Member
          </Button>
        )}
      </CardFooter>
    </Card>
  ), [isCaptain, setIsInviteDialogOpen]);

  return (
    <div className="mt-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          Members ({teamMembers.length || 0})
        </h3>
        {isCaptain && (
          <Button onClick={() => setIsInviteDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Member
          </Button>
        )}
      </div>

      {membersStatus === "loading" && loadingSkeletons}

      {membersStatus === "failed" && (
        <Card className="bg-destructive/10 border-destructive/30">
          <CardHeader>
            <CardTitle>Error Loading Team Members</CardTitle>
            <CardDescription>
              There was an error loading the team members. Please try again.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              variant="outline"
              onClick={() => teamId && dispatch(fetchTeamMembers(teamId))}
            >
              Retry
            </Button>
          </CardFooter>
        </Card>
      )}

      {membersStatus === "succeeded" && teamMembers.length === 0 && emptyState}

      {membersStatus === "succeeded" && teamMembers.length > 0 && (
        <div className="space-y-2">
          {teamMembers.map(renderMemberItem)}
        </div>
      )}
    </div>
  );
};

export default TeamMembersTab;