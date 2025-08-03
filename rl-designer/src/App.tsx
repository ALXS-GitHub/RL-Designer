import { useState } from 'react'
import './App.scss'
import { Home, Collection, Explore, About, HowTo, Preview } from '@/pages'
import { Loading, Error } from '@/components'
import Notifications from '@/components/Notifications/Notifications.tsx'
import Navbar from '@/components/Navbar/Navbar.tsx'
import ConfirmationDialog from './components/ConfirmationDialog/ConfirmationDialog'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useCollectionData } from '@/hooks/useCollection';

import { BrowserRouter, Routes, Route } from 'react-router-dom'

const queryClient = new QueryClient();


interface AppLoaderProps {
  children: React.ReactNode;
}

const AppLoader = ({ children }: AppLoaderProps) => {
  const { decals, isLoading, isError } = useCollectionData();

  if (isLoading && decals.length === 0) return <Loading />;
  if (isError) return <Error message={isError.message} />;

  return <>{children}</>;
};


function App() {
  return (
    <div className="app">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppLoader >
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
              <Route path='/preview/:decal/:variant_name' element={<Preview />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </div>
          </AppLoader>
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  )
}

export default App
