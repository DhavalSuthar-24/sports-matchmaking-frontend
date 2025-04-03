import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, ArrowLeft } from 'lucide-react';

const NotFoundState: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-muted-foreground">
                        <Info className="h-6 w-6" /> Challenge Not Found
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-muted-foreground mb-4">This challenge may have been deleted, expired, or does not exist.</p>
                    <Button onClick={() => navigate("/challenges")} variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Challenges
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default NotFoundState;