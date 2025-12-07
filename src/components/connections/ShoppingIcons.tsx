import React from 'react';

interface Props {
  service: string;
  className?: string;
}

const ShoppingIcons: React.FC<Props> = ({ service, className = "w-6 h-6" }) => {
  const icons: Record<string, React.ReactNode> = {
    rewe: <svg viewBox="0 0 24 24" className={className}><rect fill="#CC071E" width="24" height="24" rx="4"/><text x="12" y="16" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">REWE</text></svg>,
    kaufland: <svg viewBox="0 0 24 24" className={className}><rect fill="#E10915" width="24" height="24" rx="4"/><text x="12" y="15" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">K</text><rect x="4" y="17" width="16" height="3" fill="#FFF"/></svg>,
    lidl: <svg viewBox="0 0 24 24" className={className}><rect fill="#0050AA" width="24" height="24" rx="4"/><circle cx="12" cy="12" r="8" fill="#FFF200"/><text x="12" y="15" textAnchor="middle" fill="#0050AA" fontSize="6" fontWeight="bold">Lidl</text></svg>,
    edeka: <svg viewBox="0 0 24 24" className={className}><rect fill="#FFE500" width="24" height="24" rx="4"/><text x="12" y="15" textAnchor="middle" fill="#1A1A6C" fontSize="6" fontWeight="bold">EDEKA</text></svg>,
    aldi: <svg viewBox="0 0 24 24" className={className}><rect fill="#00005F" width="24" height="24" rx="4"/><text x="12" y="10" textAnchor="middle" fill="#FFF" fontSize="5" fontWeight="bold">ALDI</text><text x="12" y="17" textAnchor="middle" fill="#FF6B00" fontSize="5" fontWeight="bold">SÜD</text></svg>,
    'aldi-nord': <svg viewBox="0 0 24 24" className={className}><rect fill="#1C3F94" width="24" height="24" rx="4"/><text x="12" y="10" textAnchor="middle" fill="#FFF" fontSize="5" fontWeight="bold">ALDI</text><text x="12" y="17" textAnchor="middle" fill="#FFF" fontSize="5">Nord</text></svg>,
    penny: <svg viewBox="0 0 24 24" className={className}><rect fill="#CD1719" width="24" height="24" rx="4"/><text x="12" y="15" textAnchor="middle" fill="#FFF" fontSize="6" fontWeight="bold">PENNY</text></svg>,
    netto: <svg viewBox="0 0 24 24" className={className}><rect fill="#FFE500" width="24" height="24" rx="4"/><text x="12" y="15" textAnchor="middle" fill="#000" fontSize="6" fontWeight="bold">netto</text></svg>,
    dm: <svg viewBox="0 0 24 24" className={className}><rect fill="#008A52" width="24" height="24" rx="4"/><text x="12" y="16" textAnchor="middle" fill="#FFF" fontSize="10" fontWeight="bold">dm</text></svg>,
    rossmann: <svg viewBox="0 0 24 24" className={className}><rect fill="#C8102E" width="24" height="24" rx="4"/><text x="12" y="14" textAnchor="middle" fill="#FFF" fontSize="5" fontWeight="bold">ROSS</text><text x="12" y="19" textAnchor="middle" fill="#FFF" fontSize="5" fontWeight="bold">MANN</text></svg>,
    mueller: <svg viewBox="0 0 24 24" className={className}><rect fill="#E30613" width="24" height="24" rx="4"/><text x="12" y="15" textAnchor="middle" fill="#FFF" fontSize="6" fontWeight="bold">Müller</text></svg>,
    amazon: <svg viewBox="0 0 24 24" className={className}><rect fill="#232F3E" width="24" height="24" rx="4"/><path fill="#FF9900" d="M6 14c3 2 9 2 12 0M6 16l2-2 2 2"/></svg>,
    ebay: <svg viewBox="0 0 24 24" className={className}><rect fill="#FFF" width="24" height="24" rx="4" stroke="#E53238"/><text x="3" y="15" fill="#E53238" fontSize="6" fontWeight="bold">e</text><text x="8" y="15" fill="#0064D2" fontSize="6" fontWeight="bold">b</text><text x="13" y="15" fill="#F5AF02" fontSize="6" fontWeight="bold">a</text><text x="18" y="15" fill="#86B817" fontSize="6" fontWeight="bold">y</text></svg>,
    payback: <svg viewBox="0 0 24 24" className={className}><rect fill="#0046AA" width="24" height="24" rx="4"/><text x="12" y="15" textAnchor="middle" fill="#FFF" fontSize="5" fontWeight="bold">PAYBACK</text></svg>,
    deutschlandcard: <svg viewBox="0 0 24 24" className={className}><rect fill="#E30613" width="24" height="24" rx="4"/><text x="12" y="14" textAnchor="middle" fill="#FFF" fontSize="4" fontWeight="bold">Deutschland</text><text x="12" y="19" textAnchor="middle" fill="#FFF" fontSize="4" fontWeight="bold">Card</text></svg>,
  };
  return <>{icons[service] || null}</>;
};

export default ShoppingIcons;
