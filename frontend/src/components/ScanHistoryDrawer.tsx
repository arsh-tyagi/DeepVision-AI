import React from "react";
import { X, Clock, Trash2, ArrowUpRight } from "lucide-react";
import type { ForensicAnalysisResponse } from "../lib/api";

export interface ScanRecord {
  id: string;
  filename: string;
  analysis: ForensicAnalysisResponse;
  timestamp: string;
  thumbnailUrl: string;
}

interface ScanHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: ScanRecord[];
  onSelectRecord: (record: ScanRecord) => void;
  onClearHistory: () => void;
}

export const ScanHistoryDrawer: React.FC<ScanHistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectRecord,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/30 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md apple-glass bg-white/95 dark:bg-zinc-900/95 shadow-2xl flex flex-col justify-between border-l border-zinc-200 dark:border-zinc-800">
          {/* Header */}
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                Inspection History
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Records List */}
          <div className="p-6 overflow-y-auto flex-1 space-y-3">
            {history.length === 0 ? (
              <div className="text-center py-16 text-zinc-400 text-xs">
                No past scans found in this session.
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectRecord(item);
                    onClose();
                  }}
                  className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/60 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.filename}
                      className="w-11 h-11 rounded-xl object-cover border border-zinc-200 dark:border-zinc-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                        {item.filename}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-zinc-400 mt-0.5">
                        <span>{item.timestamp}</span>
                        <span>&bull;</span>
                        <span className="font-medium text-zinc-700 dark:text-zinc-300">
                          {item.analysis.verdict_badge}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        {item.analysis.authenticity_score}%
                      </span>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors" />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Controls */}
          {history.length > 0 && (
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
              <button
                onClick={onClearHistory}
                className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
