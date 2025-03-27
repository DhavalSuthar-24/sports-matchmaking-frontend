import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTeamInvitations } from "@/redux/features/teams/teamThunks";
import { RootState } from "@/redux/store";
import { Mail, UserPlus, Clock, User, Mailbox, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface Invitation {
  id: string;
  teamId: string;
  userId: string;
  role: string;
  position: string;
  message: string;
  status: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

const TeamInvitations = ({ teamId, setIsInviteDialogOpen }: { teamId: string; setIsInviteDialogOpen: (value: boolean) => void }) => {
  const dispatch = useDispatch();
  const { invitations, loading } = useSelector((state: RootState) => state.teams);

  useEffect(() => {
    dispatch(getTeamInvitations(teamId));
  }, [dispatch, teamId]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Team Invitations</CardTitle>
            <CardDescription>Manage your pending team invitations</CardDescription>
          </div>
          <Button onClick={() => setIsInviteDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Invite Member
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <p>Loading invitations...</p>
          </div>
        ) : invitations.length > 0 ? (
          <ul className="space-y-4">
            {invitations.map((inv: Invitation) => (
              <li key={inv.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>{getInitials(inv.user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{inv.user.name}</h4>
                      <Badge variant={inv.status === 'PENDING' ? 'warning' : 'default'}>
                        {inv.status.toLowerCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{inv.user.email}</p>
                    
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
                <div className="mt-3 flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    Reject
                  </Button>
                  <Button size="sm">
                    Accept
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8">
            <Mail className="mx-auto h-12 w-12 text-muted-foreground/60" />
            <h3 className="mt-4 text-lg font-medium">No Pending Invitations</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              There are no pending invitations for this team at the moment.
            </p>
            <Button className="mt-4" onClick={() => setIsInviteDialogOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Member
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamInvitations;