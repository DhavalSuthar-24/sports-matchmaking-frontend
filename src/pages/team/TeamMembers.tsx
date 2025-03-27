import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Shield, Settings, PersonStanding } from "lucide-react";
import { useDispatch } from "react-redux";
import { fetchTeamMembers } from "@/redux/features/teams/teamThunks";
import type { TeamMember } from "@/redux/features/teams/teamTypes";

interface TeamMembersTabProps {
  teamMembers: TeamMember[];
  membersStatus: string;
  teamId: string;
  setIsInviteDialogOpen: (isOpen: boolean) => void;
}

const TeamMembersTab: React.FC<TeamMembersTabProps> = ({
  teamMembers,
  membersStatus,
  teamId,
  setIsInviteDialogOpen,
}) => {
  const dispatch = useDispatch();

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "CAPTAIN":
        return <Badge className="bg-yellow-500">Captain</Badge>;
      case "MANAGER":
        return <Badge className="bg-blue-500">Manager</Badge>;
      default:
        return <Badge variant="outline">Player</Badge>;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "CAPTAIN":
        return <Shield className="h-4 w-4" />;
      case "MANAGER":
        return <Settings className="h-4 w-4" />;
      default:
        return <PersonStanding className="h-4 w-4" />;
    }
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">
          Members ({teamMembers.length || 0})
        </h3>
        <Button onClick={() => setIsInviteDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </div>

      {membersStatus === "loading" && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-6 w-20 ml-auto" />
            </div>
          ))}
        </div>
      )}

      {membersStatus === "failed" && (
        <Card className="bg-destructive/10">
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

      {membersStatus === "succeeded" && teamMembers.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>No Team Members</CardTitle>
            <CardDescription>
              This team doesn't have any members yet. Invite members to join
              your team.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => setIsInviteDialogOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Member
            </Button>
          </CardFooter>
        </Card>
      )}

      {membersStatus === "succeeded" && teamMembers.length > 0 && (
        <div className="space-y-4">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-4 p-4 rounded-lg border"
            >
              <Avatar>
                <AvatarImage
                  src={`https://avatar.vercel.sh/${member.userId}`}
                />
                <AvatarFallback>
                  {member.userId.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">
                  {member.name}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  {getRoleIcon(member.role)}
                  <span>{member.role}</span>
                </div>
              </div>
              <div className="ml-auto">{getRoleBadge(member.role)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamMembersTab;
