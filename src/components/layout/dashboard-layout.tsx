"use client"

import { type ReactNode, useEffect, useState } from "react"
import { useNavigate, Link, useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { fetchTeamInvitations, fetchUserNotifications } from "@/redux/features/user/userThunks"
import type { RootState } from "@/redux/store"
import { Button } from "@/components/ui/button"
import { Bell, Home, LogOut, Menu, Settings, User, Users, X } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const { user, notifications, teamInvitations } = useSelector((state: RootState) => state.users)
  const userId  = useSelector((state: RootState) => state.auth.user.id)

  useEffect(() => {
    dispatch(fetchTeamInvitations() as any)
    if (userId) {
      dispatch(fetchUserNotifications(userId) as any)
    }
  }, [dispatch, userId])

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length
  const invitationsCount = teamInvitations.length

  const handleLogout = () => {
    // Implement your logout logic here
    navigate("/login")
  }

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: "Invitations",
      path: "/dashboard/invitations",
      icon: <Users className="h-5 w-5" />,
      badge: invitationsCount > 0 ? invitationsCount : null,
    },
    {
      name: "Notifications",
      path: "/dashboard/notifications",
      icon: <Bell className="h-5 w-5" />,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : null,
    },
    {
      name: "Profile",
      path: "/dashboard/profile",
      icon: <User className="h-5 w-5" />,
    },
    {
      name: "Settings",
      path: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background px-4">
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center">
            {/* Mobile Menu Trigger */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="mr-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="flex h-16 items-center border-b px-4">
                  <h2 className="text-lg font-semibold">Dashboard</h2>
                  <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setIsMobileMenuOpen(false)}>
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </div>
                <nav className="flex flex-col gap-1 p-4">
                  {navItems.map((item) => (
                    <Button
                      key={item.path}
                      variant={isActive(item.path) ? "secondary" : "ghost"}
                      className="justify-start"
                      onClick={() => {
                        navigate(item.path)
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      {item.icon}
                      <span className="ml-2">{item.name}</span>
                      {item.badge && (
                        <Badge className="ml-auto" variant="secondary">
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  ))}
                  <Separator className="my-2" />
                  <Button variant="ghost" className="justify-start text-destructive" onClick={handleLogout}>
                    <LogOut className="h-5 w-5" />
                    <span className="ml-2">Logout</span>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link to="/dashboard" className="flex items-center">
              <span className="text-xl font-bold">TeamApp</span>
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate("/dashboard/notifications")}
            >
              <Bell className="h-5 w-5" />
              {unreadNotificationsCount > 0 && (
                <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive p-0 text-xs font-medium text-destructive-foreground">
                  {unreadNotificationsCount}
                </Badge>
              )}
            </Button>

            <Button variant="ghost" size="icon" className="relative" onClick={() => navigate("/dashboard/invitations")}>
              <Users className="h-5 w-5" />
              {invitationsCount > 0 && (
                <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary p-0 text-xs font-medium text-primary-foreground">
                  {invitationsCount}
                </Badge>
              )}
            </Button>

            <Avatar className="h-8 w-8 cursor-pointer" onClick={() => navigate("/dashboard/profile")}>
              {/* <AvatarImage src={user?.imageUrl} alt={user?.name || "User"} /> */}
              <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar (Desktop) */}
        <aside className="hidden w-64 border-r bg-background md:block">
          <nav className="flex flex-col gap-1 p-4">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "secondary" : "ghost"}
                className="justify-start"
                onClick={() => navigate(item.path)}
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
                {item.badge && (
                  <Badge className="ml-auto" variant="secondary">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            ))}
            <Separator className="my-2" />
            <Button variant="ghost" className="justify-start text-destructive" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
              <span className="ml-2">Logout</span>
            </Button>
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}

