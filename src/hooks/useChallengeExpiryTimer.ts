import { useState, useEffect } from 'react';
import { formatDistanceToNowStrict, isValid } from 'date-fns';

interface UseChallengeExpiryTimerArgs {
    status: string | undefined;
    expiresAt: string | Date | undefined;
    createdAt: string | Date | undefined;
}

export function useChallengeExpiryTimer({ status, expiresAt, createdAt }: UseChallengeExpiryTimerArgs) {
    const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
    const [expiryProgress, setExpiryProgress] = useState(0);

    useEffect(() => {
        if (status === "OPEN" && expiresAt) {
            const expiryDate = new Date(expiresAt);
            const creationDate = createdAt ? new Date(createdAt) : new Date();

            if (!isValid(expiryDate)) {
                setTimeRemaining("Invalid date");
                setExpiryProgress(0);
                return;
            }

            const updateTimer = () => {
                const now = new Date();
                const remainingMillis = expiryDate.getTime() - now.getTime();
                const totalDuration = expiryDate.getTime() - creationDate.getTime();

                if (remainingMillis > 0 && totalDuration > 0) {
                    setTimeRemaining(formatDistanceToNowStrict(expiryDate, { addSuffix: true }));
                    const elapsed = now.getTime() - creationDate.getTime();
                    setExpiryProgress(Math.min(Math.max(0, Math.round((elapsed / totalDuration) * 100)), 100));
                } else {
                    setTimeRemaining("Expired");
                    setExpiryProgress(100);
                    // Optionally dispatch an expire action here if needed,
                    // but careful about multiple dispatches or race conditions.
                    // Consider server-side expiration checks as primary.
                }
            };

            updateTimer();
            const intervalId = setInterval(updateTimer, 60000); // Update every minute
            return () => clearInterval(intervalId);

        } else {
            setTimeRemaining(null);
            setExpiryProgress(0);
        }
    }, [status, expiresAt, createdAt]);

    return { timeRemaining, expiryProgress };
}
