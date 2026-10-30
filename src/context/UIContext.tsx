import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UIContextType {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  openInspectionModal: (propertyContext?: { title: string; location: string; id: string }) => void;
  closeInspectionModal: () => void;
  inspectionProperty: { title: string; location: string; id: string } | null;
  savedIds: string[];
  toggleSavedProperty: (id: string) => void;
  clearSavedProperties: () => void;
  isSavedDrawerOpen: boolean;
  openSavedDrawer: () => void;
  closeSavedDrawer: () => void;
}

const STORAGE_KEY_SAVED = 'etosmania_saved_properties_v1';

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inspectionProperty, setInspectionProperty] = useState<{
    title: string;
    location: string;
    id: string;
  } | null>(null);

  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SAVED);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(savedIds));
    } catch {
      // ignore storage errors
    }
  }, [savedIds]);

  const openInspectionModal = (propertyContext?: { title: string; location: string; id: string }) => {
    setInspectionProperty(propertyContext || null);
    setIsModalOpen(true);
  };

  const closeInspectionModal = () => {
    setInspectionProperty(null);
    setIsModalOpen(false);
  };

  const toggleSavedProperty = (id: string) => {
    setSavedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const clearSavedProperties = () => {
    setSavedIds([]);
  };

  const openSavedDrawer = () => setIsSavedDrawerOpen(true);
  const closeSavedDrawer = () => setIsSavedDrawerOpen(false);

  return (
    <UIContext.Provider
      value={{
        isModalOpen,
        setIsModalOpen,
        openInspectionModal,
        closeInspectionModal,
        inspectionProperty,
        savedIds,
        toggleSavedProperty,
        clearSavedProperties,
        isSavedDrawerOpen,
        openSavedDrawer,
        closeSavedDrawer,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}
