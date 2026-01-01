import React from 'react'
import { ClientProvider } from './context/ClientContext';
import { MainLayout } from './components/layout/MainLayout';

function App() {
  return (
    <ClientProvider>
      <MainLayout />
    </ClientProvider>
  );
}

export default App;
