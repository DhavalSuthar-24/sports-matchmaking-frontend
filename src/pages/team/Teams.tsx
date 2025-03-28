import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Search, Trophy, BarChart2, Users, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchTeams } from "@/redux/features/teams/teamThunks";
import type { AppDispatch, RootState } from "@/redux/store";
import TeamCard from "./TeamCard";

const sports = [
  "football", "basketball", "volleyball", "tennis", "cricket", 
  "hockey", "baseball", "rugby", "badminton", "table-tennis"
];

export default function TeamsList() {
  const router = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { teams, status, error } = useSelector((state: RootState) => state.teams);

  const [filters, setFilters] = useState({
    name: "",
    sport: "all",
    level: "all",
  });

  // Debounce filter changes to prevent excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      const cleanedFilters = Object.fromEntries(
        Object.entries(filters)
          .filter(([_, v]) => v !== "" && v !== "all")
      );
      dispatch(fetchTeams(cleanedFilters));
    }, 500);

    return () => clearTimeout(timer);
  }, [dispatch, filters]);

  const handleCreateTeam = useCallback(() => {
    router("/teams/create");
  }, [router]);

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const filteredTeams = useMemo(() => {
    if (status !== "succeeded") return [];
    return teams.filter(team => {
      const nameMatch = team.name.toLowerCase().includes(filters.name.toLowerCase());
      const sportMatch = filters.sport === "all" || team.sport === filters.sport;
      const levelMatch = filters.level === "all" || team.level === filters.level;
      return nameMatch && sportMatch && levelMatch;
    });
  }, [teams, status, filters]);

  const renderSkeletons = useMemo(() => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="overflow-hidden h-full">
          <CardHeader className="pb-0">
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full mt-4" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  ), []);

  const renderError = useMemo(() => (
    <Card className="bg-destructive/10 border-destructive/30">
      <CardHeader>
        <CardTitle>Error Loading Teams</CardTitle>
        <CardDescription>
          {error || "There was an error loading the teams. Please try again."}
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button variant="outline" onClick={() => dispatch(fetchTeams({}))}>
          Retry
        </Button>
      </CardFooter>
    </Card>
  ), [error, dispatch]);

  const renderEmpty = useMemo(() => (
    <Card className="text-center">
      <CardHeader>
        <CardTitle>No Teams Found</CardTitle>
        <CardDescription>
          {Object.values(filters).some((v) => v !== "" && v !== "all")
            ? "No teams match your current filters. Try adjusting your search criteria."
            : "You don't have any teams yet. Create your first team to get started."}
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
            placeholder="Search teams..."
            className="pl-8"
            value={filters.name}
            onChange={(e) => handleFilterChange("name", e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 sm:flex gap-2">
          <Select value={filters.sport} onValueChange={(value) => handleFilterChange("sport", value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Sports" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sports</SelectItem>
              {sports.map((sport) => (
                <SelectItem key={sport} value={sport} className="capitalize">
                  {sport}
                </SelectItem>
              ))}
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

      {status === "loading" && renderSkeletons}
      {status === "failed" && renderError}
      {status === "succeeded" && filteredTeams.length === 0 && renderEmpty}
      {status === "succeeded" && filteredTeams.length > 0 && renderTeams}
    </div>
  );
}