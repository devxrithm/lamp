import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Trophy } from "lucide-react";

const teams = [
  { rank: 1, team: "NeuralNinjas", track: "AI / ML", innovation: 23, execution: 24, impact: 22, presentation: 25, total: 94 },
  { rank: 2, team: "ByteBuilders", track: "Web3", innovation: 21, execution: 22, impact: 22, presentation: 22, total: 87 },
  { rank: 3, team: "FinFusion", track: "FinTech", innovation: 20, execution: 21, impact: 20, presentation: 20, total: 81 },
  { rank: 4, team: "HealthHackers", track: "HealthTech", innovation: 19, execution: 19, impact: 20, presentation: 18, total: 76 },
  { rank: 5, team: "BlockForce", track: "Web3", innovation: 17, execution: 18, impact: 18, presentation: 17, total: 70 },
];

export default function TopTeamsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Trophy className="h-4 w-4 text-yellow-500" />
          Top Teams
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Rank</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Track</TableHead>
              <TableHead className="text-right">Innovation</TableHead>
              <TableHead className="text-right">Execution</TableHead>
              <TableHead className="text-right">Impact</TableHead>
              <TableHead className="text-right">Presentation</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="w-32">Progress</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teams.map((t) => (
              <TableRow key={t.rank}>
                <TableCell>
                  <span
                    className={`text-sm font-bold ${
                      t.rank === 1
                        ? "text-yellow-500"
                        : t.rank === 2
                        ? "text-slate-400"
                        : t.rank === 3
                        ? "text-amber-600"
                        : "text-muted-foreground"
                    }`}
                  >
                    #{t.rank}
                  </span>
                </TableCell>
                <TableCell className="font-semibold">{t.team}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {t.track}
                  </Badge>
                </TableCell>
                <TableCell className="text-right tabular-nums">{t.innovation}/25</TableCell>
                <TableCell className="text-right tabular-nums">{t.execution}/25</TableCell>
                <TableCell className="text-right tabular-nums">{t.impact}/25</TableCell>
                <TableCell className="text-right tabular-nums">{t.presentation}/25</TableCell>
                <TableCell className="text-right font-bold tabular-nums">{t.total}</TableCell>
                <TableCell>
                  <Progress value={t.total} className="h-2" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}