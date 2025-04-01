// src/pages/challenge/Challenges.tsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Plus,
  // Filter - removed unused import
  Search,
  Trophy,
  // ChevronLeft - removed unused import
  // ChevronRight - removed unused import
} from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
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
import type {
  Challenge,
  // Team - removed unused import
  AcceptTeamChallengeRequest,
  ChallengeStatus, // Added this type to fix comparison issue
} from "@/redux/features/challenge/challengeTypes";

// Define the FetchChallengesParams interface here instead of importing
export interface FetchChallengesParams {
  sport?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
  [key: string]: string | number | undefined;
}

// Define or extend ChallengeState to include pagination properties
interface ExtendedChallengeState {
  challenges: Challenge[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

// Import thunks
import {
  getAllChallenges,
  expireChallenge,
  withdrawTeamChallenge,
  declineChallenge,
  acceptTeamChallenge,
} from "@/redux/features/challenge/challengeThunks";

// Import challenge card component
import ChallengeCard from "./ChallengeCard";

export default function ChallengesList() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Select state from Redux store with properly typed state
  const {
    challenges,
    loading,
    error,
    currentPage = 1,
    totalPages = 1,
    totalCount = 0,
  } = useSelector((state: RootState) => state.challenges as unknown as ExtendedChallengeState);

  const { teams } = useSelector((state: RootState) => state.teams);
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  const [filters, setFilters] = useState<FetchChallengesParams>({
    sport: "",
    status: "",
    search: "",
    page: 1,
    limit: 12,
  });

  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAccepting, setIsAccepting] = useState<string | null>(null);
  const [isDeclining, setIsDeclining] = useState<string | null>(null);

  // Map Redux loading state to component's 'status' concept
  const status = loading ? "loading" : error ? "failed" : "succeeded";

  // Debounced search function with proper dependency array
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setFilters((prev) => ({
        ...prev,
        search: term,
        page: 1,
      }));
    }, 500),
    [] // Empty dependency array since we don't need external dependencies
  );

  // Fetch challenges when filters change
  useEffect(() => {
    // Fix type error by ensuring getAllChallenges accepts FetchChallengesParams
    dispatch(getAllChallenges(filters));
  }, [dispatch, filters]);

  // Handle filter changes
  const handleFilterChange = (
    key: keyof Omit<FetchChallengesParams, 'search' | 'page'>,
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

  // Navigate to create challenge page
  const handleCreateChallenge = () => {
    navigate("/challenges/create");
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

  // Handle accepting a challenge
  const handleAcceptChallenge = async (challengeId: string) => {
    const userTeam = teams && teams.length > 0 ? teams[0] : null;

    if (!userTeam) {
      toast.error("You must be part of a team to accept a challenge.");
      console.error("Accept challenge failed: User has no teams associated.");
      return;
    }

    setIsAccepting(challengeId);
    try {
      const acceptData: AcceptTeamChallengeRequest = { teamId: userTeam.id };
      const resultAction = await dispatch(
        acceptTeamChallenge({
          challengeId,
          data: acceptData,
        })
      );

      if (acceptTeamChallenge.fulfilled.match(resultAction)) {
        toast.success("Challenge accepted successfully!");
        dispatch(getAllChallenges(filters));
      } else {
        const errorMessage = (resultAction.payload as any)?.message || "Failed to accept challenge";
        toast.error(errorMessage);
        console.error("Accept challenge failed:", resultAction.payload);
      }
    } catch (err: any) {
      toast.error("An unexpected error occurred while accepting.");
      console.error("Accept challenge unexpected error:", err);
    } finally {
      setIsAccepting(null);
    }
  };

  // Handle declining a challenge
  const handleDeclineChallenge = async (challengeId: string) => {
    setIsDeclining(challengeId);
    try {
      const resultAction = await dispatch(declineChallenge(challengeId));

      if (declineChallenge.fulfilled.match(resultAction)) {
        toast.success("Challenge declined");
        dispatch(getAllChallenges(filters));
      } else {
        const errorMessage = (resultAction.payload as any)?.message || "Failed to decline challenge";
        toast.error(errorMessage);
        console.error("Decline challenge failed:", resultAction.payload);
      }
    } catch (err: any) {
      toast.error("An unexpected error occurred while declining.");
      console.error("Decline challenge unexpected error:", err);
    } finally {
      setIsDeclining(null);
    }
  };

  // Handle withdrawing a challenge
  const handleWithdrawChallenge = async (challengeId: string) => {
    try {
      const resultAction = await dispatch(withdrawTeamChallenge(challengeId));

      if (withdrawTeamChallenge.fulfilled.match(resultAction)) {
        toast.success("Challenge withdrawn");
        dispatch(getAllChallenges(filters));
      } else {
        const errorMessage = (resultAction.payload as any)?.message || "Failed to withdraw challenge";
        toast.error(errorMessage);
        console.error("Withdraw challenge failed:", resultAction.payload);
      }
    } catch (err: any) {
      toast.error("An unexpected error occurred while withdrawing.");
      console.error("Withdraw challenge unexpected error:", err);
    }
  };

  // Handle expiring a challenge
  const handleExpireChallenge = async (challengeId: string) => {
    try {
      const resultAction = await dispatch(expireChallenge(challengeId));

      if (expireChallenge.fulfilled.match(resultAction)) {
        toast.success("Challenge expired");
        dispatch(getAllChallenges(filters));
      } else {
        const errorMessage = (resultAction.payload as any)?.message || "Failed to expire challenge";
        toast.error(errorMessage);
        console.error("Expire challenge failed:", resultAction.payload);
      }
    } catch (err: any) {
      toast.error("An unexpected error occurred while expiring.");
      console.error("Expire challenge unexpected error:", err);
    }
  };

  // Filter challenges based on the active tab - fix the comparison issue
  const filteredChallenges = challenges.filter((challenge: Challenge) => {
    if (activeTab === "all") return true;
    if (activeTab === "open") return challenge.status === "OPEN" as ChallengeStatus;
    if (activeTab === "accepted") return challenge.status === "ACCEPTED" as ChallengeStatus;
    if (activeTab === "completed") return challenge.status === "COMPLETED" as ChallengeStatus;
    return true;
  });

  const getEmptyStateMessage = () => {
    const filtersActive = filters.search || filters.sport || filters.status;

    if (status !== 'loading' && filtersActive && filteredChallenges.length === 0) {
      return "No challenges match your current filters. Try adjusting your search or filter criteria.";
    }

    if (status !== 'loading' && !filtersActive && filteredChallenges.length === 0) {
      switch (activeTab) {
        case "open":
          return "There are currently no open challenges matching your criteria.";
        case "accepted":
          return "You haven't accepted any challenges yet, or none match your criteria.";
        case "completed":
          return "No completed challenges found matching your criteria.";
        default:
          return "There are no challenges available at the moment. Why not create one?";
      }
    }

    return "Loading challenges or no challenges found.";
  };

  // Display global error message if fetch failed
  useEffect(() => {
    if (status === 'failed' && error) {
      toast.error(`Error fetching challenges: ${error}`);
    }
  }, [status, error]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Challenges
            </h1>
            <p className="text-sm text-muted-foreground">
              {totalCount > 0
                ? `${totalCount} total challenges found`
                : "Browse and manage team challenges"}
            </p>
          </div>
          <Button onClick={handleCreateChallenge} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Create Challenge
          </Button>
        </div>

        {/* Filters Section */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search challenges (e.g., team name, sport)..."
              className="pl-9"
              value={searchTerm}
              onChange={handleSearchChange}
              aria-label="Search challenges"
            />
          </div>

          <div className="flex gap-3 flex-wrap sm:flex-nowrap">
            <Select
              value={filters.sport || "all"}
              onValueChange={(value) => handleFilterChange("sport", value)}
            >
              <SelectTrigger className="w-full sm:w-[150px]" aria-label="Filter by sport">
                <SelectValue placeholder="All Sports" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sports</SelectItem>
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
              <SelectTrigger className="w-full sm:w-[150px]" aria-label="Filter by status">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="OPEN">Open</SelectItem>
                <SelectItem value="ACCEPTED">Accepted</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="DECLINED">Declined</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="EXPIRED">Expired</SelectItem>
                <SelectItem value="WITHDRAWN">Withdrawn</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Main Content - Tabs and Challenge List */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="all">
              All
              {totalCount > 0 && (
                <Badge variant="secondary" className="ml-2 px-1.5 py-0.5 text-xs hidden sm:inline-block">
                  {totalCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="accepted">Accepted</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {/* Loading State */}
            {status === "loading" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: filters.limit || 8 }).map((_, i) => (
                  <Card key={`skeleton-${i}`} className="h-full">
                    <CardHeader className="pb-3">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <div className="flex gap-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Skeleton className="h-9 w-24" />
                      <Skeleton className="h-9 w-24" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}

            {/* Error State */}
            {status === 'failed' && error && (
              <Card className="text-center border-destructive">
                <CardHeader>
                  <CardTitle className="text-destructive">Error Loading Challenges</CardTitle>
                  <CardDescription>{error?.message || 'Could not fetch challenges. Please try again later.'}</CardDescription>
                </CardHeader>
              </Card>
            )}

            {/* Empty State */}
            {status !== "loading" && filteredChallenges.length === 0 && (
              <Card className="text-center">
                <CardHeader>
                  <CardTitle>No Challenges Found</CardTitle>
                  <CardDescription>{getEmptyStateMessage()}</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center py-6">
                  <Trophy className="h-16 w-16 text-muted-foreground/30" />
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button onClick={handleCreateChallenge}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Challenge
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/* Success State - Display Challenges */}
            {status !== "loading" && filteredChallenges.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredChallenges.map((challenge: Challenge) => (
                    <ChallengeCard
                      key={challenge.id}
                      challenge={challenge}
                      userId={userId}
                      onAccept={handleAcceptChallenge}
                      onDecline={handleDeclineChallenge}
                      onWithdraw={handleWithdrawChallenge}
                      onExpire={handleExpireChallenge}
                      isAccepting={isAccepting === challenge.id}
                      isDeclining={isDeclining === challenge.id}
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
                            tabIndex={currentPage >= totalPages ? -1 : undefined}
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