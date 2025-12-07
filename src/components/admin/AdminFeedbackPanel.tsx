import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Bug, Lightbulb, MessageSquare, HelpCircle, 
  ChevronDown, ChevronUp, ExternalLink, Clock, User, 
  Monitor, Globe, CheckCircle, XCircle, AlertTriangle,
  RefreshCw, Filter, Image as ImageIcon
} from 'lucide-react';
import { BetaFeedback, FeedbackCategory, FeedbackStatus, FeedbackStats } from '@/types/feedback';
import { getAllFeedback, updateFeedbackStatus, getFeedbackStats } from '@/services/feedbackService';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';

const categoryIcons: Record<FeedbackCategory, React.ElementType> = {
  bug: Bug,
  feature: Lightbulb,
  feedback: MessageSquare,
  question: HelpCircle
};

const categoryColors: Record<FeedbackCategory, string> = {
  bug: 'bg-red-100 text-red-700 border-red-200',
  feature: 'bg-amber-100 text-amber-700 border-amber-200',
  feedback: 'bg-blue-100 text-blue-700 border-blue-200',
  question: 'bg-purple-100 text-purple-700 border-purple-200'
};

const statusColors: Record<FeedbackStatus, string> = {
  new: 'bg-cyan-100 text-cyan-700',
  in_review: 'bg-yellow-100 text-yellow-700',
  in_progress: 'bg-blue-100 text-blue-700',
  resolved: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-700',
  wont_fix: 'bg-red-100 text-red-700'
};

const statusLabels: Record<FeedbackStatus, string> = {
  new: 'Neu',
  in_review: 'In Prüfung',
  in_progress: 'In Bearbeitung',
  resolved: 'Gelöst',
  closed: 'Geschlossen',
  wont_fix: 'Nicht beheben'
};

const priorityColors: Record<string, string> = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-blue-100 text-blue-600',
  high: 'bg-orange-100 text-orange-600',
  critical: 'bg-red-100 text-red-600'
};

interface AdminFeedbackPanelProps {
  adminId: string;
}

const AdminFeedbackPanel: React.FC<AdminFeedbackPanelProps> = ({ adminId }) => {
  const { toast } = useToast();
  const [feedback, setFeedback] = useState<BetaFeedback[]>([]);
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    priority: ''
  });
  const [editingNotes, setEditingNotes] = useState<{ id: string; notes: string } | null>(null);

  const loadFeedback = async () => {
    setLoading(true);
    try {
      const [feedbackData, statsData] = await Promise.all([
        getAllFeedback({
          category: filters.category || undefined,
          status: filters.status || undefined,
          priority: filters.priority || undefined,
          limit: 50
        }),
        getFeedbackStats()
      ]);
      setFeedback(feedbackData.feedback);
      setStats(statsData);
    } catch (error) {
      toast({ title: 'Fehler', description: 'Feedback konnte nicht geladen werden', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedback();
  }, [filters]);

  const handleStatusChange = async (feedbackId: string, newStatus: FeedbackStatus) => {
    const success = await updateFeedbackStatus(feedbackId, newStatus);
    if (success) {
      toast({ title: 'Status aktualisiert' });
      loadFeedback();
    } else {
      toast({ title: 'Fehler', variant: 'destructive' });
    }
  };

  const handleSaveNotes = async () => {
    if (!editingNotes) return;
    const success = await updateFeedbackStatus(
      editingNotes.id,
      feedback.find(f => f.id === editingNotes.id)?.status || 'new',
      editingNotes.notes
    );
    if (success) {
      toast({ title: 'Notizen gespeichert' });
      setEditingNotes(null);
      loadFeedback();
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-500">Gesamt</div>
            </CardContent>
          </Card>
          <Card className="border-cyan-200 bg-cyan-50">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-cyan-700">{stats.byStatus.new}</div>
              <div className="text-sm text-cyan-600">Neu</div>
            </CardContent>
          </Card>
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-red-700">{stats.byCategory.bug}</div>
              <div className="text-sm text-red-600">Bugs</div>
            </CardContent>
          </Card>
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-amber-700">{stats.byCategory.feature}</div>
              <div className="text-sm text-amber-600">Features</div>
            </CardContent>
          </Card>
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-green-700">{stats.byStatus.resolved}</div>
              <div className="text-sm text-green-600">Gelöst</div>
            </CardContent>
          </Card>
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-orange-700">{stats.byPriority.high + stats.byPriority.critical}</div>
              <div className="text-sm text-orange-600">Hohe Priorität</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter:</span>
            </div>
            
            <Select value={filters.category} onValueChange={(v) => setFilters(f => ({ ...f, category: v }))}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Kategorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Alle Kategorien</SelectItem>
                <SelectItem value="bug">Bug</SelectItem>
                <SelectItem value="feature">Feature</SelectItem>
                <SelectItem value="feedback">Feedback</SelectItem>
                <SelectItem value="question">Frage</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.status} onValueChange={(v) => setFilters(f => ({ ...f, status: v }))}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Alle Status</SelectItem>
                <SelectItem value="new">Neu</SelectItem>
                <SelectItem value="in_review">In Prüfung</SelectItem>
                <SelectItem value="in_progress">In Bearbeitung</SelectItem>
                <SelectItem value="resolved">Gelöst</SelectItem>
                <SelectItem value="closed">Geschlossen</SelectItem>
                <SelectItem value="wont_fix">Nicht beheben</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.priority} onValueChange={(v) => setFilters(f => ({ ...f, priority: v }))}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priorität" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Alle Prioritäten</SelectItem>
                <SelectItem value="critical">Kritisch</SelectItem>
                <SelectItem value="high">Hoch</SelectItem>
                <SelectItem value="medium">Mittel</SelectItem>
                <SelectItem value="low">Niedrig</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" onClick={loadFeedback}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Aktualisieren
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Feedback List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Beta Feedback ({feedback.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : feedback.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Kein Feedback gefunden</p>
            </div>
          ) : (
            <div className="space-y-3">
              {feedback.map((item) => {
                const CategoryIcon = categoryIcons[item.category];
                const isExpanded = expandedId === item.id;
                
                return (
                  <div
                    key={item.id}
                    className={`border rounded-lg overflow-hidden transition-all ${
                      item.priority === 'critical' ? 'border-red-300 bg-red-50/50' :
                      item.priority === 'high' ? 'border-orange-200' : 'border-gray-200'
                    }`}
                  >
                    {/* Header */}
                    <div
                      className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50"
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    >
                      <div className={`p-2 rounded-lg ${categoryColors[item.category]}`}>
                        <CategoryIcon className="w-4 h-4" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900 truncate">{item.title}</span>
                          <Badge className={priorityColors[item.priority]} variant="outline">
                            {item.priority}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {item.user_name || item.user_email || 'Anonym'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: de })}
                          </span>
                          {item.screenshot_urls?.length > 0 && (
                            <span className="flex items-center gap-1">
                              <ImageIcon className="w-3 h-3" />
                              {item.screenshot_urls.length}
                            </span>
                          )}
                        </div>
                      </div>

                      <Badge className={statusColors[item.status]}>
                        {statusLabels[item.status]}
                      </Badge>

                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="border-t bg-white p-4 space-y-4">
                        {/* Description */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Beschreibung</h4>
                          <p className="text-gray-600 whitespace-pre-wrap">{item.description}</p>
                        </div>

                        {/* Screenshots */}
                        {item.screenshot_urls?.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Screenshots</h4>
                            <div className="flex flex-wrap gap-2">
                              {item.screenshot_urls.map((url, idx) => (
                                <a
                                  key={idx}
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block w-24 h-24 rounded-lg overflow-hidden border border-gray-200 hover:border-cyan-400 transition-colors"
                                >
                                  <img src={url} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Browser Info */}
                        {item.browser_info && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Technische Details</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                              <div className="flex items-center gap-1 text-gray-500">
                                <Monitor className="w-3 h-3" />
                                {(item.browser_info as any).screenWidth}x{(item.browser_info as any).screenHeight}
                              </div>
                              <div className="flex items-center gap-1 text-gray-500">
                                <Globe className="w-3 h-3" />
                                {(item.browser_info as any).language}
                              </div>
                              {item.page_url && (
                                <a
                                  href={item.page_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-cyan-600 hover:underline col-span-2"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  {item.page_url}
                                </a>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Admin Notes */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Admin-Notizen</h4>
                          {editingNotes?.id === item.id ? (
                            <div className="space-y-2">
                              <Textarea
                                value={editingNotes.notes}
                                onChange={(e) => setEditingNotes({ ...editingNotes, notes: e.target.value })}
                                placeholder="Notizen hinzufügen..."
                                rows={3}
                              />
                              <div className="flex gap-2">
                                <Button size="sm" onClick={handleSaveNotes}>Speichern</Button>
                                <Button size="sm" variant="outline" onClick={() => setEditingNotes(null)}>Abbrechen</Button>
                              </div>
                            </div>
                          ) : (
                            <div
                              className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600 cursor-pointer hover:bg-gray-100"
                              onClick={() => setEditingNotes({ id: item.id, notes: item.admin_notes || '' })}
                            >
                              {item.admin_notes || 'Klicken zum Hinzufügen...'}
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-2 border-t">
                          <span className="text-sm text-gray-500">Status ändern:</span>
                          <div className="flex flex-wrap gap-2">
                            {(['in_review', 'in_progress', 'resolved', 'closed', 'wont_fix'] as FeedbackStatus[]).map((status) => (
                              <Button
                                key={status}
                                size="sm"
                                variant={item.status === status ? 'default' : 'outline'}
                                className={item.status === status ? '' : 'text-xs'}
                                onClick={() => handleStatusChange(item.id, status)}
                              >
                                {statusLabels[status]}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminFeedbackPanel;
