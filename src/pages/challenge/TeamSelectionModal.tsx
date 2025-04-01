// src/components/challenges/TeamSelectionModal.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription, // Optional: Add description
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"; // Using ShadCN Select
import { Skeleton } from "@/components/ui/skeleton"; // For loading state

// Assuming Team type is defined similarly in common types or team feature
import type { Team } from "@/redux/features/challenge/common.types"; // Adjust path if necessary


// Corrected Props
interface TeamSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    /** Array of teams the user can select from (likely user's teams) */
    teams: Team[] | null | undefined;
    /** Callback function passing only the selected team ID */
    onSelectTeam: (teamId: string) => void;
    /** Loading state from the parent component's action */
    isLoading: boolean;
    /** Optional: Pass game/level if needed for filtering teams, though not used in this version */
    // gameId?: string;
    // challengeLevel?: string;
}

const TeamSelectionModal: React.FC<TeamSelectionModalProps> = ({
    isOpen,
    onClose,
    teams,
    onSelectTeam,
    isLoading,
}) => {
    const navigate = useNavigate();
    const [selectedTeam, setSelectedTeam] = useState<string>("");

    // Reset selection when modal opens or teams change
    useEffect(() => {
        if (isOpen) {
            // Set default selection to the first available team if exists, otherwise clear
            if (teams && teams.length > 0) {
                // Only set default if no team is currently selected or if the selected one is no longer valid
                if (!selectedTeam || !teams.some(t => t.id === selectedTeam)) {
                    setSelectedTeam(teams[0].id);
                }
            } else {
                setSelectedTeam(""); // Clear selection if no teams available
            }
        } else {
             // Optionally reset when closing, or keep the last selection? Resetting is cleaner.
             // setSelectedTeam("");
        }
    }, [isOpen, teams]); // Rerun when modal opens or teams list updates


    const handleCreateTeam = () => {
        navigate("/teams/create"); // Navigate to team creation page
        onClose(); // Close the modal
    };

    const handleConfirm = () => {
        if (!selectedTeam) {
            toast.error("Please select a team.");
            return;
        }
        // Call the callback with only the teamId
        onSelectTeam(selectedTeam);
        // Modal will likely be closed by the parent upon successful action,
        // but you could close it here immediately if preferred: onClose();
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            onClose(); // Call onClose when the dialog requests to be closed
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Select Your Team</DialogTitle>
                    <DialogDescription>
                        Choose the team you want to use for this challenge action.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    {/* Team Selector */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="team-select" className="text-right">
                            Team
                        </Label>
                        {/* Display Skeleton if teams are not yet loaded (check parent's loading state if needed) */}
                         {/* {!teams ? (
                            <Skeleton className="h-10 col-span-3" />
                         ) : ( */}
                             <Select
                                value={selectedTeam}
                                onValueChange={setSelectedTeam}
                                disabled={!teams || teams.length === 0 || isLoading}
                             >
                                <SelectTrigger id="team-select" className="col-span-3">
                                    <SelectValue placeholder={teams && teams.length > 0 ? "Select a team..." : "No teams available"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {teams && teams.length > 0 ? (
                                        teams.map((team) => (
                                            <SelectItem key={team.id} value={team.id}>
                                                {team.name} {/* Assuming 'name' property exists */}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value="no-teams" disabled>
                                           No teams found
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                         {/* )} */}
                    </div>
                     {(!teams || teams.length === 0) && (
                        <p className="text-sm text-center text-muted-foreground col-span-4 px-4">
                            You need to be a member of a team to accept or request challenges.
                        </p>
                    )}
                </div>

                <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
                     <Button
                        variant="outline"
                        onClick={handleCreateTeam}
                        disabled={isLoading}
                    >
                        Create New Team
                    </Button>
                     <Button
                        variant="default"
                        onClick={handleConfirm}
                        disabled={isLoading || !selectedTeam || !teams || teams.length === 0}
                     >
                         {isLoading ? "Processing..." : "Confirm Selection"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default TeamSelectionModal;