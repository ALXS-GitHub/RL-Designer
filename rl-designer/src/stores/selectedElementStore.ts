import { create } from 'zustand';
import type { ElementType } from '@/constants/elements';

interface SelectedElementState {
  selectedElement: ElementType;
  setSelectedElement: (element: ElementType) => void;
}

const useSelectedElementStore = create<SelectedElementState>((set) => ({
  selectedElement: 'car',
  setSelectedElement: (element) => set({ selectedElement: element }),
}));

export default useSelectedElementStore;
