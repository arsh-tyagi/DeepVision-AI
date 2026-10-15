import React, { useState } from "react";
import { Moon, Sun, History, LogIn, LogOut, User, Info, BookOpen, Menu, X } from "lucide-react";

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenHistory: () => void;
  onOpenAuth: () => void;
  onOpenDisclaimer: () => void;
  onOpenDocs: () => void;
  user: any;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  onOpenHistory,
  onOpenAuth,
  onOpenDisclaimer,
  onOpenDocs,
  user,
  onSignOut,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-stone-950/95 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        {/* Brand with Proper Logo */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <img
            src="/logo.svg"
            alt="DeepVision-AI Logo"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg shadow-sm border border-orange-500/40 shrink-0"
          />
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-bold text-sm sm:text-base tracking-tight text-stone-900 dark:text-stone-100 font-mono">
                DeepVision-AI
              </span>
              <span className="tech-badge px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-900/60 text-[9px] sm:text-[10px]">
                v2.5
              </span>
            </div>
            <p className="text-[9px] text-stone-500 dark:text-stone-400 font-mono hidden md:block">
              MULTI-SIGNAL IMAGE FORENSIC RUNTIME
            </p>
          </div>
        </div>

        {/* Desktop Navigation (visible on sm and larger) */}
        <div className="hidden sm:flex items-center gap-2">
          {/* Docs Button */}
          <button
            onClick={onOpenDocs}
            className="px-2.5 py-1.5 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-900 border border-stone-200 dark:border-stone-800 transition-all flex items-center gap-1.5 text-xs font-mono"
            title="Forensic Documentation"
          >
            <BookOpen className="w-3.5 h-3.5 text-orange-500" />
            <span>Docs</span>
          </button>

          {/* Disclaimer Button */}
          <button
            onClick={onOpenDisclaimer}
            className="px-2.5 py-1.5 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-900 border border-stone-200 dark:border-stone-800 transition-all flex items-center gap-1.5 text-xs font-mono"
            title="Forensic Disclaimer"
          >
            <Info className="w-3.5 h-3.5 text-orange-500" />
            <span>Disclaimer</span>
          </button>

          {/* History Scan Trigger */}
          <button
            onClick={onOpenHistory}
            className="px-2.5 py-1.5 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-900 border border-stone-200 dark:border-stone-800 transition-all flex items-center gap-1.5 text-xs font-mono"
            title="Recent Scans"
          >
            <History className="w-3.5 h-3.5" />
            <span>History</span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-900 border border-stone-200 dark:border-stone-800 transition-all min-h-[38px] min-w-[38px] flex items-center justify-center"
            title="Toggle Theme"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-orange-400" /> : <Moon className="w-4 h-4 text-stone-600" />}
          </button>

          <div className="h-4 w-px bg-stone-200 dark:border-stone-800 mx-1" />

          {/* Auth Button */}
          {user ? (
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs font-mono text-stone-700 dark:text-stone-300">
                <User className="w-3.5 h-3.5 text-stone-500" />
                <span className="max-w-[100px] truncate">{user.email?.split("@")[0]}</span>
              </div>
              <button
                onClick={onSignOut}
                className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-900 text-stone-500 hover:text-rose-500 border border-stone-200 dark:border-stone-800 transition-colors"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 text-xs font-mono font-semibold transition-all flex items-center gap-1.5 border border-stone-800 dark:border-stone-200 min-h-[38px]"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          )}
        </div>

        {/* Mobile Header Controls (< sm) */}
        <div className="flex sm:hidden items-center gap-2">
          {/* Quick Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-900 border border-stone-200 dark:border-stone-800 transition-all min-h-[38px] min-w-[38px] flex items-center justify-center"
            title="Toggle Theme"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-orange-400" /> : <Moon className="w-4 h-4 text-stone-600" />}
          </button>

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900 border border-stone-300 dark:border-stone-700 min-h-[38px] min-w-[38px] flex items-center justify-center"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 p-4 space-y-2 shadow-lg animate-fade-in font-mono text-xs">
          <button
            onClick={() => { setMobileMenuOpen(false); onOpenDocs(); }}
            className="w-full py-2.5 px-3 rounded-lg text-left flex items-center gap-2.5 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900 border border-stone-200 dark:border-stone-800"
          >
            <BookOpen className="w-4 h-4 text-orange-500" />
            <span>Forensic Documentation (Docs)</span>
          </button>

          <button
            onClick={() => { setMobileMenuOpen(false); onOpenDisclaimer(); }}
            className="w-full py-2.5 px-3 rounded-lg text-left flex items-center gap-2.5 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900 border border-stone-200 dark:border-stone-800"
          >
            <Info className="w-4 h-4 text-orange-500" />
            <span>Forensic Disclaimer & Boundaries</span>
          </button>

          <button
            onClick={() => { setMobileMenuOpen(false); onOpenHistory(); }}
            className="w-full py-2.5 px-3 rounded-lg text-left flex items-center gap-2.5 text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900 border border-stone-200 dark:border-stone-800"
          >
            <History className="w-4 h-4" />
            <span>Recent Inspections History</span>
          </button>

          <div className="pt-2 border-t border-stone-200 dark:border-stone-800">
            {user ? (
              <div className="flex items-center justify-between p-2 rounded-lg bg-stone-100 dark:bg-stone-900">
                <span className="text-stone-600 dark:text-stone-300 truncate max-w-[200px]">{user.email}</span>
                <button
                  onClick={() => { setMobileMenuOpen(false); onSignOut(); }}
                  className="text-rose-500 font-semibold px-2 py-1"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }}
                className="w-full py-2.5 px-3 rounded-lg bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-semibold flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In / Register</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};