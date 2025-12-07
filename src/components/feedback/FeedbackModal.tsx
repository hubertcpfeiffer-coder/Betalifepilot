import React, { useState, useRef, useCallback } from 'react';
import { X, Bug, Lightbulb, MessageSquare, HelpCircle, Upload, Camera, Trash2, Send, AlertTriangle, CheckCircle, Loader2, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { submitFeedback } from '@/services/feedbackService';
import { FeedbackCategory, FeedbackPriority, FeedbackFormData } from '@/types/feedback';
import { useToast } from '@/hooks/use-toast';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const categoryConfig: Record<FeedbackCategory, { icon: React.ElementType; label: string; description: string; color: string }> = {
  bug: {
    icon: Bug,
    label: 'Bug melden',
    description: 'Etwas funktioniert nicht wie erwartet',
    color: 'text-red-600 bg-red-50 border-red-200 hover:bg-red-100'
  },
  feature: {
    icon: Lightbulb,
    label: 'Feature-Wunsch',
    description: 'Eine neue Funktion vorschlagen',
    color: 'text-amber-600 bg-amber-50 border-amber-200 hover:bg-amber-100'
  },
  feedback: {
    icon: MessageSquare,
    label: 'Allgemeines Feedback',
    description: 'Lob, Kritik oder Verbesserungsvorschläge',
    color: 'text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100'
  },
  question: {
    icon: HelpCircle,
    label: 'Frage',
    description: 'Hilfe oder Erklärung benötigt',
    color: 'text-purple-600 bg-purple-50 border-purple-200 hover:bg-purple-100'
  }
};

const priorityConfig: Record<FeedbackPriority, { label: string; color: string; description: string }> = {
  low: { label: 'Niedrig', color: 'bg-gray-100 text-gray-700 border-gray-300', description: 'Kann warten' },
  medium: { label: 'Mittel', color: 'bg-blue-100 text-blue-700 border-blue-300', description: 'Normal' },
  high: { label: 'Hoch', color: 'bg-orange-100 text-orange-700 border-orange-300', description: 'Wichtig' },
  critical: { label: 'Kritisch', color: 'bg-red-100 text-red-700 border-red-300', description: 'Dringend' }
};

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [step, setStep] = useState<'category' | 'details' | 'success'>('category');
  const [formData, setFormData] = useState<FeedbackFormData>({
    category: 'feedback',
    title: '',
    description: '',
    priority: 'medium',
    screenshots: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleCategorySelect = (category: FeedbackCategory) => {
    setFormData(prev => ({ ...prev, category }));
    setStep('details');
  };

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    
    if (imageFiles.length + formData.screenshots.length > 5) {
      toast({
        title: 'Zu viele Bilder',
        description: 'Maximal 5 Screenshots erlaubt',
        variant: 'destructive'
      });
      return;
    }

    // Create preview URLs
    const newPreviewUrls = imageFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    setFormData(prev => ({
      ...prev,
      screenshots: [...prev.screenshots, ...imageFiles]
    }));
  }, [formData.screenshots.length, toast]);

  const removeScreenshot = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      screenshots: prev.screenshots.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        title: 'Fehlende Angaben',
        description: 'Bitte fülle Titel und Beschreibung aus',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitFeedback(
        formData,
        user?.id,
        user?.email,
        user?.full_name
      );

      if (result.success) {
        setStep('success');
        toast({
          title: 'Feedback gesendet!',
          description: 'Vielen Dank für dein Feedback. Wir werden es prüfen.',
        });
      } else {
        toast({
          title: 'Fehler',
          description: result.error || 'Feedback konnte nicht gesendet werden',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Ein unerwarteter Fehler ist aufgetreten',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Cleanup preview URLs
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setPreviewUrls([]);
    setFormData({
      category: 'feedback',
      title: '',
      description: '',
      priority: 'medium',
      screenshots: []
    });
    setStep('category');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-cyan-500 to-blue-600">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Beta Feedback</h2>
              <p className="text-xs text-cyan-100">Hilf uns, Mio besser zu machen</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {step === 'category' && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Was möchtest du uns mitteilen?</h3>
              <div className="grid grid-cols-1 gap-3">
                {(Object.entries(categoryConfig) as [FeedbackCategory, typeof categoryConfig[FeedbackCategory]][]).map(([key, config]) => {
                  const Icon = config.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => handleCategorySelect(key)}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${config.color}`}
                    >
                      <div className="p-2 rounded-lg bg-white/50">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{config.label}</div>
                        <div className="text-sm opacity-75">{config.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 'details' && (
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Category Badge */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStep('category')}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  ← Zurück
                </button>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${categoryConfig[formData.category].color}`}>
                  {React.createElement(categoryConfig[formData.category].icon, { className: 'w-4 h-4' })}
                  {categoryConfig[formData.category].label}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titel <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder={formData.category === 'bug' ? 'z.B. Button reagiert nicht' : 'Kurze Zusammenfassung'}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  maxLength={100}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Beschreibung <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder={
                    formData.category === 'bug' 
                      ? 'Was hast du gemacht? Was ist passiert? Was hättest du erwartet?' 
                      : 'Beschreibe dein Feedback so detailliert wie möglich...'
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                  rows={4}
                  maxLength={2000}
                  required
                />
                <div className="text-xs text-gray-400 text-right mt-1">
                  {formData.description.length}/2000
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priorität
                </label>
                <div className="flex flex-wrap gap-2">
                  {(Object.entries(priorityConfig) as [FeedbackPriority, typeof priorityConfig[FeedbackPriority]][]).map(([key, config]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, priority: key }))}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border-2 transition-all ${
                        formData.priority === key 
                          ? `${config.color} ring-2 ring-offset-1` 
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {config.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Screenshots */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Screenshots (optional)
                </label>
                
                {/* Preview Grid */}
                {previewUrls.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative group aspect-video rounded-lg overflow-hidden border border-gray-200">
                        <img src={url} alt={`Screenshot ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeScreenshot(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Button */}
                {previewUrls.length < 5 && (
                  <div className="flex gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-cyan-400 hover:text-cyan-600 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      Bild hochladen
                    </button>
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-1">Max. 5 Bilder, je max. 5MB</p>
              </div>

              {/* Browser Info Notice */}
              <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>
                  Wir erfassen automatisch technische Informationen (Browser, Bildschirmgröße, aktuelle Seite), um Probleme besser nachvollziehen zu können.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !formData.title.trim() || !formData.description.trim()}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-xl hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Wird gesendet...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Feedback senden
                  </>
                )}
              </button>
            </form>
          )}

          {step === 'success' && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Vielen Dank!</h3>
              <p className="text-gray-600 mb-6">
                Dein Feedback wurde erfolgreich übermittelt. Wir werden es sorgfältig prüfen und uns bei Bedarf bei dir melden.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setStep('category');
                    setFormData({
                      category: 'feedback',
                      title: '',
                      description: '',
                      priority: 'medium',
                      screenshots: []
                    });
                  }}
                  className="px-4 py-2 text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                >
                  Weiteres Feedback
                </button>
                <button
                  onClick={handleClose}
                  className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                >
                  Schließen
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal;
