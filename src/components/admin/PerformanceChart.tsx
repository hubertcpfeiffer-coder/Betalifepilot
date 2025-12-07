import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity } from 'lucide-react';
import { PerformanceHistory } from '@/types/systemHealth';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  data: PerformanceHistory[];
  loading: boolean;
}

export const PerformanceChart: React.FC<Props> = ({ data, loading }) => {
  if (loading) return <Skeleton className="h-80" />;

  const chartData = data.map(d => ({
    time: d.timestamp.substring(11, 16),
    latency: d.latency,
    errorRate: d.errorRate,
    requests: d.requests
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />Performance-Verlauf (24h)
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            Keine Performance-Daten verfügbar
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="time" className="text-xs" />
              <YAxis yAxisId="left" className="text-xs" />
              <YAxis yAxisId="right" orientation="right" className="text-xs" />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="latency" stroke="#3b82f6" name="Latenz (ms)" strokeWidth={2} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="errorRate" stroke="#ef4444" name="Fehlerrate (%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
