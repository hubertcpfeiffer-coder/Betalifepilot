import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, UserCheck, UserPlus, CheckSquare, ListTodo, TrendingUp, Clock, Sparkles } from 'lucide-react';
import { AdminStats } from '@/types/admin';

interface AdminStatsCardsProps {
  stats: AdminStats | null;
  loading: boolean;
}

export const AdminStatsCards: React.FC<AdminStatsCardsProps> = ({ stats, loading }) => {
  const cards = [
    { label: 'Gesamtbenutzer', value: stats?.totalUsers || 0, icon: Users, color: 'bg-blue-500' },
    { label: 'Aktive Benutzer', value: stats?.activeUsers || 0, icon: UserCheck, color: 'bg-green-500' },
    { label: 'Neue heute', value: stats?.newUsersToday || 0, icon: UserPlus, color: 'bg-purple-500' },
    { label: 'Aufgaben gesamt', value: stats?.totalTasks || 0, icon: ListTodo, color: 'bg-orange-500' },
    { label: 'Ausstehend', value: stats?.pendingReviewUsers || 0, icon: Clock, color: 'bg-amber-500', highlight: (stats?.pendingReviewUsers || 0) > 0 },
    { label: 'Beta-Tester', value: stats?.betaTesters || 0, icon: Sparkles, color: 'bg-cyan-500' },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card, i) => (
        <Card key={i} className={`hover:shadow-lg transition-shadow ${card.highlight ? 'ring-2 ring-amber-400 bg-amber-50/50' : ''}`}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${card.color}`}>
                <card.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold">{card.value}</p>
                <p className="text-xs text-muted-foreground">{card.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
