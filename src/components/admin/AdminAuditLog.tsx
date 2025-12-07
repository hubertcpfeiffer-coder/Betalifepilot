import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Shield, AlertTriangle, Info, User } from 'lucide-react';
import { AuditLogEntry } from '@/types/admin';

interface AdminAuditLogProps {
  logs: AuditLogEntry[];
  total: number;
  page: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  onFilterChange: (action: string) => void;
}

const ACTION_BADGES: Record<string, { color: string; icon: React.ReactNode }> = {
  login: { color: 'bg-green-100 text-green-800', icon: <User className="h-3 w-3" /> },
  logout: { color: 'bg-gray-100 text-gray-800', icon: <User className="h-3 w-3" /> },
  password_change: { color: 'bg-blue-100 text-blue-800', icon: <Shield className="h-3 w-3" /> },
  failed_login: { color: 'bg-red-100 text-red-800', icon: <AlertTriangle className="h-3 w-3" /> },
  data_export: { color: 'bg-purple-100 text-purple-800', icon: <Info className="h-3 w-3" /> },
  account_delete: { color: 'bg-red-100 text-red-800', icon: <AlertTriangle className="h-3 w-3" /> },
};

export const AdminAuditLog: React.FC<AdminAuditLogProps> = ({
  logs, total, page, loading, onPageChange, onFilterChange
}) => {
  const [filter, setFilter] = useState('all');
  const totalPages = Math.ceil(total / 50);

  const handleFilter = (value: string) => {
    setFilter(value);
    onFilterChange(value === 'all' ? '' : value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('de-DE', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Audit-Log</CardTitle>
        <Select value={filter} onValueChange={handleFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter nach Aktion" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Aktionen</SelectItem>
            <SelectItem value="login">Login</SelectItem>
            <SelectItem value="logout">Logout</SelectItem>
            <SelectItem value="password_change">Passwort</SelectItem>
            <SelectItem value="failed_login">Fehlgeschlagen</SelectItem>
            <SelectItem value="data_export">Datenexport</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Zeitpunkt</TableHead>
                  <TableHead>Aktion</TableHead>
                  <TableHead>Benutzer-ID</TableHead>
                  <TableHead>IP-Adresse</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => {
                  const badge = ACTION_BADGES[log.action] || { color: 'bg-gray-100 text-gray-800', icon: <Info className="h-3 w-3" /> };
                  return (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm">{formatDate(log.created_at)}</TableCell>
                      <TableCell>
                        <Badge className={`${badge.color} flex items-center gap-1 w-fit`}>
                          {badge.icon}
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{log.user_id?.slice(0, 8)}...</TableCell>
                      <TableCell className="text-sm">{log.ip_address || '-'}</TableCell>
                      <TableCell className="text-xs max-w-[200px] truncate">
                        {log.details ? JSON.stringify(log.details) : '-'}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Seite {page} von {totalPages} ({total} Einträge)
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
