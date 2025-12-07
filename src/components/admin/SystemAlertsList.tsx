import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { SystemAlert } from '@/types/systemHealth';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  alerts: SystemAlert[];
  loading: boolean;
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
}

export const SystemAlertsList: React.FC<Props> = ({ alerts, loading, onAcknowledge, onResolve }) => {
  const severityIcon = (s: string) => {
    if (s === 'critical') return <XCircle className="h-4 w-4 text-red-500" />;
    if (s === 'warning') return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    return <Bell className="h-4 w-4 text-blue-500" />;
  };

  const severityColor = (s: string) => {
    if (s === 'critical') return 'bg-red-100 text-red-700 dark:bg-red-900/30';
    if (s === 'warning') return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30';
    return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30';
  };

  if (loading) return <Skeleton className="h-64" />;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />System-Alerts ({alerts.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
            <p>Keine aktiven Alerts</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {alerts.map(alert => (
              <div key={alert.id} className="border rounded-lg p-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2">
                    {severityIcon(alert.severity)}
                    <div>
                      <p className="font-medium">{alert.title}</p>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={severityColor(alert.severity)}>{alert.severity}</Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />{new Date(alert.created_at).toLocaleString('de-DE')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {!alert.acknowledged && (
                      <Button size="sm" variant="outline" onClick={() => onAcknowledge(alert.id)}>Bestätigen</Button>
                    )}
                    <Button size="sm" variant="default" onClick={() => onResolve(alert.id)}>Lösen</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
