import React, { useState } from 'react';
import { ClientProvider } from './context/ClientContext';
import { MainLayout } from './components/layout/MainLayout';
import { LandingPage } from './components/LandingPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <ClientProvider>
      {!isLoggedIn ? (
        <LandingPage onLogin={() => setIsLoggedIn(true)} />
      ) : (
        <MainLayout />
      )}
    </ClientProvider>
  );
}

export default App;
