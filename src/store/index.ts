import { create } from 'zustand';
import { GraphSlice, createGraphSlice } from './graph-slice';
import { UISlice, createUISlice } from './ui-slice';
import { DiagramsSlice, createDiagramsSlice } from './diagrams-slice';
import { IconStudioSlice, createIconStudioSlice } from './icon-studio-slice';

export type AppStore = GraphSlice & UISlice & DiagramsSlice & IconStudioSlice;

export const useStore = create<AppStore>()((...a) => ({
  ...createGraphSlice(...a),
  ...createUISlice(...a),
  ...createDiagramsSlice(...a),
  ...createIconStudioSlice(...a),
}));
