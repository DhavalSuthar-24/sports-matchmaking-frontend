import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getJoinRequests } from "@/redux/features/teams/teamThunks";
import { AppDispatch, RootState } from "@/redux/store";
import { Users, Clock, User, Target, BookText, BarChart2, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface JoinRequest {
  id: string;
  teamId: string;
  userId: string;
  sport: string;
  position: string;
  skills: any;
  experience: string;
  description: string;
  status: string;
  requiredSkills: any;
  ageRange: string;
  ratingMin: number;
  minAge: number;
  maxAge: number;
  regionPreference: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

const JoinRequests = ({ teamId }: { teamId: string }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { joinRequests, loading } = useSelector((state: RootState) => state.teams);

  useEffect(() => {
    dispatch(getJoinRequests(teamId));
  }, [dispatch, teamId]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

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
        ) : joinRequests && joinRequests.length > 0 ? (
          <ul className="space-y-4">
            {joinRequests.map((req: JoinRequest) => (
              <li key={req.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>{getInitials(req.user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{req.user.name}</h4>
                      <Badge variant={req.status === 'PENDING' ? 'destructive' : req.status === 'ACCEPTED' ? 'default' : 'destructive'}>
                        {req.status.toLowerCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{req.user.email}</p>
                    
                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <span>Sport: {req.sport}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>Position: {req.position}</span>
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
                        <span>Age range: {req.minAge}-{req.maxAge || 'Any'}</span>
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