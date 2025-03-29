
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { fetchGames } from "@/redux/features/game/gameThunks";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, Loader2 } from "lucide-react";

export default function GamesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { games: allGames, status, error } = useSelector((state: RootState) => state.games);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredGames, setFilteredGames] = useState(allGames);

  // Fetch games on mount
  useEffect(() => {
    dispatch(fetchGames());
  }, [dispatch]);

  // Filter games based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredGames(allGames);
    } else {
      const filtered = allGames.filter(game =>
        game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        game.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredGames(filtered);
    }
  }, [searchTerm, allGames]);

  // Debounced search handler
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <Card key={index} className="overflow-hidden animate-pulse">
          <div className="aspect-video bg-gray-200 dark:bg-gray-700" />
          <CardHeader>
            <CardTitle>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            </CardTitle>
            <CardDescription>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mt-2" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mt-2" />
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-between gap-2">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Games</h1>
          <p className="text-muted-foreground">Browse and manage your game collection</p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link to="/games/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Game
          </Link>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search games..."
          className="pl-10"
          value={searchTerm}
          onChange={handleSearch}
          disabled={status === "loading"}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md">
          {typeof error === "string" ? error : "An error occurred while fetching games"}
        </div>
      )}

      {/* Loading State */}
      {status === "loading" && <LoadingSkeleton />}

      {/* Success State */}
      {status === "succeeded" && (
        <>
          {/* Games Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map((game) => (
              <Card key={game.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative">
                  <img
                    src={game.image || "/placeholder.svg?height=200&width=400"}
                    alt={game.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="truncate">{game.name}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {game.description || "No description available"}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="flex flex-col sm:flex-row justify-between gap-2">
                  <Button asChild variant="outline" className="w-full sm:w-auto">
                    <Link to={`/games/${game.id}`}>View Details</Link>
                  </Button>
                  <Button asChild variant="ghost" className="w-full sm:w-auto">
                    <Link to={`/games/${game.id}/edit`}>Edit</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredGames.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">
                {searchTerm ? "No matching games found" : "No games found"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm
                  ? "Try a different search term"
                  : "Get started by creating your first game"}
              </p>
              <Button asChild>
                <Link to="/games/create">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Game
                </Link>
              </Button>
            </div>
          )}
        </>
      )}

      {/* Failed State */}
      {status === "failed" && !error && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">Failed to load games</h3>
          <p className="text-muted-foreground mb-6">Please try again later</p>
          <Button onClick={() => dispatch(fetchGames())}>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Retry
          </Button>
        </div>
      )}
    </div>
  );
}
