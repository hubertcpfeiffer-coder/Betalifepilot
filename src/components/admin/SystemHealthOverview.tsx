import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Zap, HardDrive, Cpu, AlertTriangle, CheckCircle } from 'lucide-react';
import { SystemHealthOverview as HealthData } from '@/types/systemHealth';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  data: HealthData | null;
  loading: boolean;
}

const StatusBadge = ({ status }: { status: string }) => {
  const colors = {
    healthy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || colors.healthy}`}>
      {status === 'healthy' ? <CheckCircle className="inline h-3 w-3 mr-1" /> : <AlertTriangle className="inline h-3 w-3 mr-1" />}
      {status}
    </span>
  );
};

export const SystemHealthOverview: React.FC<Props> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-36" />)}
      </div>
    );
  }

  if (!data) return null;

  const cards = [
    { title: 'Datenbank', icon: Database, data: data.database, metrics: [`${data.database.connections}/${data.database.maxConnections} Verbindungen`, `${data.database.latency}ms Latenz`] },
    { title: 'Edge Functions', icon: Zap, data: data.edgeFunctions, metrics: [`${data.edgeFunctions.avgLatency}ms Latenz`, `${data.edgeFunctions.errorRate}% Fehlerrate`] },
    { title: 'Speicher', icon: HardDrive, data: data.storage, metrics: [`${Math.round(data.storage.usedBytes / 1024 / 1024)}MB verwendet`, `${data.storage.usagePercent}% belegt`] },
    { title: 'Arbeitsspeicher', icon: Cpu, data: data.memory, metrics: [`${data.memory.usedMB}/${data.memory.totalMB}MB`, `${data.memory.usagePercent}% belegt`] }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <StatusBadge status={card.data.status} />
            <div className="mt-3 space-y-1">
              {card.metrics.map((m, j) => <p key={j} className="text-sm text-muted-foreground">{m}</p>)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
