import { NavLink } from 'react-router-dom';
import { Guitar, Upload as UploadIcon, BookOpen } from 'lucide-react';

const linkClasses = ({ isActive }) =>
  `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
  }`;

export default function Layout({ children }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Guitar className="h-6 w-6 text-emerald-400" />
            TabMaster
          </div>
          <nav className="flex items-center gap-2">
            <NavLink to="/upload" className={linkClasses}>
              <UploadIcon className="h-4 w-4" /> Upload
            </NavLink>
            <NavLink to="/library" className={linkClasses}>
              <BookOpen className="h-4 w-4" /> Library
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
