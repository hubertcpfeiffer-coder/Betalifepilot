import React, { useState, useEffect } from 'react';
import { 
  Users, CheckCircle, Clock, AlertCircle, TrendingUp, 
  Search, ChevronDown, ChevronUp, Award, Zap, BarChart3,
  User, RefreshCw, Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdminOnboardingOverview, UserOnboardingOverview, StepCompletionRate } from '@/types/onboarding';
import { supabase } from '@/lib/supabase';

interface Props {
  adminId: string;
}

const AdminOnboardingOverviewComponent: React.FC<Props> = ({ adminId }) => {
  const [overview, setOverview] = useState<AdminOnboardingOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'progress' | 'recent' | 'name'>('progress');
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  useEffect(() => {
    loadOverview();
  }, [adminId]);

  const loadOverview = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-dashboard', {
        body: { action: 'getOnboardingOverview', adminId }
      });
      
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      
      setOverview(data);
    } catch (error) {
      console.error('Error loading onboarding overview:', error);
    }
    setLoading(false);
  };

  const filteredUsers = overview?.users_progress.filter(user => {
    const matchesSearch = 
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'progress':
        return b.progress_percentage - a.progress_percentage;
      case 'recent':
        return new Date(b.last_activity || b.created_at).getTime() - 
               new Date(a.last_activity || a.created_at).getTime();
      case 'name':
        return (a.full_name || a.email).localeCompare(b.full_name || b.email);
      default:
        return 0;
    }
  }) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'in_progress': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'not_started': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Abgeschlossen';
      case 'in_progress': return 'In Bearbeitung';
      case 'not_started': return 'Nicht gestartet';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500" />
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="text-center py-12 text-gray-500">
        Keine Daten verfügbar
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Beta-Tester</p>
                <p className="text-2xl font-bold">{overview.total_beta_testers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Abgeschlossen</p>
                <p className="text-2xl font-bold">{overview.completed_onboarding}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">In Bearbeitung</p>
                <p className="text-2xl font-bold">{overview.in_progress}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Ø Fortschritt</p>
                <p className="text-2xl font-bold">{overview.average_progress}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Step Completion Rates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Schritt-Abschlussraten
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {overview.step_completion_rates.map((step) => (
              <div key={step.step_key} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{step.step_title}</span>
                  <span className="text-gray-500">
                    {step.completed_count} / {step.total_users} ({step.completion_rate}%)
                  </span>
                </div>
                <Progress value={step.completion_rate} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Tester-Fortschritt
            </CardTitle>
            <Button variant="outline" size="sm" onClick={loadOverview}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Aktualisieren
            </Button>
          </div>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Status</SelectItem>
                <SelectItem value="completed">Abgeschlossen</SelectItem>
                <SelectItem value="in_progress">In Bearbeitung</SelectItem>
                <SelectItem value="not_started">Nicht gestartet</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Sortieren" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="progress">Nach Fortschritt</SelectItem>
                <SelectItem value="recent">Nach Aktivität</SelectItem>
                <SelectItem value="name">Nach Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Keine Benutzer gefunden
              </div>
            ) : (
              filteredUsers.map((user) => (
                <UserProgressItem
                  key={user.user_id}
                  user={user}
                  expanded={expandedUser === user.user_id}
                  onToggle={() => setExpandedUser(
                    expandedUser === user.user_id ? null : user.user_id
                  )}
                  getStatusColor={getStatusColor}
                  getStatusLabel={getStatusLabel}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface UserProgressItemProps {
  user: UserOnboardingOverview;
  expanded: boolean;
  onToggle: () => void;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

const UserProgressItem: React.FC<UserProgressItemProps> = ({ 
  user, expanded, onToggle, getStatusColor, getStatusLabel 
}) => {
  return (
    <div className="border rounded-lg dark:border-slate-700 overflow-hidden">
      <div 
        className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
        onClick={onToggle}
      >
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-medium">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
          ) : (
            (user.full_name?.[0] || user.email[0]).toUpperCase()
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium truncate">{user.full_name || user.email}</p>
            <Badge className={getStatusColor(user.status)}>
              {getStatusLabel(user.status)}
            </Badge>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {user.email}
          </p>
        </div>

        {/* Progress */}
        <div className="hidden sm:flex items-center gap-4">
          <div className="w-32">
            <div className="flex justify-between text-xs mb-1">
              <span>{user.completed_steps}/{user.total_steps}</span>
              <span className="font-medium">{user.progress_percentage}%</span>
            </div>
            <Progress value={user.progress_percentage} className="h-2" />
          </div>
          
          <div className="flex items-center gap-1 text-amber-500">
            <Zap className="w-4 h-4" />
            <span className="font-medium">{user.earned_points}</span>
          </div>
        </div>

        {/* Expand Icon */}
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="px-4 pb-4 pt-0 border-t dark:border-slate-700 bg-gray-50 dark:bg-slate-800/30">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Registriert</p>
              <p className="font-medium">
                {new Date(user.created_at).toLocaleDateString('de-DE')}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Letzte Aktivität</p>
              <p className="font-medium">
                {user.last_activity 
                  ? new Date(user.last_activity).toLocaleDateString('de-DE')
                  : 'Keine'
                }
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Fortschritt</p>
              <p className="font-medium">{user.completed_steps} / {user.total_steps} Schritte</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Punkte</p>
              <p className="font-medium flex items-center gap-1">
                <Zap className="w-4 h-4 text-amber-500" />
                {user.earned_points}
              </p>
            </div>
          </div>

          {/* Mobile Progress Bar */}
          <div className="sm:hidden mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span>{user.completed_steps}/{user.total_steps} Schritte</span>
              <span className="font-medium">{user.progress_percentage}%</span>
            </div>
            <Progress value={user.progress_percentage} className="h-2" />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOnboardingOverviewComponent;
