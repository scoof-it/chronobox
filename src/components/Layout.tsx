import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="mt-10 mx-5 md:mx-auto md:container">
      {children}
    </div>
  );
};

export default Layout;