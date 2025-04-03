import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowLeft } from 'lucide-react';

interface ErrorStateProps {
    error: string | null;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
    const navigate = useNavigate();
    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <Card className="border-destructive">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                        <AlertCircle className="h-6 w-6" /> Error Loading Challenge
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-muted-foreground mb-4">{error || "An unexpected error occurred."}</p>
                    <Button onClick={() => navigate("/challenges")} variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Challenges
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default ErrorState;
