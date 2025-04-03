import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";

// Define a basic Team type based on usage
interface SimpleTeam {
  id: string;
  name: string;
}

interface RequestJoinChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { teamId: string; message?: string }) => Promise<void>; // Make async for loading state
  userTeams: SimpleTeam[] | undefined;
  challengeTitle?: string; // Optional: To display in the modal
  isLoading?: boolean; // To disable submit button during request
}

export default function RequestJoinChallengeModal({
  isOpen,
  onClose,
  onSubmit,
  userTeams = [], // Default to empty array
  challengeTitle,
  isLoading = false,
}: RequestJoinChallengeModalProps) {
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  // Reset state when modal opens or teams change
  useEffect(() => {
    if (isOpen) {
      // Pre-select the first team if available and only one exists
      if (userTeams.length === 1) {
        setSelectedTeamId(userTeams[0].id);
      } else {
        setSelectedTeamId(""); // Reset if multiple teams or no teams
      }
      setMessage(""); // Reset message
    }
  }, [isOpen, userTeams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeamId) {
      toast.error("Please select a team.");
      return;
    }
    if (isLoading) return; // Prevent multiple submissions

    try {
      await onSubmit({
        teamId: selectedTeamId,
        message: message || undefined, // Send undefined if empty
      });
      // Let the parent component handle closing on success
    } catch (error) {
      // Error handling might be done in the parent, but basic feedback here is good
      console.error("Modal submit error:", error);
      toast.error("Failed to send request. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Request to Join Challenge</DialogTitle>
            {challengeTitle && (
              <DialogDescription>
                Send a request to join the challenge: "{challengeTitle}"
              </DialogDescription>
            )}
             <DialogDescription>
                Select your team and add an optional message.
              </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Team Selection */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="team" className="text-right">
                Team
              </Label>
              <Select
                value={selectedTeamId}
                onValueChange={setSelectedTeamId}
                required
              >
                <SelectTrigger id="team" className="col-span-3">
                  <SelectValue placeholder="Select your team" />
                </SelectTrigger>
                <SelectContent>
                  {userTeams.length > 0 ? (
                    userTeams.map((team) => (
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
            </div>

            {/* Optional Message */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="message" className="text-right">
                Message <span className="text-xs text-muted-foreground">(Optional)</span>
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a brief message for the challenge creator..."
                className="col-span-3"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedTeamId || isLoading}>
              {isLoading ? "Sending..." : "Send Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}