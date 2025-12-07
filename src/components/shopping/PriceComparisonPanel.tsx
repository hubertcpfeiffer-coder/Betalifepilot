import React, { useState } from 'react';
import { X, Search, Loader2, TrendingDown, Bell, ShoppingBag } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PriceComparisonResult, ShopId, PriceAlert } from '@/types/priceComparison';
import PriceCard from './PriceCard';
import PriceAlertModal from './PriceAlertModal';

interface PriceComparisonPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const PriceComparisonPanel: React.FC<PriceComparisonPanelProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PriceComparisonResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [alertModal, setAlertModal] = useState<{ open: boolean; shopId?: ShopId }>({ open: false });
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('price-comparison', {
        body: { productName: searchQuery }
      });
      if (fnError) throw fnError;
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Fehler beim Preisvergleich');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAlert = (alert: Omit<PriceAlert, 'id' | 'productId' | 'createdAt'>) => {
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    const newAlert: PriceAlert = { ...alert, id, productId: result?.product.id || '', createdAt: new Date() };
    setAlerts(prev => [...prev, newAlert]);
  };

  const popularProducts = ['Milch 1L', 'Nutella 450g', 'Butter 250g', 'Eier 10er', 'Toilettenpapier', 'Mineralwasser 1.5L'];


  if (!isOpen) return null;

  const cheapestPrice = result?.prices.find(p => p.shopId === result.cheapestShop && p.available);
  const savings = cheapestPrice && result ? (result.averagePrice - cheapestPrice.price).toFixed(2) : '0';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-rose-500 to-orange-500">
          <div className="flex items-center gap-3 text-white">
            <ShoppingBag className="w-6 h-6" />
            <div>
              <h2 className="font-bold text-xl">Preisvergleich</h2>
              <p className="text-sm text-white/80">Finde die besten Preise bei REWE, Kaufland, Lidl & mehr</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg"><X className="w-6 h-6 text-white" /></button>
        </div>

        <div className="p-4 border-b bg-gray-50">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Produkt eingeben, z.B. Milch, Nutella, Toilettenpapier..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-rose-500" />
            </div>
            <button onClick={handleSearch} disabled={isLoading}
              className="px-6 py-3 bg-gradient-to-r from-rose-500 to-orange-500 text-white font-medium rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center gap-2">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              Vergleichen
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {error && <div className="p-4 bg-red-50 text-red-700 rounded-xl mb-4">{error}</div>}
          
          {!result && !isLoading && (
            <div className="text-center py-8">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 mb-6">Gib ein Produkt ein, um Preise zu vergleichen</p>
              <div className="max-w-md mx-auto">
                <p className="text-sm text-gray-400 mb-3">Beliebte Produkte:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {popularProducts.map(p => (
                    <button key={p} onClick={() => { setSearchQuery(p); }}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-rose-100 hover:text-rose-600 rounded-full text-sm transition-colors">
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-rose-500" />
              <p className="text-gray-600">Suche Preise bei allen Geschäften...</p>
            </div>
          )}


          {result && !isLoading && (
            <>
              <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{result.product.name}</h3>
                    <p className="text-sm text-gray-600">Durchschnittspreis: {result.averagePrice.toFixed(2)} €</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-green-600">
                      <TrendingDown className="w-5 h-5" />
                      <span className="font-bold text-lg">Spare {savings} €</span>
                    </div>
                    <p className="text-xs text-gray-500">beim günstigsten Anbieter</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {result.prices.sort((a, b) => a.price - b.price).map((price) => (
                  <PriceCard key={price.shopId} price={price} isCheapest={price.shopId === result.cheapestShop}
                    onSetAlert={() => setAlertModal({ open: true, shopId: price.shopId })} />
                ))}
              </div>
            </>
          )}

          {alerts.length > 0 && (
            <div className="mt-6 p-4 bg-rose-50 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <Bell className="w-5 h-5 text-rose-600" />
                <h3 className="font-semibold text-gray-900">Aktive Preisalarme ({alerts.length})</h3>
              </div>
              <div className="space-y-2">
                {alerts.map(alert => (
                  <div key={alert.id} className="flex items-center justify-between p-2 bg-white rounded-lg text-sm">
                    <span className="font-medium">{alert.productName}</span>
                    <span className="text-gray-500">{alert.targetPrice ? `unter ${alert.targetPrice}€` : 'Bei Angeboten'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <PriceAlertModal isOpen={alertModal.open} onClose={() => setAlertModal({ open: false })}
        productName={result?.product.name || searchQuery}
        currentPrice={result?.prices.find(p => p.shopId === alertModal.shopId)?.price}
        onSave={handleSaveAlert} />
    </div>
  );
};

export default PriceComparisonPanel;
