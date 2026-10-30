import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Building2, Users, Briefcase, PhoneCall } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();

  const items = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Properties', path: '/properties', icon: Building2 },
    { label: 'Co-Own', path: '/co-ownership', icon: Users },
    { label: 'Services', path: '/services', icon: Briefcase },
    { label: 'Contact', path: '/contact', icon: PhoneCall },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl px-2 py-1.5"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="grid grid-cols-5 items-center max-w-md mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
                active ? 'text-[#0A1D42] font-bold' : 'text-slate-500 hover:text-[#0A1D42]'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-[#0A1D42]' : 'text-slate-500'}`} />
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
