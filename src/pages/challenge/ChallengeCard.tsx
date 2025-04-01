import { Trophy, Users, MapPin, Calendar, Clock, CheckCircle, XCircle, Undo, Clock3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import type { Challenge } from "@/redux/features/challenge/challengeTypes"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useNavigate } from "react-router-dom"

interface ChallengeCardProps {
  challenge: Challenge
  userId?: string
  onAccept: (id: string) => void
  onDecline: (id: string) => void
  onWithdraw: (id: string) => void
  onExpire: (id: string) => void
  isAccepting?: boolean
  isDeclining?: boolean
}

export default function ChallengeCard({
  challenge,
  userId,
  onAccept,
  onDecline,
  onWithdraw,
  onExpire,
  isAccepting,
  isDeclining
}: ChallengeCardProps) {

  const navigate = useNavigate();
  const getStatusBadge = () => {
    switch (challenge.status) {
      case "OPEN":
        return (
          <Badge className="border rounded-full px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 border-blue-200">
            Open
          </Badge>
        )
      case "ACCEPTED":
        return (
          <Badge className="border rounded-full px-2 py-0.5 text-xs font-medium bg-green-50 text-green-700 border-green-200">
            Accepted
          </Badge>
        )
      case "DECLINED":
        return (
          <Badge className="border rounded-full px-2 py-0.5 text-xs font-medium bg-red-50 text-red-700 border-red-200">
            Declined
          </Badge>
        )
      case "COMPLETED":
        return (
          <Badge className="border rounded-full px-2 py-0.5 text-xs font-medium bg-purple-50 text-purple-700 border-purple-200">
            Completed
          </Badge>
        )
      case "PENDING":
        return (
          <Badge className="border rounded-full px-2 py-0.5 text-xs font-medium bg-yellow-50 text-yellow-700 border-yellow-200">
            Pending
          </Badge>
        )
      case "EXPIRED":
        return (
          <Badge className="border rounded-full px-2 py-0.5 text-xs font-medium bg-gray-50 text-gray-700 border-gray-200">
            Expired
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const isSender = challenge.senderId === userId
  const canAccept = challenge.status === "OPEN" && !isSender
  const canWithdraw = (challenge.status === "PENDING" || challenge.status === "OPEN") && isSender
  const canExpire = challenge.status === "ACCEPTED" && isSender

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg">{challenge.title}</CardTitle>
          {getStatusBadge()}
        </div>
        <CardDescription className="line-clamp-2">
          {challenge.description || "No description provided"}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Trophy className="h-4 w-4 text-muted-foreground" />
          <span className="capitalize">{challenge.sport || "No sport specified"}</span>
          {challenge.level && (
            <Badge variant="secondary" className="capitalize text-xs">
              {challenge.level}
            </Badge>
          )}
        </div>
        
        {challenge.date && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{format(new Date(challenge.date), "PPP")}</span>
          </div>
        )}
        
        {challenge.time && (
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{challenge.time}</span>
          </div>
        )}
        
        {challenge.location && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="line-clamp-1">{challenge.location}</span>
          </div>
        )}
        
        <div className="pt-3">
          <div className="text-xs text-muted-foreground mb-1">Teams</div>
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border">
              <AvatarImage src={challenge.senderTeam?.logo} />
              <AvatarFallback className="bg-primary/10 text-xs">
                {challenge.senderTeam?.name?.charAt(0) || "T"}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">
              {challenge.senderTeam?.name || "Unknown Team"}
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col gap-2">
        {canAccept && (
          <div className="flex gap-2 w-full">
            <Button 
              size="sm" 
              className="flex-1" 
              onClick={() => onAccept(challenge.id)}
              disabled={isAccepting}
            >
              {isAccepting ? (
                <>
                  <Clock3 className="mr-2 h-4 w-4 animate-spin" />
                  Accepting...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Accept
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => onDecline(challenge.id)}
              disabled={isDeclining}
            >
              {isDeclining ? (
                <>
                  <Clock3 className="mr-2 h-4 w-4 animate-spin" />
                  Declining...
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Decline
                </>
              )}
            </Button>
          </div>
        )}
        
        {canWithdraw && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => onWithdraw(challenge.id)}
          >
            <Undo className="mr-2 h-4 w-4" />
            Withdraw Challenge
          </Button>
        )}
        
        {canExpire && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => onExpire(challenge.id)}
          >
            <Clock3 className="mr-2 h-4 w-4" />
            Mark as Expired
          </Button>
        )}
           <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => navigate(`/challenges/${challenge.id}`)}
          >
            <Undo className="mr-2 h-4 w-4" />
            View More
          </Button>
      </CardFooter>
    </Card>
  )
}