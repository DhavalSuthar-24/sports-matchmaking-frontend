"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import {
  fetchUserProfile,
  updateUserProfile,
  uploadProfileImage,
  updateUserPassword,
} from "@/redux/features/user/userThunks"
import type { RootState } from "../../redux/store"
import { DashboardLayout } from "../../components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserCircle, Upload } from "lucide-react"

export default function Profile() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, status } = useSelector((state: RootState) => state.users)
  const  userId  = useSelector((state: RootState) => state.auth.user.id)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    imageUrl: "",
  })

  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserProfile(userId) as any)
    }
  }, [dispatch, userId])

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        imageUrl: user.profileImage || "",
      })
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) return

    toast.promise(
      dispatch(
        updateUserProfile({
          id: user.id,
          ...formData,
        }) as any,
      ).unwrap(),
      {
        loading: "Updating profile...",
        success: "Profile updated successfully!",
        error: "Failed to update profile",
      },
    )
  }

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) return

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    toast.promise(
      dispatch(
        updateUserPassword({
          id: user.id,
          newPassword: passwordData.newPassword,
        }) as any,
      ).unwrap(),
      {
        loading: "Updating password...",
        success: "Password updated successfully!",
        error: "Failed to update password",
      },
    )
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user?.id) return

    // In a real app, you would upload to a server first
    // This is a simplified example assuming direct URL input
    const reader = new FileReader()
    reader.onloadend = () => {
      const imageUrl = reader.result as string
      setFormData((prev) => ({ ...prev, imageUrl }))

      toast.promise(
        dispatch(
          uploadProfileImage({
            id: user.id,
            imageUrl,
          }) as any,
        ).unwrap(),
        {
          loading: "Uploading image...",
          success: "Profile image updated!",
          error: "Failed to upload image",
        },
      )
    }
    reader.readAsDataURL(file)
  }

  const isLoading = status === "loading"

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
                <CardDescription>Update your profile information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate}>
                  <div className="space-y-6">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="relative">
                        {formData.imageUrl ? (
                          <img
                            src={formData.imageUrl || "/placeholder.svg"}
                            alt={formData.name}
                            className="h-24 w-24 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                            <UserCircle className="h-16 w-16 text-muted-foreground" />
                          </div>
                        )}
                        <Label
                          htmlFor="image-upload"
                          className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          <Upload className="h-4 w-4" />
                          <span className="sr-only">Upload image</span>
                        </Label>
                        <Input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          disabled={isLoading}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={isLoading}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Input
                          id="bio"
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                      Save Changes
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Update your password</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordUpdate}>
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        disabled={isLoading}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                      Update Password
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

