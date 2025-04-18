// src/pages/matches/Matches.tsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Search, Calendar } from "lucide-react";
import debounce from "lodash.debounce";
import toast from "react-hot-toast";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Redux Store and Types
import type { AppDispatch, RootState } from "@/redux/store";
import type { Match, MatchStatus } from "@/redux/features/match/matchTypes";

// Import thunks
import { getAllMatches } from "@/redux/features/match/matchThunks";

// Import match card component
import MatchCard from "./components/MatchCard";


// Define the FetchMatchesParams interface
export interface FetchMatchesParams {
  game?: string;
  status?: string;
  type?: string;
  search?: string;
  page?: number;
  limit?: number;
  [key: string]: string | number | undefined;
}

// Define or extend MatchState to include pagination properties
interface ExtendedMatchState {
  matches: Match[];
  currentMatch: Match | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export default function MatchesList() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Select state from Redux store with properly typed state
  const {
    matches,
    loading,
    error,
    currentPage = 1,
    totalPages = 1,
    totalCount = 0,
  } = useSelector(
    (state: RootState) => state.matches as unknown as ExtendedMatchState
  );

  const userId = useSelector((state: RootState) => state.auth.user?.id);

  const [filters, setFilters] = useState<FetchMatchesParams>({
    game: "",
    status: "",
    type: "",
    search: "",
    page: 1,
    limit: 12,
  });

  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);

  // Map Redux loading state to component's 'status' concept
  const status = loading ? "loading" : error ? "failed" : "succeeded";

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setFilters((prev) => ({
        ...prev,
        search: term,
        page: 1,
      }));
    }, 500),
    []
  );

  // Fetch matches when filters change
  useEffect(() => {
    dispatch(getAllMatches(filters));
  }, [dispatch, filters]);

  // Handle filter changes
  const handleFilterChange = (
    key: keyof Omit<FetchMatchesParams, "search" | "page">,
    value: string
  ) => {
    const processedValue = value === "all" ? "" : value;
    setFilters((prev) => ({
      ...prev,
      [key]: processedValue,
      page: 1,
    }));
  };

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  // Navigate to create match page
  const handleCreateMatch = () => {
    navigate("/matches/create");
  };

  // Handle page navigation
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setFilters((prev) => ({
        ...prev,
        page: newPage,
      }));
    }
  };

  // Placeholder function for updating match status
  const handleUpdateMatchStatus = async (matchId: string) => {
    setIsUpdatingStatus(matchId);
    try {
      // Implement your status update logic here
      // await dispatch(updateMatchStatus({ matchId, newStatus }));
      toast.success("Match status updated successfully");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to update match status");
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  // Filter matches based on the active tab
  const filteredMatches = matches.filter((match: Match) => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return match.status === ("PENDING" as MatchStatus);
    if (activeTab === "ongoing") return match.status === ("ONGOING" as MatchStatus);
    if (activeTab === "completed") return match.status === ("COMPLETED" as MatchStatus);
    return true;
  });

  const getEmptyStateMessage = () => {
    const filtersActive = filters.search || filters.game || filters.status || filters.type;

    if (status !== "loading" && filtersActive && filteredMatches.length === 0) {
      return "No matches match your current filters. Try adjusting your search or filter criteria.";
    }

    if (status !== "loading" && !filtersActive && filteredMatches.length === 0) {
      switch (activeTab) {
        case "pending":
          return "There are currently no pending matches matching your criteria.";
        case "ongoing":
          return "There are no ongoing matches matching your criteria.";
        case "completed":
          return "No completed matches found matching your criteria.";
        default:
          return "There are no matches available at the moment. Why not create one?";
      }
    }

    return "Loading matches or no matches found.";
  };

  // Display global error message if fetch failed
  useEffect(() => {
    if (status === "failed" && error) {
      toast.error(`Error fetching matches: ${error}`);
    }
  }, [status, error]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Matches
            </h1>
            <p className="text-sm text-muted-foreground">
              {totalCount > 0
                ? `${totalCount} total matches found`
                : "Browse and manage team matches"}
            </p>
          </div>
          <Button onClick={handleCreateMatch} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Create Match
          </Button>
        </div>

        {/* Filters Section */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search matches (e.g., team name, game name)..."
              className="pl-9"
              value={searchTerm}
              onChange={handleSearchChange}
              aria-label="Search matches"
            />
          </div>

          <div className="flex gap-3 flex-wrap sm:flex-nowrap">
            <Select
              value={filters.game || "all"}
              onValueChange={(value) => handleFilterChange("game", value)}
            >
              <SelectTrigger
                className="w-full sm:w-[150px]"
                aria-label="Filter by game"
              >
                <SelectValue placeholder="All Games" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Games</SelectItem>
                <SelectItem value="football">Football</SelectItem>
                <SelectItem value="basketball">Basketball</SelectItem>
                <SelectItem value="volleyball">Volleyball</SelectItem>
                <SelectItem value="tennis">Tennis</SelectItem>
                <SelectItem value="cricket">Cricket</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.status || "all"}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger
                className="w-full sm:w-[150px]"
                aria-label="Filter by status"
              >
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                <SelectItem value="ONGOING">Ongoing</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="POSTPONED">Postponed</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={filters.type || "all"}
              onValueChange={(value) => handleFilterChange("type", value)}
            >
              <SelectTrigger
                className="w-full sm:w-[150px]"
                aria-label="Filter by match type"
              >
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="FRIENDLY">Friendly</SelectItem>
                <SelectItem value="COMPETITIVE">Competitive</SelectItem>
                <SelectItem value="PRACTICE">Practice</SelectItem>
                <SelectItem value="TOURNAMENT">Tournament</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Main Content - Tabs and Match List */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="all">
              All
              {totalCount > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 px-1.5 py-0.5 text-xs hidden sm:inline-block"
                >
                  {totalCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {/* Error State */}
            {status === "failed" && error && (
              <Card className="text-center border-destructive">
                <CardHeader>
                  <CardTitle className="text-destructive">
                    Error Loading Matches
                  </CardTitle>
                  <CardDescription>
                    {error || "Could not fetch matches. Please try again later."}
                  </CardDescription>
                </CardHeader>
              </Card>
            )}

            {/* Empty State */}
            {filteredMatches.length === 0 && (
              <Card className="text-center">
                <CardHeader>
                  <CardTitle>No Matches Found</CardTitle>
                  <CardDescription>{getEmptyStateMessage()}</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center py-6">
                  <Calendar className="h-16 w-16 text-muted-foreground/30" />
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button onClick={handleCreateMatch}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Match
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/* Success State - Display Matches */}
            {filteredMatches.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredMatches.map((match: Match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      userId={userId}
                      onUpdateStatus={handleUpdateMatchStatus}
                      isUpdatingStatus={isUpdatingStatus === match.id}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => handlePageChange(currentPage - 1)}
                            aria-disabled={currentPage <= 1}
                            tabIndex={currentPage <= 1 ? -1 : undefined}
                            className={
                              currentPage <= 1
                                ? "pointer-events-none opacity-50"
                                : undefined
                            }
                          />
                        </PaginationItem>

                        <PaginationItem>
                          <div className="px-4 py-1 text-sm font-medium">
                            Page {currentPage} of {totalPages}
                          </div>
                        </PaginationItem>

                        <PaginationItem>
                          <PaginationNext
                            onClick={() => handlePageChange(currentPage + 1)}
                            aria-disabled={currentPage >= totalPages}
                            tabIndex={
                              currentPage >= totalPages ? -1 : undefined
                            }
                            className={
                              currentPage >= totalPages
                                ? "pointer-events-none opacity-50"
                                : undefined
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}