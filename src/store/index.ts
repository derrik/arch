import { create } from 'zustand';
import { GraphSlice, createGraphSlice } from './graph-slice';
import { UISlice, createUISlice } from './ui-slice';
import { DiagramsSlice, createDiagramsSlice } from './diagrams-slice';

export type AppStore = GraphSlice & UISlice & DiagramsSlice;

export const useStore = create<AppStore>()((...a) => ({
  ...createGraphSlice(...a),
  ...createUISlice(...a),
  ...createDiagramsSlice(...a),
}));
