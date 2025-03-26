"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Plus, Filter, Search, Trophy } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchChallenges, acceptChallenge } from "@/redux/features/challenge/challengeThunks"
import { AppDispatch, RootState } from "@/redux/store"
import ChallengeCard from "./challageCard"
import toast from "react-hot-toast"
import { Challenge } from "@/redux/features/challenge/challengeTypes"

export default function ChallengesList() {
  const router = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const { challenges, status, error } = useSelector((state: RootState) => state.challenges)
  const { teams } = useSelector((state: RootState) => state.teams)
  
  const [filters, setFilters] = useState({
    sport: "",
    status: "",
    teamId: ""
  })
  
  const [activeTab, setActiveTab] = useState("all")
  
  useEffect(() => {
    dispatch(fetchChallenges({}))
  }, [dispatch])
  
  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    
    // Remove empty filters before dispatching
    const cleanedFilters = Object.fromEntries(
      Object.entries(newFilters).filter(([_, v]) => v !== "")
    )
    
    dispatch(fetchChallenges(cleanedFilters))
  }
  
  const handleCreateChallenge = () => {
    router("/challenges/create")
  }
  
  const handleacceptChallenge = async (challengeId: string) => {
    if (!teams || teams.length === 0) {
      toast( "You need to create or join a team before accepting challenges.")
      return
    }
    
    // For simplicity, we're using the first team. In a real app, you'd show a team selector
    const teamId = teams[0].id
    
    try {
      const resultAction = await dispatch(acceptChallenge({ challengeId, teamId }))
      if (acceptChallenge.fulfilled.match(resultAction)) {
        toast(
       "You have successfully accepted the challenge.")
      } else {
        toast(
          resultAction.error.message || "Something went wrong. Please try again.")
      }
    } catch (err) {
      toast( "An unexpected error occurred."
     )
    }
  }
  
  const filteredChallenges = challenges.filter(challenge => {
    if (activeTab === "all") return true
    if (activeTab === "open") return challenge.status === "OPEN"
    if (activeTab === "accepted") return challenge.status === "ACCEPTED"
    if (activeTab === "completed") return challenge.status === "COMPLETED"
    return true
  })
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Challenges</h1>
          <p className="text-muted-foreground">Browse and manage team challenges</p>
        </div>
        <Button onClick={handleCreateChallenge}>
          <Plus className="mr-2 h-4 w-4" />
          Create Challenge
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search challenges..."
            className="pl-8"
          />
        </div>
        <Select
          value={filters.sport}
          onValueChange={(value) => handleFilterChange("sport", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sport" />
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
          value={filters.status}
          onValueChange={(value) => handleFilterChange("status", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="OPEN">Open</SelectItem>
            <SelectItem value="ACCEPTED">Accepted</SelectItem>
            <SelectItem value="DECLINED">Declined</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          {status === "loading" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="overflow-hidden">
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
          )}

          {status === "failed" && (
            <Card className="bg-destructive/10">
              <CardHeader>
                <CardTitle>Error Loading Challenges</CardTitle>
                <CardDescription>
                  {error?.message || "There was an error loading the challenges. Please try again."}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant="outline" onClick={() => dispatch(fetchChallenges({}))}>
                  Retry
                </Button>
              </CardFooter>
            </Card>
          )}

          {status === "succeeded" && filteredChallenges.length === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>No Challenges Found</CardTitle>
                <CardDescription>
                  {Object.values(filters).some(v => v !== "") 
                    ? "No challenges match your current filters. Try adjusting your search criteria."
                    : "There are no challenges available at the moment."}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center py-6">
                <Trophy className="h-16 w-16 text-muted-foreground/30" />
              </CardContent>
              <CardFooter>
                <Button onClick={handleCreateChallenge} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Challenge
                </Button>
              </CardFooter>
            </Card>
          )}

          {status === "succeeded" && filteredChallenges.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChallenges.map((challenge:Challenge) => (
                <ChallengeCard 
                  key={challenge.id} 
                  challenge={challenge} 
                  onAccept={handleacceptChallenge}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
