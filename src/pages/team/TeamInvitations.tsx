import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTeamInvitations, deleteTeamInvitation } from "@/redux/features/teams/teamThunks";
import { AppDispatch, RootState } from "@/redux/store";
import { Mail, UserPlus, Clock, User, Mailbox, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import type { TeamInvitation } from "@/redux/features/teams/teamTypes";

interface TeamInvitationsProps {
  teamId: string;
  isCaptain: boolean;
  setIsInviteDialogOpen: (value: boolean) => void;
}

const TeamInvitations = ({ teamId, isCaptain, setIsInviteDialogOpen }: TeamInvitationsProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { invitations, loading } = useSelector((state: RootState) => ({
    invitations: state.teams.selectedTeam.invitations,
    loading: state.teams.selectedTeam.loading
  }));

  useEffect(() => {
    const loadInvitations = async () => {
      try {
        await dispatch(getTeamInvitations(teamId)).unwrap();
      } catch (error) {
        toast.error("Failed to load team invitations");
      }
    };
    loadInvitations();
  }, [dispatch, teamId]);

  const getInitials = useCallback((name?: string) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }, []);

  const handleDeleteInvitation = useCallback(async (invitationId: string) => {
    try {
      await dispatch(deleteTeamInvitation({ teamId, invitationId })).unwrap();
      toast.success("Invitation deleted successfully");
    } catch (error) {
      toast.error("Failed to delete invitation");
    }
  }, [dispatch, teamId]);

  const renderInvitationItem = (inv: TeamInvitation) => (
    <li key={inv.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-start gap-4">
        <Avatar>
          <AvatarImage src={inv.user?.image || ""} />
          <AvatarFallback>{getInitials(inv.user?.name)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">{inv.user?.name || "Unknown User"}</h4>
            <Badge variant={inv.status === 'PENDING' ? 'destructive' : 'default'}>
              {inv.status.toLowerCase()}
            </Badge>
          </div>
          {inv.user?.email && (
            <p className="text-sm text-muted-foreground">{inv.user.email}</p>
          )}
          
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Role: {inv.role}</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span>Position: {inv.position || 'Not specified'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Mailbox className="h-4 w-4 text-muted-foreground" />
              <span>Message: {inv.message || 'No message'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Expires {formatDistanceToNow(new Date(inv.expiresAt))}</span>
            </div>
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
            Delete Invitation
          </Button>
        </div>
      )}
    </li>
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Team Invitations</CardTitle>
            <CardDescription>Manage your pending team invitations</CardDescription>
          </div>
          {isCaptain && (
            <Button onClick={() => setIsInviteDialogOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Member
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <p>Loading invitations...</p>
          </div>
        ) : invitations.length > 0 ? (
          <ul className="space-y-4">
            {invitations.map(renderInvitationItem)}
          </ul>
        ) : (
          <div className="text-center py-8">
            <Mail className="mx-auto h-12 w-12 text-muted-foreground/60" />
            <h3 className="mt-4 text-lg font-medium">No Pending Invitations</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              There are no pending invitations for this team at the moment.
            </p>
            {isCaptain && (
              <Button 
                className="mt-4" 
                onClick={() => setIsInviteDialogOpen(true)}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Invite Member
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamInvitations;