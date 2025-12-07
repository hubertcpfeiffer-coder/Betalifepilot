import React, { useState } from 'react';
import { X, Bell, Tag, Store } from 'lucide-react';
import { ShopId, shopInfo, PriceAlert } from '@/types/priceComparison';

interface PriceAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  currentPrice?: number;
  onSave: (alert: Omit<PriceAlert, 'id' | 'productId' | 'createdAt'>) => void;
}

const allShops: ShopId[] = ['rewe', 'kaufland', 'lidl', 'edeka', 'aldi-sued', 'penny', 'netto', 'dm', 'rossmann'];

const PriceAlertModal: React.FC<PriceAlertModalProps> = ({ isOpen, onClose, productName, currentPrice, onSave }) => {
  const [targetPrice, setTargetPrice] = useState(currentPrice ? (currentPrice * 0.9).toFixed(2) : '');
  const [notifyOnSale, setNotifyOnSale] = useState(true);
  const [selectedShops, setSelectedShops] = useState<ShopId[]>(allShops);

  if (!isOpen) return null;

  const toggleShop = (shopId: ShopId) => {
    setSelectedShops(prev => 
      prev.includes(shopId) ? prev.filter(s => s !== shopId) : [...prev, shopId]
    );
  };

  const handleSave = () => {
    onSave({
      productName,
      targetPrice: targetPrice ? parseFloat(targetPrice) : undefined,
      notifyOnSale,
      shops: selectedShops,
      enabled: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-rose-500 to-pink-500">
          <div className="flex items-center gap-2 text-white">
            <Bell className="w-5 h-5" />
            <h2 className="font-bold text-lg">Preisalarm erstellen</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
          <div className="p-3 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-500">Produkt</p>
            <p className="font-semibold text-gray-900">{productName}</p>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Tag className="w-4 h-4" /> Zielpreis (optional)
            </label>
            <div className="relative">
              <input type="number" step="0.01" value={targetPrice} onChange={(e) => setTargetPrice(e.target.value)}
                placeholder="z.B. 1.99" className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-rose-500" />
              <span className="absolute right-4 top-2 text-gray-400">€</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Benachrichtigung wenn Preis unter diesem Wert</p>
          </div>

          <label className="flex items-center gap-3 p-3 bg-rose-50 rounded-xl cursor-pointer">
            <input type="checkbox" checked={notifyOnSale} onChange={(e) => setNotifyOnSale(e.target.checked)}
              className="w-5 h-5 rounded text-rose-500 focus:ring-rose-500" />
            <div>
              <p className="font-medium text-gray-900">Bei Angeboten benachrichtigen</p>
              <p className="text-xs text-gray-500">Sofort informiert wenn das Produkt im Angebot ist</p>
            </div>
          </label>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Store className="w-4 h-4" /> Geschäfte überwachen
            </label>
            <div className="grid grid-cols-3 gap-2">
              {allShops.map(shopId => (
                <button key={shopId} onClick={() => toggleShop(shopId)}
                  className={`p-2 rounded-lg text-xs font-medium transition-all ${
                    selectedShops.includes(shopId) ? 'text-white' : 'bg-gray-100 text-gray-600'
                  }`} style={{ backgroundColor: selectedShops.includes(shopId) ? shopInfo[shopId].color : undefined }}>
                  {shopInfo[shopId].name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t bg-gray-50 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 px-4 rounded-xl border text-gray-700 hover:bg-gray-100">
            Abbrechen
          </button>
          <button onClick={handleSave} className="flex-1 py-2 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium hover:opacity-90">
            Alarm aktivieren
          </button>
        </div>
      </div>
    </div>
  );
};

export default PriceAlertModal;
