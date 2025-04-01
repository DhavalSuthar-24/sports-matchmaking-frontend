import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Users, Settings, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { fetchTeamById, fetchTeamMembers, deleteTeam, requestToJoinTeam } from "@/redux/features/teams/teamThunks";
import type { AppDispatch, RootState } from "@/redux/store";
import type { Team, TeamMember } from "@/redux/features/teams/teamTypes";
import TeamMemberInviteDialog from "./team-member-invite-dialog";
import TeamInvitations from "./TeamInvitations";
import JoinRequests from "./JoinRequests";
import TeamMembersTab from "./TeamMembers";
import toast from "react-hot-toast";

const TeamDetailSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-4">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div>
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-24 mt-2" />
      </div>
    </div>
    <Skeleton className="h-40 w-full" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Skeleton className="h-60 w-full" />
      <Skeleton className="h-60 w-full" />
      <Skeleton className="h-60 w-full" />
    </div>
  </div>
);

const ErrorCard = ({ error, onRetry }: { error?: string; onRetry: () => void }) => (
  <Card className="bg-destructive/10">
    <CardHeader>
      <CardTitle>Error Loading Team</CardTitle>
      <CardDescription>
        {error || "There was an error loading the team details. Please try again."}
      </CardDescription>
    </CardHeader>
    <CardFooter>
      <Button variant="outline" onClick={onRetry}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Teams
      </Button>
    </CardFooter>
  </Card>
);

interface TeamHeaderProps {
  team: Team;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const TeamHeader = React.memo(({ team, onBack, onEdit, onDelete }: TeamHeaderProps) => {
  const userId = useSelector((state: RootState) => state.auth.user.id);

  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{team?.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="capitalize">
              {team?.sport}
            </Badge>
            {team?.level && (
              <Badge variant="secondary" className="capitalize">
                {team.level}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {userId === team.createdById && (
        <div className="flex gap-2">
          <Button variant="outline" onClick={onEdit}>
            <Settings className="mr-2 h-4 w-4" />
            Edit Team
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Team</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this team? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDelete}
                  className="bg-destructive text-destructive-foreground"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
});

interface TeamInfoCardProps {
  team: Team;
  members: TeamMember[];
}

const TeamInfoCard = React.memo(({ team, members }: TeamInfoCardProps) => {
  console.log()
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((state: RootState) => state.auth.user.id);
  const [position, setPosition] = useState("");
  const [message, setMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
console.log(members,"members")
  const isMember = useMemo(() => {
    return members.some(member => member.userId === userId);
  }, [members, userId]);

  const isCaptain = useMemo(() => userId === team.createdById, [userId, team.createdById]);

  const handleJoinRequest = useCallback(async () => {
    if (!team.id) return;
    
    setIsLoading(true);
    try {
 await dispatch(requestToJoinTeam({
        teamId: team.id,
        sport: team.sport,
        position,
        message
      })).unwrap();
toast.success("Request sended succesfully")
      
      
      setIsDialogOpen(false);
    } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else if (typeof error === "object" && error !== null && "message" in error) {
      toast.error((error as { message: string }).message);
    } else {
      toast.error("Failed to send join request. Please try again.");
    }
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, team.id, team.sport, position, message]);

  return (
    <Card className="overflow-hidden">
      <div className="bg-muted/30 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            {team.logo ? (
              <div className="relative h-20 w-20 overflow-hidden rounded-md">
                <img
                  src={team.logo}
                  alt={`${team.name} logo`}
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-10 w-10 text-primary" />
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold">{team.name}</h2>
              {team.createdBy && (
                <p className="text-sm text-muted-foreground mt-1">
                  Created by {team.createdBy.name}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-medium">Description</h3>
            <p className="text-sm text-muted-foreground">
              {team.description || "No description provided."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-medium">Sport</h3>
              <p className="text-sm text-muted-foreground capitalize">
                {team.sport}
              </p>
            </div>

            {team.level && (
              <div className="space-y-1">
                <h3 className="text-sm font-medium">Level</h3>
                <p className="text-sm text-muted-foreground capitalize">
                  {team.level}
                </p>
              </div>
            )}

            {(team.minPlayers || team.maxPlayers) && (
              <div className="space-y-1">
                <h3 className="text-sm font-medium">Team Size</h3>
                <p className="text-sm text-muted-foreground">
                  {team.minPlayers && team.maxPlayers
                    ? `${team.minPlayers}-${team.maxPlayers} players`
                    : team.maxPlayers
                    ? `Up to ${team.maxPlayers} players`
                    : `Min ${team.minPlayers} players`}
                </p>
              </div>
            )}
          </div>

          <div className="flex items-end justify-end md:col-span-3">
            {!isMember && !isCaptain && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="default">
                    Request to Join Team
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Request to Join {team.name}</DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="position">Position</Label>
                      <Input
                        id="position"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        placeholder="Enter your preferred position"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="message">Message (Optional)</Label>
                      <Textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell the team captain why you want to join"
                        rows={3}
                      />
                    </div>
                    
                    <Button 
                      onClick={handleJoinRequest} 
                      disabled={isLoading || !position}
                      className="w-full"
                    >
                      {isLoading ? "Sending..." : "Send Request"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
});

export default function TeamDetail() {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const userId = useSelector((state: RootState) => state.auth.user.id);
  const { 
    selectedTeam, 
    status, 
    error,
    membersStatus
  } = useSelector((state: RootState) => state.teams);
  console.log(selectedTeam,"selected")

  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);


  useEffect(() => {
    if (!teamId) return;

    const fetchData = async () => {
      try {
        await dispatch(fetchTeamById(teamId));
        await dispatch(fetchTeamMembers(teamId));
        setInitialLoadComplete(true);
      } catch (error) {
        console.error("Failed to load team data:", error);
      }
    };

    fetchData();

    return () => {
      // Cleanup if needed
    };
  }, [dispatch, teamId]);

  const handleDeleteTeam = useCallback(async () => {
    if (!teamId) return;
    try {
      await dispatch(deleteTeam(teamId)).unwrap();
      navigate("/teams");
    } catch (error) {
      console.error("Failed to delete team:", error);
    }
  }, [dispatch, navigate, teamId]);

  const handleEditTeam = useCallback(() => {
    if (teamId) {
      navigate(`/teams/${teamId}/edit`);
    }
  }, [navigate, teamId]);

  const handleBack = useCallback(() => {
    navigate("/teams");
  }, [navigate]);

  const isCaptain = useMemo(() => {
    return userId === selectedTeam?.team?.createdById;

  }, [userId, selectedTeam?.team?.createdById]);
  console.log(isCaptain)
  console.log(userId,"u")
  console.log(selectedTeam.createdById,"c")
  // Memoized tab content to prevent unnecessary re-renders
  const renderMembersTab = useMemo(() => (
    <TeamMembersTab
      teamMembers={selectedTeam?.members}
      membersStatus={membersStatus}
      teamId={teamId || ""}
      isCaptain={isCaptain}
      setIsInviteDialogOpen={setIsInviteDialogOpen}
    />
  ), [selectedTeam, membersStatus, teamId, isCaptain]);

  const renderInvitationsTab = useMemo(() => (
    <TeamInvitations
      teamId={teamId || ""}
      isCaptain={isCaptain}
      setIsInviteDialogOpen={setIsInviteDialogOpen}
    />
  ), [teamId, isCaptain]);

  const renderRequestsTab = useMemo(() => (
    <JoinRequests teamId={teamId || ""} isCaptain={isCaptain} />
  ), [teamId, isCaptain]);

  if (status === "loading" && !initialLoadComplete) {
    return <TeamDetailSkeleton />;
  }

  if (status === "failed" || !selectedTeam?.team) {
    return <ErrorCard error={error ?? undefined} onRetry={handleBack} />;
  }

  return (
    <div className="space-y-6">
      <TeamHeader 
        team={selectedTeam.team} 
        onBack={handleBack}
        onEdit={handleEditTeam}
        onDelete={handleDeleteTeam}
      />

      <TeamInfoCard team={selectedTeam.team} members={selectedTeam.members} />

      <Tabs defaultValue="members">
        <TabsList>
          <TabsTrigger value="members">Team Members</TabsTrigger>
          {isCaptain && (
            <>
              <TabsTrigger value="invitations">Invitations</TabsTrigger>
              <TabsTrigger value="requests">Join Requests</TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="members">
          {renderMembersTab}
        </TabsContent>

        {isCaptain && (
          <>
            <TabsContent value="invitations" className="mt-6">
              {renderInvitationsTab}
            </TabsContent>

            <TabsContent value="requests" className="mt-6">
              {renderRequestsTab}
            </TabsContent>
          </>
        )}
      </Tabs>

      {teamId && isCaptain && (
        <TeamMemberInviteDialog
          teamId={teamId}
          isOpen={isInviteDialogOpen}
          onClose={() => setIsInviteDialogOpen(false)}
        />
      )}
    </div>
  );
}