import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="mt-10 md:container mx-5 md:mx-auto">
      {children}
    </div>
  );
};

export default Layout;