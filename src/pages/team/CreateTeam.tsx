

import type React from "react"

import { useState } from "react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

import { useDispatch, useSelector } from "react-redux"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"


import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea";
import { Upload, Link as LinkIcon } from "lucide-react"

import { createTeam } from "@/redux/features/teams/teamThunks"
import type { AppDispatch, RootState } from "@/redux/store"

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Team name must be at least 2 characters")
    .max(50, "Team name must be less than 50 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  sport: z.string({ required_error: "Please select a sport" }),
  level: z.string().optional(),
  minPlayers: z.coerce.number().int().min(1).max(100).optional(),
  maxPlayers: z.coerce.number().int().min(1).max(100).optional(),
  logo: z.string().optional(),
})

export default function CreateTeamForm() {
  const router = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { status } = useSelector((state: RootState) => state.teams)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoInputMethod, setLogoInputMethod] = useState<"upload" | "url">("upload")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      sport: "",
      level: "",
      minPlayers: undefined,
      maxPlayers: undefined,
      logo: "",
    },
  })

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file")
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB")
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setLogoPreview(result)
      form.setValue("logo", result)
    }
    reader.onerror = () => {
      toast.error("Error reading file")
    }
    reader.readAsDataURL(file)
  }

  const handleLogoUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value
    if (url) {
      setLogoPreview(url)
      form.setValue("logo", url)
    } else {
      setLogoPreview(null)
      form.setValue("logo", undefined)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const resultAction = await dispatch(createTeam(values))
      if (createTeam.fulfilled.match(resultAction)) {
        toast.success("Team Created: Your team has been created successfully.");
        router(`/teams/${resultAction.payload.id}`)
      } else {
        toast.error(`Failed to create team: ${resultAction.error.message || "Something went wrong. Please try again."}`);

      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err:any) {
      toast.error("An unexpected error occurred.");

    }
  }

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter team name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sport"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sport*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a sport" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="football">Football</SelectItem>
                        <SelectItem value="basketball">Basketball</SelectItem>
                        <SelectItem value="volleyball">Volleyball</SelectItem>
                        <SelectItem value="tennis">Tennis</SelectItem>
                        <SelectItem value="cricket">Cricket</SelectItem>
                        <SelectItem value="hockey">Hockey</SelectItem>
                        <SelectItem value="rugby">Rugby</SelectItem>
                        <SelectItem value="baseball">Baseball</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select team level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>The skill level of your team (optional)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-6">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter team description" {...field} className="h-24" />
                    </FormControl>
                    <FormDescription>Provide details about your team (optional)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="minPlayers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Players</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Min" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxPlayers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Players</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Max" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormItem>
                <FormLabel className="font-medium">Team Logo</FormLabel>
                
                <div className="flex gap-2 mb-4">
                  <Button
                    type="button"
                    variant={logoInputMethod === "upload" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLogoInputMethod("upload")}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </Button>
                  <Button
                    type="button"
                    variant={logoInputMethod === "url" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLogoInputMethod("url")}
                  >
                    <LinkIcon className="mr-2 h-4 w-4" />
                    URL
                  </Button>
                </div>

                {logoInputMethod === "upload" ? (
                  <div className="flex items-center gap-4">
                    {logoPreview ? (
                      <div className="relative h-20 w-20 rounded-md border overflow-hidden">
                        <img
                          src={logoPreview}
                          alt="Team logo preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-20 w-20 rounded-md border flex items-center justify-center bg-muted/50">
                        <span className="text-xs text-muted-foreground">No logo</span>
                      </div>
                    )}
                    <div>
                      <label htmlFor="logo-upload" className="cursor-pointer">
                        <div className="flex h-10 items-center rounded-md border px-4 py-2 hover:bg-muted transition-colors">
                          <Upload className="mr-2 h-4 w-4" />
                          <span className="text-sm">Select File</span>
                        </div>
                        <input
                          id="logo-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoChange}
                        />
                      </label>
                      <p className="text-xs text-muted-foreground mt-1">
                        JPG, PNG up to 2MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Input
                      type="url"
                      placeholder="https://example.com/logo.png"
                      onChange={handleLogoUrlChange}
                      className="h-10"
                    />
                    <p className="text-xs text-muted-foreground">
                      Paste the URL of your team logo
                    </p>
                    {logoPreview && (
                      <div className="pt-2">
                        <p className="text-xs font-medium mb-1">Logo Preview:</p>
                        <div className="relative h-20 w-20 rounded-md border overflow-hidden">
                          <img
                            src={logoPreview}
                            alt="Team logo preview from URL"
                            className="h-full w-full object-cover"
                            onError={() => {
                              setLogoPreview(null)
                              toast.error("Failed to load image from URL")
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <FormDescription className="text-xs">
                  Recommended size: 200x200 pixels
                </FormDescription>
              </FormItem>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" type="button" onClick={() => router("/teams")}>
              Cancel
            </Button>
            <Button type="submit" disabled={status === "loading"}>
              {status === "loading" ? "Creating..." : "Create Team"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  )
}

