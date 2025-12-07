// Preisvergleich Typen

export type ShopId = 'rewe' | 'kaufland' | 'lidl' | 'edeka' | 'aldi-sued' | 'aldi-nord' | 'penny' | 'netto' | 'dm' | 'rossmann' | 'mueller' | 'amazon';

export interface ShopPrice {
  shopId: ShopId;
  shopName: string;
  price: number;
  originalPrice?: number;
  isOnSale: boolean;
  saleEndDate?: Date;
  unit: string;
  available: boolean;
  lastUpdated: Date;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  brand?: string;
  imageUrl?: string;
  description?: string;
}

export interface PriceComparisonResult {
  product: Product;
  prices: ShopPrice[];
  cheapestShop: ShopId;
  averagePrice: number;
  searchedAt: Date;
}

export interface PriceAlert {
  id: string;
  productId: string;
  productName: string;
  targetPrice?: number;
  notifyOnSale: boolean;
  shops: ShopId[];
  enabled: boolean;
  createdAt: Date;
  lastTriggered?: Date;
}

export interface PriceAlertNotification {
  id: string;
  alertId: string;
  productName: string;
  shopId: ShopId;
  shopName: string;
  currentPrice: number;
  originalPrice?: number;
  savedAmount?: number;
  timestamp: Date;
  isRead: boolean;
}

export const shopInfo: Record<ShopId, { name: string; color: string }> = {
  'rewe': { name: 'REWE', color: '#CC071E' },
  'kaufland': { name: 'Kaufland', color: '#E10915' },
  'lidl': { name: 'Lidl', color: '#0050AA' },
  'edeka': { name: 'EDEKA', color: '#FFE500' },
  'aldi-sued': { name: 'ALDI SÜD', color: '#00005F' },
  'aldi-nord': { name: 'ALDI Nord', color: '#1C3F94' },
  'penny': { name: 'Penny', color: '#CD1719' },
  'netto': { name: 'Netto', color: '#FFE500' },
  'dm': { name: 'dm', color: '#008A52' },
  'rossmann': { name: 'Rossmann', color: '#C8102E' },
  'mueller': { name: 'Müller', color: '#E30613' },
  'amazon': { name: 'Amazon', color: '#FF9900' },
};
