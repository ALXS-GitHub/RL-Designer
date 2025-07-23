import { useState } from 'react'
import './App.scss'
import { Home, Collection, Explore, About, HowTo } from '@/pages'
import Notifications from '@/components/Notifications/Notifications.tsx'
import Navbar from '@/components/Navbar/Navbar.tsx'
import ConfirmationDialog from './components/ConfirmationDialog/ConfirmationDialog'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import useCollection from '@/hooks/useCollection';

import { BrowserRouter, Routes, Route } from 'react-router-dom'

const queryClient = new QueryClient();

const AppInitializer: React.FC = () => {
  useCollection(); // Initialize collection store to ensure it's ready

  return null; 
}


function App() {
  return (
    <div className="app">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppInitializer />
          <Navbar />
          <Notifications />
          <ConfirmationDialog />
          <div className="app__content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/my-collection" element={<Collection />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/how-to" element={<HowTo />} />
            </Routes>
          </div>
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  )
}

export default App
