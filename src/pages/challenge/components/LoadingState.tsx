import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

const LoadingState: React.FC = () => (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Skeleton className="h-10 w-1/4 mb-4" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-32 w-full" />
            </div>
            <div className="space-y-6">
                <Skeleton className="h-80 w-full" />
                <Skeleton className="h-48 w-full" />
            </div>
        </div>
    </div>
);

export default LoadingState;