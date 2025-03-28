import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getJoinRequests, respondToJoinRequest } from "@/redux/features/teams/teamThunks";
import { AppDispatch, RootState } from "@/redux/store";
import { Users, Clock, User, Target, BookText, BarChart2, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import type { TeamJoinRequest } from "@/redux/features/teams/teamTypes";

interface JoinRequestsProps {
  teamId: string;
  isCaptain: boolean;
}

const JoinRequests = ({ teamId, isCaptain }: JoinRequestsProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { joinRequests, loading } = useSelector((state: RootState) => ({
    joinRequests: state.teams.selectedTeam.joinRequests,
    loading: state.teams.selectedTeam.loading
  }));

  useEffect(() => {
    const loadData = async () => {
      try {
        await dispatch(getJoinRequests(teamId)).unwrap();
      } catch (error) {
        toast.error("Failed to load join requests");
      }
    };
    
    loadData();
  }, [dispatch, teamId]);

  const getInitials = useCallback((name?: string) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }, []);

  const getStatusBadgeVariant = useCallback((status: string) => {
    switch (status) {
      case 'PENDING':
        return 'secondary';
      case 'ACCEPTED':
      case 'FILLED':
        return 'default';
      case 'REJECTED':
      case 'CLOSED':
        return 'destructive';
      case 'OPEN':
        return 'outline';
      default:
        return 'outline';
    }
  }, []);

  const handleResponse = useCallback(async (requestId: string, response: 'accept' | 'reject') => {
    try {
      await dispatch(respondToJoinRequest({
        teamId,
        requestId,
        response: response === 'accept' ? 'APPROVE' : 'REJECT'
      })).unwrap();
      
      toast.success(`The join request has been ${response === 'accept' ? 'approved' : 'declined'}`);
      
      // Refresh the list
      await dispatch(getJoinRequests(teamId)).unwrap();
    } catch (error) {
      toast.error("Failed to process request");
    }
  }, [dispatch, teamId]);

  const renderRequestItem = (req: TeamJoinRequest) => (
    <li key={req.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-start gap-4">
        <Avatar>
          <AvatarImage src={req.user?.image || ""} />
          <AvatarFallback>
            {getInitials(req.user?.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">{req.user?.name || "Unknown User"}</h4>
            <Badge variant={getStatusBadgeVariant(req.status)}>
              {req.status.toLowerCase()}
            </Badge>
          </div>
          {req.user?.email && (
            <p className="text-sm text-muted-foreground">{req.user.email}</p>
          )}
          
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span>Sport: {req.sport || 'Not specified'}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Position: {req.position || 'Any'}</span>
            </div>
            <div className="flex items-center gap-1">
              <BookText className="h-4 w-4 text-muted-foreground" />
              <span>Experience: {req.experience || 'Not specified'}</span>
            </div>
            <div className="flex items-center gap-1">
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
              <span>Rating min: {req.ratingMin || 'Any'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Age range: {req.minAge || 'Any'}-{req.maxAge || 'Any'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Posted {formatDistanceToNow(new Date(req.createdAt))} ago</span>
            </div>
          </div>
          
          {req.description && (
            <div className="mt-3 text-sm">
              <p className="font-medium">Description:</p>
              <p className="text-muted-foreground">{req.description}</p>
            </div>
          )}
        </div>
      </div>
      {isCaptain && req.status === 'OPEN' && (
        <div className="mt-3 flex justify-end gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleResponse(req.id, 'reject')}
            disabled={loading}
          >
            Reject
          </Button>
          <Button 
            size="sm"
            onClick={() => handleResponse(req.id, 'accept')}
            disabled={loading}
          >
            Accept
          </Button>
        </div>
      )}
    </li>
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Join Requests</CardTitle>
        <CardDescription>Manage requests from players wanting to join your team</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <p>Loading join requests...</p>
          </div>
        ) : joinRequests?.length > 0 ? (
          <ul className="space-y-4">
            {joinRequests.map(renderRequestItem)}
          </ul>
        ) : (
          <div className="text-center py-8">
            <Users className="mx-auto h-12 w-12 text-muted-foreground/60" />
            <h3 className="mt-4 text-lg font-medium">No Join Requests</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              There are no pending requests to join this team at the moment.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JoinRequests;