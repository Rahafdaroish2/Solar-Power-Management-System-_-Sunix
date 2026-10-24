import React, { createContext, useContext, useState } from 'react';
import { useStore } from 'zustand';
import { createSelectionStore } from '../state/selectionStore';
const SelectionContext = createContext(null);
export function SelectionProvider({ children }) {
  const [store] = useState(createSelectionStore);
  return (
    <SelectionContext.Provider value={store}>
      {children}
    </SelectionContext.Provider>
  );
}
export function useSelection(selector) {
  const store = useContext(SelectionContext);
  if (!store) throw new Error('useSelection requires SelectionProvider');
  return useStore(store, selector);
}
