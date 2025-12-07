import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, MoreVertical, UserX, UserCheck, Shield, Trash2, ChevronLeft, ChevronRight, Mail, CheckCircle } from 'lucide-react';
import { AdminUser } from '@/types/admin';

interface AdminUserManagementProps {
  users: AdminUser[];
  total: number;
  page: number;
  loading: boolean;
  onSearch: (query: string) => void;
  onPageChange: (page: number) => void;
  onToggleStatus: (userId: string, status: string) => void;
  onDeleteUser: (userId: string) => void;
  onUpdateRole: (userId: string, role: string) => void;
}

export const AdminUserManagement: React.FC<AdminUserManagementProps> = ({
  users, total, page, loading, onSearch, onPageChange, onToggleStatus, onDeleteUser, onUpdateRole
}) => {
  const [search, setSearch] = useState('');
  const totalPages = Math.ceil(total / 20);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(search);
  };

  const formatDate = (date?: string) => date ? new Date(date).toLocaleDateString('de-DE') : '-';

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      suspended: 'bg-yellow-100 text-yellow-800',
      banned: 'bg-red-100 text-red-800',
      pending_review: 'bg-amber-100 text-amber-800',
      approved: 'bg-blue-100 text-blue-800'
    };
    const labels: Record<string, string> = {
      active: 'Aktiv', suspended: 'Gesperrt', banned: 'Gebannt', pending_review: 'Ausstehend', approved: 'Genehmigt'
    };
    return <Badge className={styles[status] || 'bg-gray-100'}>{labels[status] || status}</Badge>;
  };

  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      admin: 'bg-purple-100 text-purple-800',
      moderator: 'bg-blue-100 text-blue-800',
      user: 'bg-gray-100 text-gray-800',
      beta_tester: 'bg-cyan-100 text-cyan-800'
    };
    const labels: Record<string, string> = {
      admin: 'Admin', moderator: 'Moderator', user: 'Benutzer', beta_tester: 'Beta-Tester'
    };
    return <Badge className={styles[role] || 'bg-gray-100'}>{labels[role] || role}</Badge>;
  };



  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Benutzerverwaltung</CardTitle>
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input placeholder="Suchen..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-[200px]" />
          <Button type="submit" size="sm"><Search className="h-4 w-4" /></Button>
        </form>
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
                  <TableHead>Benutzer</TableHead>
                  <TableHead>Rolle</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Verifiziert</TableHead>
                  <TableHead>Registriert</TableHead>
                  <TableHead>Letzter Login</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{user.full_name || 'Unbekannt'}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" />{user.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>
                      {user.email_verified ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <span className="text-xs text-muted-foreground">Nein</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">{formatDate(user.created_at)}</TableCell>
                    <TableCell className="text-sm">{formatDate(user.last_login)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm"><MoreVertical className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {user.status === 'active' ? (
                            <DropdownMenuItem onClick={() => onToggleStatus(user.id, 'suspended')}>
                              <UserX className="h-4 w-4 mr-2" />Sperren
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => onToggleStatus(user.id, 'active')}>
                              <UserCheck className="h-4 w-4 mr-2" />Aktivieren
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => onUpdateRole(user.id, user.role === 'admin' ? 'user' : 'admin')}>
                            <Shield className="h-4 w-4 mr-2" />{user.role === 'admin' ? 'Admin entfernen' : 'Zum Admin'}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => onDeleteUser(user.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />Löschen
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">Seite {page} von {totalPages} ({total} Benutzer)</p>
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
