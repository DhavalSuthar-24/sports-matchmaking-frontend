// components/MemberRoleBadge.tsx
import { Badge } from "@/components/ui/badge"
import { User, Shield, Settings } from "lucide-react"

interface MemberRoleBadgeProps {
  role: string
}

export default function MemberRoleBadge({ role }: MemberRoleBadgeProps) {
  const getRoleDetails = () => {
    switch (role) {
      case 'CAPTAIN':
        return {
          text: 'Captain',
          icon: <Shield className="h-3 w-3 mr-1" />,
          variant: 'default'
        }
      case 'MANAGER':
        return {
          text: 'Manager',
          icon: <Settings className="h-3 w-3 mr-1" />,
          variant: 'secondary'
        }
      default:
        return {
          text: 'Player',
          icon: <User className="h-3 w-3 mr-1" />,
          variant: 'outline'
        }
    }
  }

  const { text, icon, variant } = getRoleDetails()

  return (
    <Badge variant={variant as any}>
      {icon}
      {text}
    </Badge>
  )
}