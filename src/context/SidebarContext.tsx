import React, { createContext, useContext, useState } from 'react';

interface SidebarContextType {
  desktopOpen: boolean;
  setDesktopOpen: (open: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{
      desktopOpen,
      setDesktopOpen,
      mobileOpen,
      setMobileOpen
    }}>
      {children}
    </SidebarContext.Provider>
  );
};
