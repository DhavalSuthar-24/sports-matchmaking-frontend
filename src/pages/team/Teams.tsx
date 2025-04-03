import { useEffect, useState, useCallback, useMemo } from "react";
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
import toast from "react-hot-toast";

export default function TeamsList() {
  const router = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { teams, status: teamsStatus, error: teamsError } = useSelector((state: RootState) => state.teams);
  const { games, status: gamesStatus } = useSelector((state: RootState) => state.games);

  const [filters, setFilters] = useState({
    name: "",
    sport: "all",
    level: "all",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      const cleanedFilters = Object.fromEntries(
        Object.entries(filters)
          .filter(([key, v]) => v !== "" && v !== "all" && key !== 'sport')
      );
      dispatch(fetchTeams(cleanedFilters));
    }, 500);

    return () => clearTimeout(timer);
  }, [dispatch, filters.name, filters.level]);

  useEffect(() => {

      dispatch(fetchGames());
    
  }, []);

  const handleCreateTeam = useCallback(() => {
    router("/teams/create");
  }, [router]);

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const availableSports = useMemo(() => {
    if (gamesStatus !== 'succeeded' || !games) return [];
    const sportNames = games.map((game: Game) => game.name);
    return [...new Set(sportNames)].sort((a, b) => a.localeCompare(b));
  }, [games, gamesStatus]);

  const filteredTeams = useMemo(() => {
    if (teamsStatus !== "succeeded") return [];
    return teams.filter(team => {
      const nameMatch = !filters.name || team.name.toLowerCase().includes(filters.name.toLowerCase());
      const sportMatch = filters.sport === "all" || team.sport?.toLowerCase() === filters.sport.toLowerCase();
      const levelMatch = filters.level === "all" || team.level === filters.level;
      return nameMatch && sportMatch && levelMatch;
    });
  }, [teams, teamsStatus, filters.name, filters.sport, filters.level]);

  const isLoading = teamsStatus === 'loading' || gamesStatus === 'loading';

  const renderSkeletons = useMemo(() => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="overflow-hidden h-full">
           <CardHeader className="p-4">
             <Skeleton className="h-6 w-3/4 mb-2" />
             <Skeleton className="h-4 w-1/2" />
           </CardHeader>
           <CardContent className="p-4">
             <Skeleton className="h-4 w-full mb-2" />
             <Skeleton className="h-4 w-5/6" />
           </CardContent>
           <CardFooter className="p-4">
             <Skeleton className="h-9 w-full" />
           </CardFooter>
        </Card>
      ))}
    </div>
  ), []);

  const renderError = useMemo(() => {
    const getErrorMessage = (err: any): string => {
      if (typeof err === 'object' && err !== null && err.message) {
        return err.message;
      }
      if (typeof err === 'string') {
        return err;
      }
      return "An unexpected error occurred loading teams. Please try again.";
    };

    return (
      <Card className="bg-destructive/10 border-destructive/30">
        <CardHeader>
          <CardTitle>Error Loading Teams</CardTitle>
          <CardDescription>
            {getErrorMessage(teamsError)}
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" onClick={() => dispatch(fetchTeams({}))}>
            Retry Fetching Teams
          </Button>
        </CardFooter>
      </Card>
    )
  }, [teamsError, dispatch]);

  const renderEmpty = useMemo(() => (
    <Card className="text-center">
      <CardHeader>
        <CardTitle>No Teams Found</CardTitle>
        <CardDescription>
          {Object.values(filters).some((v) => v !== "" && v !== "all")
            ? "No teams match your current filters. Try adjusting your search criteria."
            : "No teams available. Create the first one!"}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-center">
        <Button onClick={handleCreateTeam}>
          <Plus className="mr-2 h-4 w-4" />
          Create Team
        </Button>
      </CardFooter>
    </Card>
  ), [filters, handleCreateTeam]);

  const renderTeams = useMemo(() => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredTeams.map((team) => (
        <TeamCard key={team.id} team={team} />
      ))}
    </div>
  ), [filteredTeams]);

  return (
    <div className="space-y-6 m-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Teams</h1>
          <p className="text-muted-foreground">Browse and manage your teams</p>
        </div>
        <Button onClick={handleCreateTeam} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Create Team
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search teams by name..."
            className="pl-8"
            value={filters.name}
            onChange={(e) => handleFilterChange("name", e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 sm:flex gap-2">
          <Select
            value={filters.sport}
            onValueChange={(value) => handleFilterChange("sport", value)}
            disabled={gamesStatus === 'loading' && availableSports.length === 0}
           >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Sports" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sports</SelectItem>
              {gamesStatus === 'loading' && availableSports.length === 0 && (
                 <SelectItem value="loading-sports" disabled>Loading sports...</SelectItem>
              )}
              {availableSports.map((sport) => (
                <SelectItem key={sport} value={sport} className="capitalize">
                  {sport}
                </SelectItem>
              ))}
              {gamesStatus === 'succeeded' && availableSports.length === 0 && (
                 <SelectItem value="no-sports" disabled>No sports found</SelectItem>
              )}
            </SelectContent>
          </Select>
          <Select value={filters.level} onValueChange={(value) => handleFilterChange("level", value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading && renderSkeletons}
      {!isLoading && teamsStatus === "failed" && renderError}
      {!isLoading && teamsStatus === "succeeded" && filteredTeams.length === 0 && renderEmpty}
      {!isLoading && teamsStatus === "succeeded" && filteredTeams.length > 0 && renderTeams}
    </div>
  );
}