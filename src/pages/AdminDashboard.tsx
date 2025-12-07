import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, LayoutDashboard, Users, FileText, Activity, RefreshCw, UserPlus, GraduationCap, MessageSquare } from 'lucide-react';
import { AdminStatsCards } from '@/components/admin/AdminStatsCards';
import { AdminUserChart } from '@/components/admin/AdminUserChart';
import { AdminTaskChart } from '@/components/admin/AdminTaskChart';
import { AdminAuditLog } from '@/components/admin/AdminAuditLog';
import { AdminUserManagement } from '@/components/admin/AdminUserManagement';
import { BetaTesterManagement } from '@/components/admin/BetaTesterManagement';
import { SystemHealthOverview } from '@/components/admin/SystemHealthOverview';
import { SystemAlertsList } from '@/components/admin/SystemAlertsList';
import { PerformanceChart } from '@/components/admin/PerformanceChart';
import AdminOnboardingOverview from '@/components/admin/AdminOnboardingOverview';
import AdminFeedbackPanel from '@/components/admin/AdminFeedbackPanel';
import * as adminService from '@/services/adminService';
import * as healthService from '@/services/systemHealthService';
import { AdminStats, AdminUser, AuditLogEntry, UserActivityData, TaskStatsData } from '@/types/admin';
import { SystemHealthOverview as HealthData, SystemAlert, PerformanceHistory } from '@/types/systemHealth';
import { useToast } from '@/hooks/use-toast';


const AdminDashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [userActivity, setUserActivity] = useState<UserActivityData[]>([]);
  const [taskStats, setTaskStats] = useState<TaskStatsData | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersTotal, setUsersTotal] = useState(0);
  const [usersPage, setUsersPage] = useState(1);
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [logsTotal, setLogsTotal] = useState(0);
  const [logsPage, setLogsPage] = useState(1);
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [perfHistory, setPerfHistory] = useState<PerformanceHistory[]>([]);
  const [loading, setLoading] = useState({ stats: true, activity: true, tasks: true, users: true, logs: true, health: true, alerts: true, perf: true });

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') { navigate('/'); return; }
    loadDashboardData(); loadSystemHealth();
  }, [isAuthenticated, user]);

  const loadDashboardData = async () => {
    if (!user) return;
    try {
      const [statsData, activityData, taskData] = await Promise.all([adminService.getAdminStats(user.id), adminService.getUserActivity(user.id), adminService.getTaskStats(user.id)]);
      setStats(statsData); setUserActivity(activityData); setTaskStats(taskData);
    } catch (e) { toast({ title: 'Fehler', description: 'Dashboard-Daten konnten nicht geladen werden', variant: 'destructive' }); }
    finally { setLoading(l => ({ ...l, stats: false, activity: false, tasks: false })); }
  };

  const loadSystemHealth = useCallback(async () => {
    if (!user) return;
    setLoading(l => ({ ...l, health: true, alerts: true, perf: true }));
    try {
      const [health, alertsData, perf] = await Promise.all([healthService.getSystemHealth(user.id), healthService.getAlerts(user.id), healthService.getPerformanceHistory(user.id)]);
      setHealthData(health); setAlerts(alertsData); setPerfHistory(perf);
    } catch (e) { console.error('Health load error:', e); }
    finally { setLoading(l => ({ ...l, health: false, alerts: false, perf: false })); }
  }, [user]);

  useEffect(() => { const interval = setInterval(loadSystemHealth, 30000); return () => clearInterval(interval); }, [loadSystemHealth]);

  const loadUsers = async (page: number, search?: string) => {
    if (!user) return;
    setLoading(l => ({ ...l, users: true }));
    try { const data = await adminService.getUsers(user.id, { page, search }); setUsers(data.users); setUsersTotal(data.total); setUsersPage(data.page); }
    catch (e) { toast({ title: 'Fehler', description: 'Benutzer konnten nicht geladen werden', variant: 'destructive' }); }
    finally { setLoading(l => ({ ...l, users: false })); }
  };

  const loadLogs = async (page: number, action?: string) => {
    if (!user) return;
    setLoading(l => ({ ...l, logs: true }));
    try { const data = await adminService.getAuditLogs(user.id, { page, action }); setLogs(data.logs); setLogsTotal(data.total); setLogsPage(data.page); }
    catch (e) { toast({ title: 'Fehler', description: 'Logs konnten nicht geladen werden', variant: 'destructive' }); }
    finally { setLoading(l => ({ ...l, logs: false })); }
  };

  useEffect(() => { loadUsers(1); loadLogs(1); }, [user]);

  const handleToggleStatus = async (userId: string, status: string) => {
    if (!user) return;
    try { await adminService.toggleUserStatus(user.id, userId, status); toast({ title: 'Erfolg', description: 'Benutzerstatus aktualisiert' }); loadUsers(usersPage); }
    catch (e) { toast({ title: 'Fehler', description: 'Status konnte nicht geändert werden', variant: 'destructive' }); }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!user || !confirm('Benutzer wirklich löschen?')) return;
    try { await adminService.deleteUserAdmin(user.id, userId); toast({ title: 'Erfolg', description: 'Benutzer gelöscht' }); loadUsers(usersPage); }
    catch (e) { toast({ title: 'Fehler', description: 'Benutzer konnte nicht gelöscht werden', variant: 'destructive' }); }
  };

  const handleUpdateRole = async (userId: string, role: string) => {
    if (!user) return;
    try { await adminService.updateUserAdmin(user.id, userId, { role: role as any }); toast({ title: 'Erfolg', description: 'Rolle aktualisiert' }); loadUsers(usersPage); }
    catch (e) { toast({ title: 'Fehler', description: 'Rolle konnte nicht geändert werden', variant: 'destructive' }); }
  };

  const handleApproveBeta = async (userId: string) => {
    if (!user) return;
    try { await adminService.approveBetaTester(user.id, userId); toast({ title: 'Erfolg', description: 'Beta-Tester genehmigt' }); loadUsers(usersPage); loadDashboardData(); }
    catch (e) { toast({ title: 'Fehler', variant: 'destructive' }); }
  };

  const handleRejectBeta = async (userId: string) => {
    if (!user || !confirm('Anfrage wirklich ablehnen?')) return;
    try { await adminService.rejectBetaTester(user.id, userId); toast({ title: 'Anfrage abgelehnt' }); loadUsers(usersPage); loadDashboardData(); }
    catch (e) { toast({ title: 'Fehler', variant: 'destructive' }); }
  };

  const handleVerifyEmail = async (userId: string) => {
    if (!user) return;
    try { await adminService.verifyUserEmail(user.id, userId); toast({ title: 'E-Mail verifiziert' }); loadUsers(usersPage); }
    catch (e) { toast({ title: 'Fehler', variant: 'destructive' }); }
  };

  const handleAcknowledgeAlert = async (alertId: string) => {
    if (!user) return;
    try { await healthService.acknowledgeAlert(user.id, alertId); toast({ title: 'Alert bestätigt' }); loadSystemHealth(); }
    catch (e) { toast({ title: 'Fehler', variant: 'destructive' }); }
  };

  const handleResolveAlert = async (alertId: string) => {
    if (!user) return;
    try { await healthService.resolveAlert(user.id, alertId); toast({ title: 'Alert gelöst' }); loadSystemHealth(); }
    catch (e) { toast({ title: 'Fehler', variant: 'destructive' }); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}><ArrowLeft className="h-4 w-4 mr-2" />Zurück</Button>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full max-w-4xl grid-cols-7">
            <TabsTrigger value="overview" className="text-xs sm:text-sm"><LayoutDashboard className="h-4 w-4 sm:mr-1" /><span className="hidden sm:inline">Übersicht</span></TabsTrigger>
            <TabsTrigger value="beta" className="text-xs sm:text-sm"><UserPlus className="h-4 w-4 sm:mr-1" /><span className="hidden sm:inline">Beta</span></TabsTrigger>
            <TabsTrigger value="feedback" className="text-xs sm:text-sm"><MessageSquare className="h-4 w-4 sm:mr-1" /><span className="hidden sm:inline">Feedback</span></TabsTrigger>
            <TabsTrigger value="onboarding" className="text-xs sm:text-sm"><GraduationCap className="h-4 w-4 sm:mr-1" /><span className="hidden sm:inline">Onboarding</span></TabsTrigger>
            <TabsTrigger value="users" className="text-xs sm:text-sm"><Users className="h-4 w-4 sm:mr-1" /><span className="hidden sm:inline">Benutzer</span></TabsTrigger>
            <TabsTrigger value="logs" className="text-xs sm:text-sm"><FileText className="h-4 w-4 sm:mr-1" /><span className="hidden sm:inline">Logs</span></TabsTrigger>
            <TabsTrigger value="system" className="text-xs sm:text-sm"><Activity className="h-4 w-4 sm:mr-1" /><span className="hidden sm:inline">System</span></TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-6">
            <AdminStatsCards stats={stats} loading={loading.stats} />
            <AdminUserChart data={userActivity} loading={loading.activity} />
            <AdminTaskChart data={taskStats} loading={loading.tasks} />
          </TabsContent>
          <TabsContent value="beta">
            <BetaTesterManagement users={users} loading={loading.users} onApprove={handleApproveBeta} onReject={handleRejectBeta} onVerifyEmail={handleVerifyEmail} onViewDetails={(u) => toast({ title: u.full_name || u.email })} />
          </TabsContent>
          <TabsContent value="feedback">
            {user && <AdminFeedbackPanel adminId={user.id} />}
          </TabsContent>
          <TabsContent value="onboarding">
            {user && <AdminOnboardingOverview adminId={user.id} />}
          </TabsContent>
          <TabsContent value="users">
            <AdminUserManagement users={users} total={usersTotal} page={usersPage} loading={loading.users} onSearch={(q) => loadUsers(1, q)} onPageChange={loadUsers} onToggleStatus={handleToggleStatus} onDeleteUser={handleDeleteUser} onUpdateRole={handleUpdateRole} />
          </TabsContent>
          <TabsContent value="logs">
            <AdminAuditLog logs={logs} total={logsTotal} page={logsPage} loading={loading.logs} onPageChange={loadLogs} onFilterChange={(a) => loadLogs(1, a)} />
          </TabsContent>
          <TabsContent value="system" className="space-y-6">
            <div className="flex justify-end"><Button variant="outline" size="sm" onClick={loadSystemHealth}><RefreshCw className="h-4 w-4 mr-2" />Aktualisieren</Button></div>
            <SystemHealthOverview data={healthData} loading={loading.health} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SystemAlertsList alerts={alerts} loading={loading.alerts} onAcknowledge={handleAcknowledgeAlert} onResolve={handleResolveAlert} />
              <PerformanceChart data={perfHistory} loading={loading.perf} />
            </div>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
};

export default AdminDashboard;
