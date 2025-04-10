import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Users, Settings, Trash2, ArrowLeft, Mail, UserPlus, Clock, User, Mailbox, Target, BookText, BarChart2, Calendar, Shield, PersonStanding } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import { fetchTeamById, fetchTeamMembers, deleteTeam, requestToJoinTeam, getJoinRequests, respondToJoinRequest, getTeamInvitations, deleteTeamInvitation } from "@/redux/features/teams/teamThunks";
import type { AppDispatch, RootState } from "@/redux/store";
import type { Team, TeamMember, TeamJoinRequest, TeamInvitation } from "@/redux/features/teams/teamTypes";
import TeamMemberInviteDialog from "./team-member-invite-dialog"; // Assuming this exists


const TeamDetailSkeleton = () => (
  <div className="space-y-6 p-4 md:p-6 lg:p-8">
    <div className="flex items-center gap-4">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div>
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-24 mt-2" />
      </div>
    </div>
    <Skeleton className="h-48 w-full rounded-lg" />
    <div className="space-y-4">
      <Skeleton className="h-8 w-1/4" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>
    </div>
  </div>
);



const ErrorCard = ({ error, onRetry }: { error?: string; onRetry: () => void }) => (
  <Card className="bg-destructive/10 border-destructive/30 m-4 md:m-6 lg:m-8">
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
  isCaptain: boolean;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const TeamHeader = React.memo(({ team, isCaptain, onBack, onEdit, onDelete }: TeamHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack} aria-label="Back to teams">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold break-words">{team?.name}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-1">
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

      {isCaptain && (
        <div className="flex gap-2 mt-4 sm:mt-0">
          <Button variant="outline" onClick={onEdit}>
            <Settings className="mr-2 h-4 w-4" />
            Edit
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
                  Are you sure you want to delete "{team.name}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Confirm Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
});
TeamHeader.displayName = 'TeamHeader';


interface TeamInfoCardProps {
  team: Team;
  members: TeamMember[];
  isMember: boolean;
  isCaptain: boolean;
}

const TeamInfoCard = React.memo(({ team, members, isMember, isCaptain }: TeamInfoCardProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [position, setPosition] = useState("");
  const [message, setMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinRequest = useCallback(async () => {
    if (!team.id || !position) {
        toast.error("Position is required to send a join request.");
        return;
    };
    setIsLoading(true);
    try {
      await dispatch(requestToJoinTeam({
        teamId: team.id,
        sport: team.sport,
        position,
        message
      })).unwrap();
      toast.success("Request sent successfully!");
      setIsDialogOpen(false);
      setPosition("");
      setMessage("");
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to send join request. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, team.id, team.sport, position, message]);

  return (
    <Card className="overflow-hidden mb-6">
      <div className="bg-muted/30 p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="flex items-start gap-4 lg:col-span-1">
             {team.logo ? (
               <Avatar className="h-16 w-16 md:h-20 md:w-20 border">
                  <AvatarImage src={team.logo} alt={`${team.name} logo`} className="object-cover" />
                  <AvatarFallback>
                      {team.name?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
               </Avatar>
            ) : (
              <div className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                <Users className="h-8 w-8 md:h-10 md:w-10 text-primary" />
              </div>
            )}
            <div>
              <h2 className="text-lg md:text-xl font-semibold">{team.name}</h2>
              {team.createdBy && (
                <p className="text-sm text-muted-foreground mt-1">
                  Captain: {team.createdBy.name}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2 lg:col-span-1">
            <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
            <p className="text-sm">
              {team.description || "No description provided."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:col-span-1">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">Sport</h3>
              <p className="text-sm capitalize">
                {team.sport}
              </p>
            </div>

            {team.level && (
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">Level</h3>
                <p className="text-sm capitalize">
                  {team.level}
                </p>
              </div>
            )}

            {(team.minPlayers || team.maxPlayers) && (
              <div className="space-y-1 col-span-2 sm:col-span-1">
                <h3 className="text-sm font-medium text-muted-foreground">Team Size</h3>
                <p className="text-sm">
                  {members.length} / {team.minPlayers && team.maxPlayers
                    ? `${team.minPlayers}-${team.maxPlayers}`
                    : team.maxPlayers
                    ? `Max ${team.maxPlayers}`
                    : `Min ${team.minPlayers}`}
                </p>
              </div>
            )}
          </div>

          {!isMember && !isCaptain && (
             <div className="flex items-end justify-start lg:justify-end lg:col-span-3 mt-4 lg:mt-0">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="default">
                    Request to Join Team
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Request to Join {team.name}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="position" className="text-right col-span-1">
                        Position*
                      </Label>
                      <Input
                        id="position"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        placeholder="e.g., Striker, Goalkeeper"
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label htmlFor="message" className="text-right col-span-1 pt-2">
                        Message
                      </Label>
                      <Textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Why do you want to join?"
                        rows={3}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                   <Button
                      onClick={handleJoinRequest}
                      disabled={isLoading || !position}
                      className="w-full"
                    >
                      {isLoading ? "Sending Request..." : "Send Join Request"}
                    </Button>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
});
TeamInfoCard.displayName = 'TeamInfoCard';


// --- Team Members Tab Component ---

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

  useEffect(() => {
    if (teamId && membersStatus !== 'loading' && membersStatus !== 'succeeded') {
      const loadMembers = async () => {
        try {
          await dispatch(fetchTeamMembers(teamId)).unwrap();
        } catch (error) {
          toast.error("Failed to reload team members.");
        }
      };
      loadMembers();
    }
  }, [dispatch, teamId, membersStatus]); // Rerun if status changes from failed

  const getInitials = useCallback((name?: string) => {
      if (!name) return "U";
      return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }, []);

  const getRoleBadge = useCallback((role: string) => {
    switch (role?.toUpperCase()) {
      case "CAPTAIN":
        return <Badge variant="destructive">Captain</Badge>;
      case "MANAGER":
        return <Badge className="bg-blue-500 hover:bg-blue-500/80">Manager</Badge>;
      default:
        return <Badge variant="secondary">Player</Badge>;
    }
  }, []);

  const getRoleIcon = useCallback((role: string) => {
    switch (role?.toUpperCase()) {
      case "CAPTAIN":
        return <Shield className="h-4 w-4 text-muted-foreground" />;
      case "MANAGER":
        return <Settings className="h-4 w-4 text-muted-foreground" />;
      default:
        return <PersonStanding className="h-4 w-4 text-muted-foreground" />;
    }
  }, []);

  const renderMemberItem = useCallback((member: TeamMember) => (
    <div key={member.id} className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
      <Avatar className="h-10 w-10">
        <AvatarImage src={member.user?.image || ""} alt={member.name} />
        <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="font-medium flex items-center gap-2">
          {member.name || member.user?.name || 'Unknown User'}
          {member.userId === userId && (
            <Badge variant="outline" className="text-xs px-1.5 py-0.5">You</Badge>
          )}
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          {getRoleIcon(member.role)}
          <span className="capitalize">{member.role?.toLowerCase() || 'player'}</span>
        </div>
      </div>
      <div>{getRoleBadge(member.role)}</div>
    </div>
  ), [getRoleBadge, getRoleIcon, userId, getInitials]);

  const loadingSkeletons = useMemo(() => (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-3 rounded-lg border border-muted">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-3 w-2/5" />
          </div>
          <Skeleton className="h-6 w-16 rounded-md" />
        </div>
      ))}
    </div>
  ), []);

  const emptyState = useMemo(() => (
    <Card className="text-center py-8">
       <CardHeader className="items-center">
           <Users className="h-12 w-12 text-muted-foreground/60 mb-4" />
           <CardTitle>No Team Members Yet</CardTitle>
           <CardDescription>
               This team currently has no members.
           </CardDescription>
       </CardHeader>
      {isCaptain && (
           <CardFooter className="justify-center">
               <Button onClick={() => setIsInviteDialogOpen(true)} size="sm">
                   <UserPlus className="mr-2 h-4 w-4" />
                   Invite First Member
               </Button>
           </CardFooter>
      )}
    </Card>
  ), [isCaptain, setIsInviteDialogOpen]);

  return (
    <div className="mt-6 space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">
          Members ({teamMembers?.length || 0})
        </h3>
        {isCaptain && teamMembers?.length > 0 && (
          <Button onClick={() => setIsInviteDialogOpen(true)} size="sm">
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Member
          </Button>
        )}
      </div>

      {membersStatus === "loading" && loadingSkeletons}

      {membersStatus === "failed" && (
        <Card className="bg-destructive/10 border-destructive/30">
          <CardHeader>
            <CardTitle>Error Loading Members</CardTitle>
            <CardDescription>
              Could not load team members. Please try again.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => teamId && dispatch(fetchTeamMembers(teamId))}
            >
              Retry Load
            </Button>
          </CardFooter>
        </Card>
      )}

      {membersStatus === "succeeded" && (!teamMembers || teamMembers.length === 0) && emptyState}

      {membersStatus === "succeeded" && teamMembers && teamMembers.length > 0 && (
        <div className="space-y-2">
          {teamMembers.map(renderMemberItem)}
        </div>
      )}
    </div>
  );
};

// --- Team Invitations Tab Component ---

interface TeamInvitationsProps {
  teamId: string;
  isCaptain: boolean;
  setIsInviteDialogOpen: (value: boolean) => void;
}

const TeamInvitations = ({ teamId, isCaptain, setIsInviteDialogOpen }: TeamInvitationsProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { invitations, loading } = useSelector((state: RootState) => ({
    invitations: state.teams.selectedTeam?.invitations || [],
    loading: state.teams.selectedTeam?.invitationsStatus === 'loading'
  }));

  useEffect(() => {
    const loadInvitations = async () => {
      try {
        await dispatch(getTeamInvitations(teamId)).unwrap();
      } catch (error) {
        toast.error("Failed to load team invitations");
      }
    };
    if (teamId) {
       loadInvitations();
    }
  }, [dispatch, teamId]);

  const getInitials = useCallback((name?: string) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }, []);

  const handleDeleteInvitation = useCallback(async (invitationId: string) => {
    try {
      await dispatch(deleteTeamInvitation({ teamId, invitationId })).unwrap();
      toast.success("Invitation successfully revoked.");
      // No need to manually refetch, Redux state should update via extraReducers
    } catch (error) {
      toast.error("Failed to revoke invitation. Please try again.");
    }
  }, [dispatch, teamId]);

  const renderInvitationItem = useCallback((inv: TeamInvitation) => (
    <li key={inv.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <Avatar>
          <AvatarImage src={inv.user?.image || ""} />
          <AvatarFallback>{getInitials(inv.user?.name)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
            <div>
                <h4 className="font-medium">{inv.user?.name || inv.email || "Invited User"}</h4>
                {inv.user?.email && inv.user?.name && (
                  <p className="text-sm text-muted-foreground">{inv.user.email}</p>
                )}
            </div>
            <Badge variant={inv.status === 'PENDING' ? 'secondary' : inv.status === 'ACCEPTED' ? 'default' : 'destructive'}>
              {inv.status?.toLowerCase()}
            </Badge>
          </div>

          <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              <span>Role: <span className="font-medium text-foreground capitalize">{inv.role?.toLowerCase()}</span></span>
            </div>
             {inv.position && (
                <div className="flex items-center gap-1.5">
                  <Target className="h-3.5 w-3.5" />
                  <span>Position: <span className="font-medium text-foreground">{inv.position}</span></span>
                </div>
             )}
             {inv.message && (
                <div className="flex items-start gap-1.5 col-span-full mt-1">
                  <Mailbox className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                  <span className="flex-1">Message: <span className="font-medium text-foreground">{inv.message}</span></span>
                </div>
             )}
             <div className="flex items-center gap-1.5 col-span-full mt-1">
                <Clock className="h-3.5 w-3.5" />
                <span>Sent: {formatDistanceToNow(new Date(inv.createdAt), { addSuffix: true })}</span>
             </div>
            {inv.expiresAt && (
                <div className="flex items-center gap-1.5 col-span-full">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Expires: {formatDistanceToNow(new Date(inv.expiresAt), { addSuffix: true })}</span>
                </div>
            )}
          </div>
        </div>
      </div>
      {isCaptain && inv.status === 'PENDING' && (
        <div className="mt-3 flex justify-end gap-2">
          <Button
            size="sm"
            onClick={() => handleDeleteInvitation(inv.id)}
            variant="outline"
            disabled={loading}
          >
            Revoke Invite
          </Button>
        </div>
      )}
    </li>
  ), [getInitials, handleDeleteInvitation, isCaptain, loading]);


  const loadingSkeletons = useMemo(() => (
    <div className="space-y-3">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="flex items-start gap-4 p-4 rounded-lg border border-muted">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-2/5" />
                <Skeleton className="h-5 w-16 rounded-md" />
            </div>
            <Skeleton className="h-3 w-3/5" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
   ), []);

  return (
    <Card className="h-full mt-6">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <CardTitle>Sent Invitations</CardTitle>
            <CardDescription>Manage invitations sent to potential members.</CardDescription>
          </div>
          {isCaptain && (
            <Button onClick={() => setIsInviteDialogOpen(true)} size="sm">
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Member
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading && invitations.length === 0 ? (
           loadingSkeletons
        ) : invitations.length > 0 ? (
          <ul className="space-y-4">
            {invitations.map(renderInvitationItem)}
          </ul>
        ) : (
          <div className="text-center py-8">
            <Mail className="mx-auto h-12 w-12 text-muted-foreground/60" />
            <h3 className="mt-4 text-lg font-medium">No Pending Invitations</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              You haven't sent any invitations yet, or all have been responded to.
            </p>
            {isCaptain && (
              <Button
                className="mt-4"
                onClick={() => setIsInviteDialogOpen(true)}
                size="sm"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Invite Someone
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};


// --- Join Requests Tab Component ---

interface JoinRequestsProps {
  teamId: string;
  isCaptain: boolean;
}

const JoinRequests = ({ teamId, isCaptain }: JoinRequestsProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { joinRequests = [], loading, actionLoading } = useSelector((state: RootState) => ({
    joinRequests: state.teams.selectedTeam?.joinRequests,
    loading: state.teams.selectedTeam?.joinRequestsStatus === 'loading',
    actionLoading: state.teams.selectedTeam?.loading // For accept/reject actions
  }));

  useEffect(() => {
    const loadData = async () => {
      try {
        await dispatch(getJoinRequests(teamId)).unwrap();
      } catch (error) {
        toast.error("Failed to load join requests");
      }
    };
     if (teamId) {
        loadData();
     }
  }, [dispatch, teamId]);

  const getInitials = useCallback((name?: string) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }, []);

  const getStatusBadgeVariant = useCallback((status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status?.toUpperCase()) {
      case 'PENDING': return 'secondary';
      case 'ACCEPTED': return 'default'; // Green in shadcn default
      case 'REJECTED': return 'destructive';
      // Add other potential statuses if needed
      default: return 'outline';
    }
  }, []);

  const handleResponse = useCallback(async (requestId: string, response: 'APPROVE' | 'REJECT') => {
    try {
      await dispatch(respondToJoinRequest({ teamId, requestId, response })).unwrap();
      toast.success(`Join request ${response === 'APPROVE' ? 'approved' : 'rejected'}.`);
      // Data should refresh via Redux state update from extraReducers
    } catch (error: any) {
       const errorMessage = error?.message || `Failed to ${response === 'APPROVE' ? 'approve' : 'reject'} request.`;
       toast.error(errorMessage);
    }
  }, [dispatch, teamId]);

  const renderRequestItem = useCallback((req: TeamJoinRequest) => (
    <li key={req.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <Avatar>
          <AvatarImage src={req.user?.image || ""} />
          <AvatarFallback>
            {getInitials(req.user?.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
             <div>
                <h4 className="font-medium">{req.user?.name || "Unknown User"}</h4>
                {req.user?.email && (
                  <p className="text-sm text-muted-foreground">{req.user.email}</p>
                )}
            </div>
            <Badge variant={getStatusBadgeVariant(req.status)}>
              {req.status?.toLowerCase()}
            </Badge>
          </div>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5" />
              <span>Position: <span className="font-medium text-foreground">{req.position || 'Not specified'}</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>Requested: {formatDistanceToNow(new Date(req.createdAt), { addSuffix: true })}</span>
            </div>
            {/* Add other fields if available like experience, rating etc. */}
            {/* Example:
            <div className="flex items-center gap-1">
              <BarChart2 className="h-4 w-4" />
              <span>Experience: {req.experience || 'N/A'}</span>
            </div>
            */}
          </div>

          {req.message && (
            <div className="mt-3 text-sm">
              <p className="font-medium">Message:</p>
              <p className="text-muted-foreground bg-muted/50 p-2 rounded border">{req.message}</p>
            </div>
          )}
        </div>
      </div>
      {isCaptain && req.status === 'PENDING' && (
        <div className="mt-3 flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleResponse(req.id, 'REJECT')}
            disabled={actionLoading}
          >
            Reject
          </Button>
          <Button
            size="sm"
            onClick={() => handleResponse(req.id, 'APPROVE')}
            disabled={actionLoading}
          >
            {actionLoading ? 'Processing...' : 'Approve'}
          </Button>
        </div>
      )}
    </li>
  ), [getInitials, getStatusBadgeVariant, isCaptain, handleResponse, actionLoading]);


  const loadingSkeletons = useMemo(() => (
    <div className="space-y-3">
      {Array.from({ length: 2 }).map((_, i) => (
         <div key={i} className="flex items-start gap-4 p-4 rounded-lg border border-muted">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-2/5" />
                <Skeleton className="h-5 w-16 rounded-md" />
            </div>
            <Skeleton className="h-3 w-3/5" />
            <Skeleton className="h-8 w-full mt-2" />
          </div>
        </div>
      ))}
    </div>
   ), []);

  return (
    <Card className="h-full mt-6">
      <CardHeader>
        <CardTitle>Join Requests</CardTitle>
        <CardDescription>Manage requests from players wanting to join your team.</CardDescription>
      </CardHeader>
      <CardContent>
        {loading && joinRequests.length === 0 ? (
          loadingSkeletons
        ) : joinRequests.length > 0 ? (
          <ul className="space-y-4">
            {joinRequests.map(renderRequestItem)}
          </ul>
        ) : (
          <div className="text-center py-8">
            <Users className="mx-auto h-12 w-12 text-muted-foreground/60" />
            <h3 className="mt-4 text-lg font-medium">No Pending Join Requests</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              There are currently no requests to join this team.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};


// --- Main Team Detail Component ---

export default function TeamDetail() {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const userId = useSelector((state: RootState) => state.auth.user.id);
  const {
    selectedTeam,
    status,
    error,
    membersStatus,
  } = useSelector((state: RootState) => state.teams);

  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const team = selectedTeam?.team;
  const members = selectedTeam?.members || [];

  useEffect(() => {
    if (!teamId) {
        navigate("/teams"); // Redirect if no ID
        toast.error("Team ID is missing.");
        return;
    };

    const fetchData = async () => {
      try {
        // Fetch core team data first
        await dispatch(fetchTeamById(teamId)).unwrap();
        // Fetch members in parallel or sequentially based on need
        await dispatch(fetchTeamMembers(teamId)).unwrap();
        // Don't fetch invites/requests here, let tabs handle it
        setInitialLoadComplete(true);
      } catch (err: any) {
        console.error("Failed to load initial team data:", err);
        // Error handled by status check below, but could show toast here too
        // toast.error(err?.message || "Failed to load team data");
        setInitialLoadComplete(true); // Mark as complete even on error to show error card
      }
    };

    fetchData();

  }, [dispatch, teamId, navigate]);

  const isCaptain = useMemo(() => {
    return !!userId && !!team?.createdById && userId === team.createdById;
  }, [userId, team?.createdById]);

  const isMember = useMemo(() => {
    return members.some(member => member.userId === userId);
  }, [members, userId]);

  const handleDeleteTeam = useCallback(async () => {
    if (!teamId) return;
    try {
      await dispatch(deleteTeam(teamId)).unwrap();
      toast.success(`Team "${team?.name}" deleted successfully.`);
      navigate("/teams");
    } catch (error: any) {
       toast.error(error?.message || "Failed to delete team.");
    }
  }, [dispatch, navigate, teamId, team?.name]);

  const handleEditTeam = useCallback(() => {
    if (teamId) {
      navigate(`/teams/${teamId}/edit`);
    }
  }, [navigate, teamId]);

  const handleBack = useCallback(() => {
    navigate("/teams");
  }, [navigate]);

  const handleRetry = useCallback(() => {
      setInitialLoadComplete(false); // Allow fetching again
      if(teamId) {
        dispatch(fetchTeamById(teamId)); // Trigger refetch
      } else {
        handleBack();
      }
  }, [dispatch, teamId, handleBack])


  // Memoized tab content to prevent unnecessary re-renders
  const renderMembersTab = useMemo(() => (
    <TeamMembersTab
      teamMembers={members}
      membersStatus={membersStatus}
      teamId={teamId || ""}
      isCaptain={isCaptain}
      setIsInviteDialogOpen={setIsInviteDialogOpen}
    />
  ), [members, membersStatus, teamId, isCaptain]);

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


  if ((status === "loading" || membersStatus === "loading") && !initialLoadComplete) {
    return <TeamDetailSkeleton />;
  }

  if (status === "failed" && !team) {
    return <ErrorCard error={error ?? undefined} onRetry={handleRetry} />;
  }

  if (!team) {
     // Handles case where loading finishes but team is still null/undefined
     // Could happen if ID was invalid but API didn't return standard error
     if (initialLoadComplete) {
         return <ErrorCard error="Team not found or could not be loaded." onRetry={handleBack} />;
     }
     // If not initialLoadComplete, skeleton is still showing
     return <TeamDetailSkeleton />;
  }


  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl">
      <TeamHeader
        team={team}
        isCaptain={isCaptain}
        onBack={handleBack}
        onEdit={handleEditTeam}
        onDelete={handleDeleteTeam}
      />

      <TeamInfoCard
        team={team}
        members={members}
        isMember={isMember}
        isCaptain={isCaptain}
       />

      <Tabs defaultValue="members" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          <TabsTrigger value="members">Members</TabsTrigger>
          {isCaptain && <TabsTrigger value="invitations">Invitations</TabsTrigger>}
          {isCaptain && <TabsTrigger value="requests">Join Requests</TabsTrigger>}
        </TabsList>

        <TabsContent value="members">
          {renderMembersTab}
        </TabsContent>

        {isCaptain && (
          <>
            <TabsContent value="invitations">
              {renderInvitationsTab}
            </TabsContent>

            <TabsContent value="requests">
              {renderRequestsTab}
            </TabsContent>
          </>
        )}
      </Tabs>

      {teamId && isCaptain && (
        <TeamMemberInviteDialog // Ensure this component exists and is imported
          teamId={teamId}
          isOpen={isInviteDialogOpen}
          onClose={() => setIsInviteDialogOpen(false)}
        />
      )}
    </div>
  );
}

// NOTE: Ensure the `TeamMemberInviteDialog` component is correctly defined and imported in your project structure.
// Also ensure all necessary imports from `@/components/ui/*` and `@/redux/*` are correctly configured.