import { useEffect, useState, useCallback, useMemo, useRef } from "react"; // Import useRef
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchTeams } from "@/redux/features/teams/teamThunks";
import { fetchGames } from "@/redux/features/game/gameThunks";
import type { Game } from "@/redux/features/game/gameTypes";
import type { AppDispatch, RootState } from "@/redux/store";
import TeamCard from "./TeamCard";
import { debounce } from "lodash-es";

export default function TeamsList() {
  const router = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { teams, status: teamsStatus, error: teamsError } = useSelector((state: RootState) => state.teams);
  const { games, status: gamesStatus } = useSelector((state: RootState) => state.games);

  // Local loading state to prevent flash effects
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [hasInitialFetched, setHasInitialFetched] = useState(false);

  const [filters, setFilters] = useState({
    name: "",
    sport: "all",
    level: "all",
  });

  // Ref to track if the filter effect has run its initial execution after data fetch
  const isInitialFilterEffectRun = useRef(true); // <-- Add this Ref

  // Initial data fetch - happens only once (or twice in Strict Mode dev)
  useEffect(() => {
    const fetchInitialData = async () => {
      // Only fetch if we haven't successfully fetched before IN THIS MOUNT CYCLE
      // Note: hasInitialFetched will reset on Strict Mode remount, triggering this again
      if (!hasInitialFetched) {
        console.log("EFFECT 1: Fetching initial data..."); // For debugging
        setIsInitialLoading(true);

        // Dispatch both API calls in parallel
        await Promise.all([
          dispatch(fetchTeams({})),
          dispatch(fetchGames())
        ]);

        setHasInitialFetched(true); // Mark initial fetch as done for this mount cycle
        setIsInitialLoading(false);
        isInitialFilterEffectRun.current = true; // Reset the filter effect flag on new initial fetch
      }
    };

    fetchInitialData();
    // No cleanup needed here that would cancel the fetch,
    // as we want it to complete even if Strict Mode unmounts briefly.
  }, [dispatch, hasInitialFetched]); // Dependency array is correct

  // Handle filter changes with debounce
  const debouncedFetchTeams = useCallback(
    debounce((filterParams) => {
      const cleanedFilters = Object.fromEntries(
        Object.entries(filterParams)
          .filter(([_, v]) => v !== "" && v !== "all")
      );

      console.log("DEBOUNCED FETCH: Fetching teams with filters:", cleanedFilters); // For debugging
      setIsFilterLoading(true);
      dispatch(fetchTeams(cleanedFilters))
        .finally(() => setIsFilterLoading(false));
    }, 500),
    [dispatch]
  );

  // Effect for filter changes
  useEffect(() => {
    // Only run this effect AFTER the initial data has been fetched
    if (hasInitialFetched) {
      console.log("EFFECT 2: Filter effect triggered. isInitialFilterEffectRun:", isInitialFilterEffectRun.current); // For debugging

      // Check if this is the FIRST run of this effect after the initial data fetch completed
      if (isInitialFilterEffectRun.current) {
          console.log("EFFECT 2: Skipping fetch on initial filter effect run."); // For debugging
          isInitialFilterEffectRun.current = false; // Mark the initial run as completed
          return; // Exit without fetching
      }

      // If it's NOT the initial run (meaning filters actually changed), then fetch.
      console.log("EFFECT 2: Filters changed, calling debouncedFetchTeams."); // For debugging
      debouncedFetchTeams(filters);
    }

    // Cleanup function for the debounce
    return () => {
        console.log("EFFECT 2: Cancelling debounced fetch."); // For debugging
        debouncedFetchTeams.cancel();
    }
    // This effect should run when filters change OR after initial fetch completes
  }, [filters, debouncedFetchTeams, hasInitialFetched]);


  const handleCreateTeam = useCallback(() => {
    router("/teams/create");
  }, [router]);

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const availableSports = useMemo(() => {
    if (!games || games.length === 0) return [];
    return [...new Set(games.map((game: Game) => game.name))]
      .sort((a, b) => a.localeCompare(b));
  }, [games]);

  // Client-side filtering (consider if this is needed if the API filters)
  // If fetchTeams already returns filtered results based on `cleanedFilters`,
  // you might not need this extensive client-side filtering.
  // However, keeping it allows immediate UI feedback for "name" filter changes
  // before the debounce triggers the API call. Decide based on desired UX.
  const filteredTeams = useMemo(() => {
    if (!teams || teams.length === 0) return [];

    // If API handles filtering, just return teams directly.
    // return teams;

    // If you keep client-side filtering:
    return teams.filter(team => {
      const nameMatch = !filters.name ||
        team.name.toLowerCase().includes(filters.name.toLowerCase());
      // Note: API fetch uses cleanedFilters (no 'all'), client filter uses raw filters ('all')
      const sportMatch = filters.sport === "all" ||
        team.sport?.toLowerCase() === filters.sport.toLowerCase();
      const levelMatch = filters.level === "all" ||
        team.level === filters.level;
      return nameMatch && sportMatch && levelMatch;
    });
  }, [teams, filters]);

  // Consolidated loading state
  const isLoading = isInitialLoading || (isFilterLoading && !teams.length); // Show skeleton only on initial or if filtering empties list
  const isEmpty = !isLoading && teamsStatus === "succeeded" && filteredTeams.length === 0;
  const isError = !isLoading && teamsStatus === "failed";

  // --- Memoized components remain the same ---
  const FilterControls = useMemo(() => (
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search teams..."
          className="pl-10"
          value={filters.name}
          onChange={(e) => handleFilterChange("name", e.target.value)}
          disabled={isInitialLoading} // Use isInitialLoading for disabling during initial setup
        />
      </div>
      <div className="grid grid-cols-2 gap-2 sm:flex">
        <Select
          value={filters.sport}
          onValueChange={(value) => handleFilterChange("sport", value)}
          disabled={isInitialLoading || !games.length} // Disable if initial loading or no games data yet
        >
          <SelectTrigger className="min-w-[150px]">
            <SelectValue placeholder="All Sports" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sports</SelectItem>
            {availableSports.map((sport) => (
              <SelectItem key={sport} value={sport} className="capitalize">
                {sport}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filters.level}
          onValueChange={(value) => handleFilterChange("level", value)}
          disabled={isInitialLoading} // Use isInitialLoading
        >
          <SelectTrigger className="min-w-[150px]">
            <SelectValue placeholder="All Levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  ), [filters, availableSports, games, handleFilterChange, isInitialLoading]);

  const SkeletonLoader = useMemo(() => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array(6).fill(0).map((_, i) => (
        <Card key={i} className="h-full">
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  ), []);

  const ErrorState = useMemo(() => (
    <Card className="border-destructive/30 bg-destructive/5">
      <CardHeader>
        <CardTitle>Error Loading Teams</CardTitle>
        <CardDescription>
          {teamsError?.toString() || "Failed to load teams"}
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button
          variant="outline"
          onClick={() => {
            // Trigger a fresh initial fetch sequence
            setHasInitialFetched(false); // Resetting this will trigger the first useEffect again
            // setIsInitialLoading(true); // The first useEffect will set this
            // dispatch(fetchTeams({})).finally(() => setIsInitialLoading(false)); // Let the first effect handle the retry
          }}
        >
          Retry
        </Button>
      </CardFooter>
    </Card>
  ), [teamsError, dispatch]); // Keep dispatch here if needed elsewhere, but retry logic changed

  const EmptyState = useMemo(() => (
    <Card className="text-center">
      <CardHeader>
        <CardTitle>No Teams Found</CardTitle>
        <CardDescription>
          {Object.values(filters).some(v => v && v !== "all")
            ? "Try adjusting your filters"
            : "Create the first team!"}
        </CardDescription>
      </CardHeader>
      <CardFooter className="justify-center">
        <Button onClick={handleCreateTeam}>
          <Plus className="mr-2 h-4 w-4" />
          Create Team
        </Button>
      </CardFooter>
    </Card>
  ), [filters, handleCreateTeam]);

  const TeamGrid = useMemo(() => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {isFilterLoading && teams.length > 0 ? ( // Show filter loader only if teams already exist
        <div className="col-span-full py-4 text-center text-muted-foreground">
          Updating results...
        </div>
      ) : (
        filteredTeams.map(team => (
          <TeamCard key={team.id} team={team} />
        ))
      )}
    </div>
    // Adjust dependency based on whether you use client-side filtering or not
  ), [filteredTeams, isFilterLoading, teams.length]); // Added teams.length dependency

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Teams</h1>
          <p className="text-muted-foreground">Manage your sports teams</p>
        </div>
        <Button
          onClick={handleCreateTeam}
          className="w-full sm:w-auto"
          disabled={isInitialLoading} // Use isInitialLoading
        >
          <Plus className="mr-2 h-4 w-4" />
          New Team
        </Button>
      </div>

      {FilterControls}

      {/* Conditional Rendering Logic */}
      {isLoading && SkeletonLoader} {/* Show skeleton on initial load OR when filter loading clears teams */}
      {isError && ErrorState} {/* Show error if fetch failed */}
      {isEmpty && EmptyState} {/* Show empty state if fetch succeeded but no teams match */}
      {!isLoading && !isError && !isEmpty && TeamGrid} {/* Show grid if loaded, no error, and not empty */}
    </div>
  );
}