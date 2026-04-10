"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { api } from "../../../lib/axios";

const criteria = [
  { id: "innovationMarks", label: "Innovation Marks", max: 10 },
  { id: "technicalComplexity", label: "Technical Complexity", max: 10 },
  { id: "presentation", label: "Presentation", max: 10 },
  { id: "marketFeasibility", label: "Market Feasibility", max: 10 },
  { id: "futureScope", label: "Future Scope", max: 10 },
];

const defaultScores = {
  innovationMarks: 0,
  technicalComplexity: 0,
  presentation: 0,
  marketFeasibility: 0,
  futureScope: 0,
};

export default function UploadMarksForm() {
  const [scores, setScores] = useState<Record<string, number>>(defaultScores);
  const [teamName, setTeamName] = useState("");
  const [round, setRound] = useState<"1" | "2">("1"); // ✅ store as "1" or "2"
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const total = Object.values(scores).reduce((a, b) => a + b, 0);

  const resetForm = () => {
    setSubmitted(false);
    setTeamName("");
    setRound("1"); // ✅ consistent reset
    setScores(defaultScores);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!teamName.trim()) {
      setError("Please enter a team name.");
      setLoading(false);
      return;
    }

    try {
      await api.post("/api/mentor-offline", {
        teamName,
        round: Number(round), // ✅ cleanly converts "1" → 1, "2" → 2
        ...scores,
      });

      setSubmitted(true);
      setTimeout(resetForm, 3000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.error ||
            error.response?.data?.message ||
            "Failed to upload marks.",
        );
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
          <CheckCircle2 className="h-12 w-12 text-green-500" />
          <p className="text-lg font-semibold">Marks Submitted!</p>
          <p className="text-sm text-muted-foreground">
            Scores have been saved successfully.
          </p>
          <Button variant="outline" onClick={resetForm}>
            Submit Another
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Score Entry Form</CardTitle>
        <CardDescription>
          Fill in scores for each judging criterion. Total is out of 50.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive" className="py-2.5">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="ml-2 text-sm">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="round">Round</Label>
            <Select
              value={round}
              onValueChange={(val) => setRound(val as "1" | "2")} // ✅ value is now "1" or "2"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select round" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Round 1</SelectItem> {/* ✅ value="1" */}
                <SelectItem value="2">Round 2</SelectItem> {/* ✅ value="2" */}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="team">Team</Label>
              <Input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter Team Name"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label>Scoring Criteria</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {criteria.map((c) => {
                const val = scores[c.id];
                const isOver = val > c.max;
                return (
                  <div key={c.id} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor={c.id}
                        className="text-sm font-normal text-muted-foreground"
                      >
                        {c.label}
                      </Label>
                      <span className="text-xs text-muted-foreground">
                        max {c.max}
                      </span>
                    </div>
                    <div className="relative">
                      <Input
                        id={c.id}
                        type="number"
                        min={0}
                        max={c.max}
                        value={val}
                        required
                        onChange={(e) => {
                          const num = Math.max(
                            0,
                            Math.min(c.max, Number(e.target.value)),
                          );
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

          <div className="flex items-center justify-between rounded-lg bg-muted px-4 py-3">
            <span className="font-semibold text-sm">Total Score</span>
            <span
              className={`text-2xl font-bold tabular-nums ${
                total >= 30 ? "text-green-600" : "text-yellow-600"
              }`}
            >
              {total} / 50
            </span>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Marks"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}