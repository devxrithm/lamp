"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CheckCircle2 } from "lucide-react";

const criteria = [
    { id: "innovation", label: "Innovation Marks", max: 10 },
    { id: "impact", label: "Impact & Feasibility", max: 10 },
    { id: "presentation", label: "Presentation", max: 10 },
    { id: "technicalComplexity", label: "Technical Complexity", max: 10 },
    { id: "marketFeasibility", label: "Market Feasibility", max: 10 },
];

import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function UploadMarksForm() {
    const [scores, setScores] = useState<Record<string, number>>({
        innovation: 0,
        impact: 0,
        presentation: 0,
        technicalComplexity: 0,
        functionality: 0,
        problemRelevance: 0,
        marketFeasibility: 0
    });

    const [teamName, setTeamName] = useState("")
    const [submitted, setSubmitted] = useState(false);

    const total = Object.values(scores).reduce((a, b) => a + b, 0);

    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
    };

    if (submitted) {
        return (
            <ProtectedRoute>
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
                        <CheckCircle2 className="h-12 w-12 text-green-500" />
                        <p className="text-lg font-semibold">Marks Submitted!</p>
                        <p className="text-sm text-muted-foreground">Scores have been saved successfully.</p>
                        <Button variant="outline" onClick={() => setSubmitted(false)}>
                            Submit Another
                        </Button>
                    </CardContent>
                </Card>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            {/* <TopBar/> */}
            <Card>
                <CardHeader>
                    <CardTitle>Score Entry Form</CardTitle>
                    <CardDescription>
                        Fill in scores for each judging criterion. Total is out of 100.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="round">Round</Label>
                            <Select defaultValue="online">
                                <SelectTrigger>
                                    <SelectValue placeholder="Online Round" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="online">Online Round</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {/* Team selection */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="team">Team</Label>
                                <Input
                                    type="string"
                                    value={teamName}
                                    onChange={(e) => {
                                        setTeamName(e.target.value)
                                    }}
                                    placeholder="Enter Team Name"
                                />
                            </div>
                        </div>

                        {/* Criteria input boxes */}
                        <div className="space-y-4">
                            <Label>Scoring Criteria</Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {criteria.map((c) => {
                                    const val = scores[c.id];
                                    const isOver = val > c.max;
                                    return (
                                        <div key={c.id} className="space-y-1.5">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor={c.id} className="text-sm font-normal text-muted-foreground">
                                                    {c.label}
                                                </Label>
                                                <span className="text-xs text-muted-foreground">max {c.max}</span>
                                            </div>
                                            <div className="relative">
                                                <Input
                                                    id={c.id}
                                                    type="number"
                                                    min={0}
                                                    max={c.max}
                                                    value={val}
                                                    onChange={(e) => {
                                                        const num = Math.max(0, Math.min(c.max, Number(e.target.value)));
                                                        setScores((prev) => ({ ...prev, [c.id]: num }));
                                                    }}
                                                    className={`pr-14 tabular-nums ${isOver ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                                                    / {c.max}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Total */}
                        <div className="flex items-center justify-between rounded-lg bg-muted px-4 py-3">
                            <span className="font-semibold text-sm">Total Score</span>
                            <span
                                className={`text-2xl font-bold tabular-nums ${total >= 30
                                    ? "text-green-600"
                                    : "text-yellow-600"
                                    }`}
                            >
                                {total} / 50
                            </span>
                        </div>

                        {/* Feedback
                    <div className="space-y-2">
                        <Label htmlFor="feedback">Judge Feedback (optional)</Label>
                        <Textarea
                            id="feedback"
                            placeholder="Add notes or feedback for this team..."
                            className="resize-none"
                            rows={3}
                        />
                    </div> */}

                        <Button type="submit" className="w-full">
                            Submit Marks
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </ProtectedRoute>
    );
}