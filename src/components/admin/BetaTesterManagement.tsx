import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Mail, User, Eye, UserCheck } from 'lucide-react';
import { AdminUser } from '@/types/admin';


interface Props {
  users: AdminUser[];
  loading: boolean;
  onApprove: (userId: string) => void;
  onReject: (userId: string) => void;
  onVerifyEmail: (userId: string) => void;
  onViewDetails: (user: AdminUser) => void;
}

export const BetaTesterManagement: React.FC<Props> = ({ users, loading, onApprove, onReject, onVerifyEmail, onViewDetails }) => {
  const pendingUsers = users.filter(u => u.status === 'pending_review');
  const approvedUsers = users.filter(u => u.is_beta_tester && u.status !== 'pending_review');

  const formatDate = (date?: string) => date ? new Date(date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-';

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; icon: React.ReactNode }> = {
      pending_review: { bg: 'bg-amber-100 text-amber-800', icon: <Clock className="h-3 w-3" /> },
      approved: { bg: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-3 w-3" /> },
      active: { bg: 'bg-blue-100 text-blue-800', icon: <UserCheck className="h-3 w-3" /> },
    };
    const s = styles[status] || { bg: 'bg-gray-100', icon: null };
    return <Badge className={`${s.bg} flex items-center gap-1`}>{s.icon}{status}</Badge>;
  };

  if (loading) return <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500" /></div>;

  return (
    <div className="space-y-6">
      <Card className="border-amber-200 bg-amber-50/50">
        <CardHeader><CardTitle className="flex items-center gap-2 text-amber-800"><Clock className="h-5 w-5" />Ausstehende Genehmigungen ({pendingUsers.length})</CardTitle></CardHeader>
        <CardContent>
          {pendingUsers.length === 0 ? (
            <p className="text-center text-gray-500 py-4">Keine ausstehenden Anfragen</p>
          ) : (
            <Table>
              <TableHeader><TableRow><TableHead>Benutzer</TableHead><TableHead>Registriert</TableHead><TableHead>E-Mail</TableHead><TableHead>Aktionen</TableHead></TableRow></TableHeader>
              <TableBody>
                {pendingUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell><div className="flex items-center gap-2"><User className="h-4 w-4 text-gray-400" /><div><p className="font-medium">{user.full_name || 'Unbekannt'}</p><p className="text-xs text-gray-500">{user.email}</p></div></div></TableCell>
                    <TableCell className="text-sm">{formatDate(user.created_at)}</TableCell>
                    <TableCell>{user.email_verified ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Button size="sm" variant="ghost" onClick={() => onVerifyEmail(user.id)}><Mail className="h-4 w-4 mr-1" />Verifizieren</Button>}</TableCell>
                    <TableCell><div className="flex gap-2"><Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => onApprove(user.id)}><CheckCircle className="h-4 w-4 mr-1" />Genehmigen</Button><Button size="sm" variant="destructive" onClick={() => onReject(user.id)}><XCircle className="h-4 w-4 mr-1" />Ablehnen</Button></div></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><UserCheck className="h-5 w-5 text-green-600" />Genehmigte Beta-Tester ({approvedUsers.length})</CardTitle></CardHeader>
        <CardContent>
          {approvedUsers.length === 0 ? <p className="text-center text-gray-500 py-4">Noch keine genehmigten Tester</p> : (
            <Table>
              <TableHeader><TableRow><TableHead>Benutzer</TableHead><TableHead>Status</TableHead><TableHead>Genehmigt am</TableHead><TableHead>Letzter Login</TableHead><TableHead></TableHead></TableRow></TableHeader>
              <TableBody>
                {approvedUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell><div><p className="font-medium">{user.full_name}</p><p className="text-xs text-gray-500">{user.email}</p></div></TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell className="text-sm">{formatDate(user.beta_approved_at)}</TableCell>
                    <TableCell className="text-sm">{formatDate(user.last_login)}</TableCell>
                    <TableCell><Button size="sm" variant="ghost" onClick={() => onViewDetails(user)}><Eye className="h-4 w-4" /></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
