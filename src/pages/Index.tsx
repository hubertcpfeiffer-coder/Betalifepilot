
import React from 'react';
import AppLayout from '@/components/AppLayout';
import { AppProvider } from '@/contexts/AppContext';
import { RealtimeProvider } from '@/contexts/RealtimeContext';

const Index: React.FC = () => {
  return (
    <AppProvider>
      <RealtimeProvider>
        <AppLayout />
      </RealtimeProvider>
    </AppProvider>
  );
};

export default Index;
