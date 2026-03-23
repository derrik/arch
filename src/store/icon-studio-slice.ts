import { StateCreator } from 'zustand';
import type { IconMeta } from '@/types/icon';
import { loadWorkspaceIcons, loadLibraryIcons } from '@/icons/custom';

export type IconStudioSubView = 'workspace' | 'library';

export interface IconStudioSlice {
  iconStudioSubView: IconStudioSubView;
  workspaceIcons: IconMeta[];
  libraryIcons: IconMeta[];
  selectedIconId: string | null;
  setIconStudioSubView: (view: IconStudioSubView) => void;
  setSelectedIconId: (id: string | null) => void;
  refreshIcons: () => void;
}

export const createIconStudioSlice: StateCreator<IconStudioSlice, [], [], IconStudioSlice> = (set) => ({
  iconStudioSubView: 'workspace',
  workspaceIcons: loadWorkspaceIcons(),
  libraryIcons: loadLibraryIcons(),
  selectedIconId: null,

  setIconStudioSubView: (view) => set({ iconStudioSubView: view, selectedIconId: null }),
  setSelectedIconId: (id) => set({ selectedIconId: id }),
  refreshIcons: () => set({
    workspaceIcons: loadWorkspaceIcons(),
    libraryIcons: loadLibraryIcons(),
  }),
});
