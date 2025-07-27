import { create } from 'zustand';
import type { PageType } from '@/constants/pages'

interface PageState {
  lastPage: PageType;
  setLastPage: (page: PageType) => void;
}

const usePageStore = create<PageState>((set) => ({
  lastPage: 'collection', // Default page
  setLastPage: (page) => set({ lastPage: page }),
}));

export default usePageStore;