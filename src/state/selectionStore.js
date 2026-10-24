import { create } from 'zustand';
// Scoped provider owns this store; it is discarded on account changes.
export const createSelectionStore = () =>
  create((set) => ({
    selectedProjectId: null,
    selectedPackageId: null,
    selectProject: (selectedProjectId) =>
      set({ selectedProjectId, selectedPackageId: null }),
    selectPackage: (selectedPackageId) => set({ selectedPackageId }),
  }));
