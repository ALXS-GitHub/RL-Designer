import { useState } from 'react'
import './App.scss'
import { Home, Collection, Explore } from '@/pages'
import Notifications from '@/components/Notifications/Notifications.tsx'
import Navbar from '@/components/Navbar/Navbar.tsx'
import ConfirmationDialog from './components/ConfirmationDialog/ConfirmationDialog'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

const queryClient = new QueryClient();

function App() {
  return (
    <div className="app">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Navbar />
          <Notifications />
          <ConfirmationDialog />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/my-collection" element={<Collection />} />
            <Route path="/explore" element={<Explore />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  )
}

export default App
