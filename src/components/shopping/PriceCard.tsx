import React from 'react';
import { ShopPrice, shopInfo } from '@/types/priceComparison';
import { Tag, Clock, CheckCircle, XCircle } from 'lucide-react';

interface PriceCardProps {
  price: ShopPrice;
  isCheapest: boolean;
  onSetAlert: () => void;
}

const PriceCard: React.FC<PriceCardProps> = ({ price, isCheapest, onSetAlert }) => {
  const shop = shopInfo[price.shopId];
  
  const formatDate = (date?: Date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
  };

  return (
    <div className={`relative p-4 rounded-xl border-2 transition-all hover:shadow-lg ${
      isCheapest ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'
    } ${!price.available ? 'opacity-60' : ''}`}>
      {isCheapest && price.available && (
        <div className="absolute -top-3 left-4 px-2 py-0.5 bg-green-500 text-white text-xs font-bold rounded-full">
          Günstigster Preis
        </div>
      )}
      
      {price.isOnSale && (
        <div className="absolute -top-3 right-4 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
          <Tag className="w-3 h-3" /> Angebot
        </div>
      )}

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: shop?.color || '#666' }}>
            {shop?.name.substring(0, 2) || '??'}
          </div>
          <span className="font-semibold text-gray-900">{price.shopName}</span>
        </div>
        {price.available ? (
          <CheckCircle className="w-5 h-5 text-green-500" />
        ) : (
          <XCircle className="w-5 h-5 text-red-400" />
        )}
      </div>

      <div className="flex items-end gap-2 mb-2">
        <span className={`text-2xl font-bold ${isCheapest ? 'text-green-600' : 'text-gray-900'}`}>
          {price.price.toFixed(2)} €
        </span>
        {price.originalPrice && (
          <span className="text-sm text-gray-400 line-through">{price.originalPrice.toFixed(2)} €</span>
        )}
        <span className="text-sm text-gray-500">/ {price.unit}</span>
      </div>

      {price.isOnSale && price.saleEndDate && (
        <div className="flex items-center gap-1 text-xs text-orange-600 mb-2">
          <Clock className="w-3 h-3" />
          Angebot bis {formatDate(price.saleEndDate)}
        </div>
      )}

      <button onClick={onSetAlert}
        className="w-full mt-2 py-2 px-3 text-sm font-medium rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors">
        Preisalarm setzen
      </button>
    </div>
  );
};

export default PriceCard;
