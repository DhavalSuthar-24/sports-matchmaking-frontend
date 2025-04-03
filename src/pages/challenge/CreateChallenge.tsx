import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  format,
  setHours,
  setMinutes,
  setSeconds,
  setMilliseconds,
} from "date-fns";
import { CalendarIcon } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Assuming challenge slice structure uses loading: boolean based on provided code
import { createTeamChallenge } from "@/redux/features/challenge/challengeThunks";
import type { CreateTeamChallengeRequest } from "@/redux/features/challenge/challengeTypes"; // Adjusted path

// Assuming teams, games, venues slices use status: 'idle' | 'loading' | ...
import { fetchTeams } from "@/redux/features/teams/teamThunks";
import { fetchGames } from "@/redux/features/game/gameThunks"; // Adjusted path
import type { Game } from "@/redux/features/game/gameTypes"; // Adjusted path
import { fetchVenues } from "@/redux/features/venue/venueThunks"; // Adjusted path
import type { Venue } from "@/redux/features/venue/venueTypes"; // Adjusted path

import type { AppDispatch, RootState } from "@/redux/store";
import { cn } from "@/lib/utils";

// --- Zod schema (remains the same) ---
const formSchema = z
  .object({
    title: z
      .string()
      .min(2, "Title must be at least 2 characters")
      .max(100, "Title must be less than 100 characters"),
    description: z
      .string()
      .max(500, "Description must be less than 500 characters")
      .optional(),
    gameId: z
      .string({ required_error: "Please select a game" })
      .min(1, "Please select a game"), // Ensure not empty
    matchType: z
      .string({ required_error: "Please select a match type" })
      .min(1, "Please select a match type"), // Ensure not empty
    venueId: z
      .string({ required_error: "Please select a venue" })
      .min(1, "Please select a venue"), // Ensure not empty
    scheduledDate: z.date({ required_error: "Please select a date" }),
    scheduledTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"), // HH:MM format
    duration: z.coerce
      .number()
      .positive("Duration must be positive")
      .int("Duration must be a whole number")
      .optional(),
    skillLevel: z.string().optional(),
    customRules: z
      .string()
      .max(1000, "Custom rules must be less than 1000 characters")
      .optional(),
    location: z
      .string()
      .max(200, "Location must be less than 200 characters")
      .optional(),
    senderTeamId: z
      .string({ required_error: "Please select your team" })
      .min(1, "Please select your team"), // Ensure not empty
    receiverTeamId: z.string().optional(), // Can be empty or "open" or a team ID
    expiresAtDate: z.date().optional(),
    expiresAtTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)")
      .optional(),
  })
  .refine(
    (data) => {
      if (data.expiresAtDate && data.scheduledDate && data.scheduledTime) {
        try {
          const scheduledDateTime = combineDateAndTime(
            data.scheduledDate,
            data.scheduledTime
          );
          const expiresAtDateTime = combineDateAndTime(
            data.expiresAtDate,
            data.expiresAtTime || "00:00"
          );
          return expiresAtDateTime < scheduledDateTime;
        } catch (e) {
          return true; // Allow submission if intermediate state is invalid, rely on submit validation
        }
      }
      return true;
    },
    {
      message: "Expiration date/time must be before the scheduled date/time",
      path: ["expiresAtDate"],
    }
  )
  .refine((data) => !(data.expiresAtDate && !data.expiresAtTime), {
    message: "Time is required if expiration date is set",
    path: ["expiresAtTime"],
  });

// Helper function to combine Date object and HH:MM string
const combineDateAndTime = (
  date: Date | undefined,
  time: string | undefined
): Date => {
  if (!date || !time) {
    throw new Error("Date and time must be provided to combine.");
  }
  const [hours, minutes] = time.split(":").map(Number);
  if (isNaN(hours) || isNaN(minutes)) {
    throw new Error("Invalid time format for combining.");
  }
  let combined = setHours(date, hours);
  combined = setMinutes(combined, minutes);
  combined = setSeconds(combined, 0);
  combined = setMilliseconds(combined, 0);
  return combined;
};

export default function CreateChallengeForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // --- Corrected Selectors based on provided Slice definitions ---
  // Challenge slice uses loading: boolean
  const { loading: isChallengeLoading, error: challengeError } = useSelector(
    (state: RootState) => state.challenges
  );
  // Teams, Games, Venues slices use status: 'idle' | 'loading' | ...
  const {
    teams,
    status: teamsStatus,
    error: teamsError,
  } = useSelector((state: RootState) => state.teams);
  const {
    games,
    status: gamesStatus,
    error: gamesError,
  } = useSelector((state: RootState) => state.games);
  const {
    venues,
    status: venuesStatus,
    error: venuesError,
  } = useSelector((state: RootState) => state.venues);

  // --- Fetch Teams, Games, and Venues ---
  useEffect(() => {
    // Fetch only if status is 'idle'

    dispatch(fetchTeams({})); // Assuming fetchTeams accepts options object or nothing

    dispatch(fetchGames());

    dispatch(fetchVenues({})); // Assuming fetchVenues accepts options object or nothing
  }, []); // Depend on status

  // --- Consolidate Error Handling ---
  useEffect(() => {
    if (teamsError) toast.error(`Failed to load teams: ${teamsError}`);
    if (gamesError) toast.error(`Failed to load games: ${gamesError}`);
    if (venuesError) toast.error(`Failed to load venues: ${venuesError}`);
    if (challengeError)
      toast.error(`Challenge creation failed: ${challengeError}`);
  }, [teamsError, gamesError, venuesError, challengeError]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      gameId: "",
      matchType: "",
      venueId: "",
      scheduledDate: undefined,
      scheduledTime: "",
      duration: undefined,
      skillLevel: "",
      customRules: "",
      location: "",
      senderTeamId: "",
      receiverTeamId: "open", // Default to "open" for the select item
      expiresAtDate: undefined,
      expiresAtTime: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let scheduledDateTime: Date;
    try {
      scheduledDateTime = combineDateAndTime(
        values.scheduledDate,
        values.scheduledTime
      );
    } catch (e) {
      toast.error("Invalid scheduled date or time.");
      form.setError("scheduledTime", { message: "Invalid time" });
      return;
    }

    let expiresAtISO: string | undefined = undefined;
    if (values.expiresAtDate && values.expiresAtTime) {
      try {
        const expiresAtDateTime = combineDateAndTime(
          values.expiresAtDate,
          values.expiresAtTime
        );
        if (expiresAtDateTime >= scheduledDateTime) {
          form.setError("expiresAtDate", {
            message: "Expiration must be before schedule date/time",
          });
          toast.error("Expiration must be before the scheduled date/time.");
          return;
        }
        expiresAtISO = expiresAtDateTime.toISOString();
      } catch (e) {
        toast.error("Invalid expiration time.");
        form.setError("expiresAtTime", { message: "Invalid time" });
        return;
      }
    } else if (values.expiresAtDate && !values.expiresAtTime) {
      toast.error(
        "Please provide an expiration time if you set an expiration date."
      );
      form.setError("expiresAtTime", { message: "Time is required" });
      return;
    }

    // Construct payload
    const payload: CreateTeamChallengeRequest = {
      title: values.title,
      senderTeamId: values.senderTeamId,
      gameId: values.gameId,
      matchType: values.matchType,
      venueId: values.venueId,
      scheduledAt: scheduledDateTime.toISOString(),
      ...(values.description && { description: values.description }),
      ...(values.receiverTeamId && values.receiverTeamId !== "open" // Check against "open"
        ? { receiverTeamId: values.receiverTeamId }
        : {}), // Omit if "open" or empty/undefined
      ...(expiresAtISO && { expiresAt: expiresAtISO }),
      ...(values.duration && { duration: values.duration }),
      ...(values.skillLevel && { skillLevel: values.skillLevel }),
      ...(values.customRules && { customRules: values.customRules }),
      ...(values.location && { location: values.location }),
    };

    try {
      console.log("Submitting Challenge Payload:", payload);
      const resultAction = await dispatch(createTeamChallenge(payload));

      if (createTeamChallenge.fulfilled.match(resultAction)) {
        toast.success("Challenge created successfully!");
        const challengeId = resultAction.payload?.data?.challenge?.id;
        if (challengeId) {
          navigate(`/challenges/${challengeId}`);
        } else {
          console.warn(
            "Challenge created but ID not found in response payload."
          );
          navigate("/challenges");
        }
      }
    } catch (err) {
      console.error("Dispatch error:", err);
      toast.error("An unexpected error occurred while submitting the form.");
    }
  }

  // --- Corrected isLoading check ---
  // Check if any of the relevant states are in 'loading' status
  const isLoading =
    isChallengeLoading || // from challenge slice (boolean)
    teamsStatus === "loading" ||
    gamesStatus === "loading" ||
    venuesStatus === "loading";

  return (
    <Card className="p-6 max-w-4xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* --- Column 1 --- */}
            <div className="space-y-4">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Challenge Title*</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Friday Night Football Showdown"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Game Select */}
              <FormField
                control={form.control}
                name="gameId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Game*</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        if (value === "create_new_game") {
                          navigate("/games/create");
                        } else {
                          field.onChange(value);
                        }
                      }}
                      value={field.value}
                      // Use status for disabled check
                      disabled={gamesStatus === "loading"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          {/* Use status for placeholder */}
                          <SelectValue
                            placeholder={
                              gamesStatus === "loading"
                                ? "Loading games..."
                                : "Select a game"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* Use status for conditional rendering */}
                        {gamesStatus === "loading" ? (
                          <SelectItem value="loading" disabled>
                            Loading...
                          </SelectItem>
                        ) : games?.length > 0 ? (
                          <>
                            {games.map((game: Game) => (
                              <SelectItem key={game.id} value={game.id}>
                                {game.name}
                              </SelectItem>
                            ))}
                            <SelectItem
                              value="create_new_game"
                              className="text-blue-600 italic"
                            >
                              -- Create New Game --
                            </SelectItem>
                          </>
                        ) : (
                          <>
                            <SelectItem value="no-games" disabled>
                              No games found
                            </SelectItem>
                            <SelectItem
                              value="create_new_game"
                              className="text-blue-600 italic"
                            >
                              -- Create New Game --
                            </SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Match Type */}
              <FormField
                control={form.control}
                name="matchType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Match Type*</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select match type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="FRIENDLY">Friendly</SelectItem>
                        <SelectItem value="LEAGUE">League</SelectItem>
                        <SelectItem value="TOURNAMENT">Tournament</SelectItem>
                        <SelectItem value="SCRIMMAGE">Scrimmage</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Skill Level */}
              <FormField
                control={form.control}
                name="skillLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skill Level</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select skill level (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ANY">Any / Unspecified</SelectItem>
                        <SelectItem value="BEGINNER">Beginner</SelectItem>
                        <SelectItem value="INTERMEDIATE">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="ADVANCED">Advanced</SelectItem>
                        <SelectItem value="PROFESSIONAL">
                          Professional
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Helps match with suitable opponents.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any extra details about the challenge (optional)"
                        {...field}
                        value={field.value || ""}
                        className="min-h-[80px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Custom Rules */}
              <FormField
                control={form.control}
                name="customRules"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom Rules</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Specify any custom rules (optional)"
                        {...field}
                        value={field.value || ""}
                        className="min-h-[80px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* --- Column 2 --- */}
            <div className="space-y-4">
              {/* Venue Select */}
              <FormField
                control={form.control}
                name="venueId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Venue*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      // Use status for disabled check
                      disabled={venuesStatus === "loading"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          {/* Use status for placeholder */}
                          <SelectValue
                            placeholder={
                              venuesStatus === "loading"
                                ? "Loading venues..."
                                : "Select a venue"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* Use status for conditional rendering */}
                        {venuesStatus === "loading" ? (
                          <SelectItem value="loading" disabled>
                            Loading...
                          </SelectItem>
                        ) : venues?.length > 0 ? (
                          venues.map((venue: Venue) => (
                            <SelectItem key={venue.id} value={venue.id}>
                              {venue.name}{" "}
                              {venue.location ? `(${venue.location})` : ""}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-venues" disabled>
                            No venues found
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Specific Location */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specific Location / Field</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Field B, Court 2"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Override or add detail to the venue's address (optional).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Scheduled At Date/Time */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="scheduledDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Scheduled Date*</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
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
                  name="scheduledTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Scheduled Time*</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          {...field}
                          className="w-full"
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Duration */}
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g., 90"
                        {...field}
                        min="1"
                        value={field.value ?? ""}
                        onChange={(event) =>
                          field.onChange(
                            event.target.value === ""
                              ? undefined
                              : +event.target.value
                          )
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Approximate duration in minutes (optional).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Expires At Date/Time */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="expiresAtDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Challenge Expires At (Date)</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick expiry date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => {
                              const today = new Date(
                                new Date().setHours(0, 0, 0, 0)
                              );
                              const schedDate = form.getValues("scheduledDate");
                              if (schedDate) {
                                return date < today || date >= schedDate;
                              }
                              return date < today;
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>(Optional)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expiresAtTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expires At (Time)</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          {...field}
                          className="w-full"
                          value={field.value || ""}
                          disabled={!form.watch("expiresAtDate")}
                        />
                      </FormControl>
                      <FormDescription>(Required if date set)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Sender Team */}
              <FormField
                control={form.control}
                name="senderTeamId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Team*</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      // Use status for disabled check
                      disabled={teamsStatus === "loading"}
                    >
                      <FormControl>
                        <SelectTrigger>
                          {/* Use status for placeholder */}
                          <SelectValue
                            placeholder={
                              teamsStatus === "loading"
                                ? "Loading teams..."
                                : "Select your team"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* Use status for conditional rendering */}
                        {teamsStatus === "loading" ? (
                          <SelectItem value="loading" disabled>
                            Loading...
                          </SelectItem>
                        ) : teams?.length > 0 ? (
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
                    <FormDescription>
                      The team issuing the challenge.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Receiver Team */}
              <FormField
                control={form.control}
                name="receiverTeamId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opponent Team</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value || "open"} // Default to "open" if undefined/null
                      // Use status for disabled check
                      disabled={
                        teamsStatus === "loading" || !form.watch("senderTeamId")
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          {/* Use status for placeholder */}
                          <SelectValue
                            placeholder={
                              teamsStatus === "loading"
                                ? "Loading teams..."
                                : !form.watch("senderTeamId")
                                ? "Select your team first"
                                : "Select opponent (or leave for Open Challenge)"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* Use status for conditional rendering */}
                        <SelectItem value="open">
                          -- Open Challenge (Any Team) --
                        </SelectItem>
                        {teamsStatus !== "loading" &&
                          teams?.length > 0 &&
                          teams
                            .filter(
                              (team) => team.id !== form.watch("senderTeamId")
                            )
                            .map((team) => (
                              <SelectItem key={team.id} value={team.id}>
                                {team.name}
                              </SelectItem>
                            ))}
                        {teamsStatus === "loading" && (
                          <SelectItem value="loading" disabled>
                            Loading...
                          </SelectItem>
                        )}
                        {teamsStatus !== "loading" &&
                          teams?.length <= 1 &&
                          form.watch("senderTeamId") && (
                            <SelectItem value="no-opponents" disabled>
                              No other teams available
                            </SelectItem>
                          )}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select a specific opponent or choose Open Challenge.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* --- Actions --- */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate("/challenges")}
              disabled={isLoading} // Use combined loading state
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading} // Use combined loading state
            >
              {/* Only challenge creation uses boolean loading flag */}
              {isChallengeLoading ? "Creating..." : "Create Challenge"}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
