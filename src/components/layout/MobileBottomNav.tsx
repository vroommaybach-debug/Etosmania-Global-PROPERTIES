import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Building, Users, Briefcase, PhoneCall } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Properties', path: '/properties', icon: Building },
  { label: 'Co-Own', path: '/co-ownership', icon: Users },
  { label: 'Services', path: '/services', icon: Briefcase },
  { label: 'Contact', path: '/contact', icon: PhoneCall },
];

export const MobileBottomNav: React.FC = () => {
  return (
    <nav
      aria-label="Mobile Quick Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#18062C]/98 backdrop-blur-md border-t border-purple-800/60 shadow-[0_-4px_20px_rgba(18,7,33,0.3)]"
    >
      <div className="grid grid-cols-5 h-16">
        {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-colors relative ${
                isActive ? 'text-[#F59E0B] font-bold' : 'text-purple-200/75 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#D4AF37] rounded-b-full" />
                )}
                <Icon className="w-4 h-4" />
                <span className="tracking-tight whitespace-nowrap">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
