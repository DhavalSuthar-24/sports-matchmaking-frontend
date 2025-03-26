"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import toast from "react-hot-toast"
import { createChallenge } from "@/redux/features/challenge/challengeThunks"
import { fetchTeams } from "@/redux/features/teams/teamThunks"
import type { AppDispatch, RootState } from "@/redux/store"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(100, "Title must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  sport: z.string({ required_error: "Please select a sport" }),
  level: z.string().optional(),
  date: z.date({ required_error: "Please select a date" }),
  time: z.string().optional(),
  location: z.string().optional(),
  senderTeamId: z.string({ required_error: "Please select your team" }),
  receiverTeamId: z.string().optional(),
})

export default function CreateChallengeForm() {
  const router = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { status, error } = useSelector((state: RootState) => state.challenges)
  const { teams } = useSelector((state: RootState) => state.teams)

  useEffect(() => {
    dispatch(fetchTeams({}))
  }, [dispatch])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      sport: "",
      level: "",
      date: new Date(),
      time: "",
      location: "",
      senderTeamId: "",
      receiverTeamId: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const formattedValues = {
        ...values,
        date: format(values.date, "yyyy-MM-dd"),
      }

      const resultAction = await dispatch(createChallenge(formattedValues))
      if (createChallenge.fulfilled.match(resultAction)) {
        toast("Your challenge has been created successfully.")
        router(`/challenges/${resultAction.payload.id}`)
      } else {
        toast(
         resultAction.error.message || "Something went wrong. Please try again.")
      }
    } catch (err) {
      toast("An unexpected error occurred."
      )
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
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Challenge Title*</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter challenge title" {...field} />
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
                          <SelectValue placeholder="Select skill level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>The skill level for this challenge (optional)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter challenge description" {...field} className="h-24" />
                    </FormControl>
                    <FormDescription>Provide details about your challenge (optional)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-6">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date*</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormDescription>The time of the challenge (optional)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter location" {...field} />
                    </FormControl>
                    <FormDescription>Where the challenge will take place (optional)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="senderTeamId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Team*</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your team" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teams && teams.length > 0 ? (
                          teams.map((team) => (
                            <SelectItem key={team.id} value={team.id}>
                              {team.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-teams" disabled>
                            No teams available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>The team you're representing for this challenge</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="receiverTeamId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opponent Team</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select opponent team (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="open">Open Challenge (Any Team)</SelectItem>
                        {teams && teams.length > 0 ? (
                          teams
                            .filter((team) => team.id !== form.getValues("senderTeamId"))
                            .map((team) => (
                              <SelectItem key={team.id} value={team.id}>
                                {team.name}
                              </SelectItem>
                            ))
                        ) : (
                          <SelectItem value="no-teams" disabled>
                            No teams available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>Leave empty for an open challenge that any team can accept</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" type="button" onClick={() => router("/challenges")}>
              Cancel
            </Button>
            <Button type="submit" disabled={status === "loading"}>
              {status === "loading" ? "Creating..." : "Create Challenge"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  )
}

