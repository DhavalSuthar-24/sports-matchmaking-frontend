"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchTeamInvitations } from "@/redux/features/user/userThunks"
import type { RootState } from "../../redux/store"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"
import { Button } from "@/components/ui/button"

interface InvitationBadgeProps {
  onClick?: () => void
}

export function InvitationBadge({ onClick }: InvitationBadgeProps) {
  const dispatch = useDispatch()
  const { teamInvitations } = useSelector((state: RootState) => state.users)

  useEffect(() => {
    dispatch(fetchTeamInvitations() as any)
  }, [dispatch])

  const invitationsCount = teamInvitations.length

  return (
    <Button variant="ghost" size="icon" className="relative" onClick={onClick}>
      <Users className="h-5 w-5" />
      {invitationsCount > 0 && (
        <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary p-0 text-xs font-medium text-primary-foreground">
          {invitationsCount}
        </Badge>
      )}
    </Button>
  )
}

