"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, UserCheck, LogOut } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-muted/30 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto space-y-8 mt-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 rounded-xl border shadow-sm">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Welcome back, {user?.displayName || "User"} ({user?.email})
              </p>
            </div>
            <Button variant="outline" onClick={logout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <UserCheck className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Upload marks specifically for mentor evaluations.</CardTitle>
                <CardDescription>
                  Upload marks specifically for mentor evaluations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/mentor-upload" className="w-full">
                  <Button className="w-full">Go to Mentor Evaluation</Button>
                </Link>
              </CardContent>
            </Card>

              <Card className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <ClipboardList className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Upload Marks For Judge</CardTitle>
                <CardDescription>
                  Upload marks for standard student evaluations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/upload" className="w-full">
                  <Button className="w-full">Go to Standard Evaluation</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
