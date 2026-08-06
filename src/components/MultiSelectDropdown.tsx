import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X, Search, CheckSquare, Square } from 'lucide-react';

export interface MultiSelectOption {
  value: string;
  label: string;
  count?: number;
}

interface MultiSelectDropdownProps {
  label: string;
  options: MultiSelectOption[];
  selectedValues: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  label,
  options,
  selectedValues,
  onChange,
  placeholder = 'Semua Kategori',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isAllSelected = selectedValues.length === 0 || selectedValues.length === options.length;

  const handleToggleOption = (val: string) => {
    let updated: string[];
    if (selectedValues.length === 0) {
      // Was showing all, now toggling one option means selecting all EXCEPT or selecting just that one?
      // Convention: if currently showing all (empty array), clicking an option selects ONLY that option
      updated = [val];
    } else if (selectedValues.includes(val)) {
      updated = selectedValues.filter((v) => v !== val);
      if (updated.length === 0) {
        // If unchecking the last item, reset to [] (which means show all)
        updated = [];
      }
    } else {
      updated = [...selectedValues, val];
      if (updated.length === options.length) {
        updated = []; // All selected
      }
    }
    onChange(updated);
  };

  const handleSelectAll = () => {
    onChange([]); // [] represents all
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const getDisplayText = () => {
    if (isAllSelected) {
      return `${placeholder} (${options.length})`;
    }
    if (selectedValues.length === 1) {
      const match = options.find((o) => o.value === selectedValues[0]);
      return match ? match.label : selectedValues[0];
    }
    return `${selectedValues.length} Kategori Dipilih`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 font-medium cursor-pointer shadow-2xs hover:border-slate-400 transition-colors"
      >
        <span className="truncate pr-2 text-left">
          {!isAllSelected && selectedValues.length > 0 ? (
            <span className="inline-flex items-center gap-1.5">
              <span className="font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded text-[11px] border border-emerald-200">
                {selectedValues.length} terpilih
              </span>
              <span className="truncate max-w-[140px] text-slate-700">
                {selectedValues.slice(0, 2).join(', ')}
                {selectedValues.length > 2 ? '...' : ''}
              </span>
            </span>
          ) : (
            <span className="text-slate-700 font-medium">{getDisplayText()}</span>
          )}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-emerald-600' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full min-w-[260px] bg-white rounded-xl shadow-lg border border-slate-200 py-2 text-xs animate-in fade-in zoom-in-95 duration-100">
          {/* Search box inside dropdown */}
          <div className="px-2 pb-2 border-b border-slate-100 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari kategori..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-7 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1">
              <button
                type="button"
                onClick={handleSelectAll}
                className={`font-semibold transition-colors ${
                  isAllSelected
                    ? 'text-emerald-700 font-bold'
                    : 'text-slate-600 hover:text-emerald-700'
                }`}
              >
                Pilih Semua ({options.length})
              </button>

              {!isAllSelected && (
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-rose-600 hover:text-rose-800 font-semibold"
                >
                  Reset ({selectedValues.length})
                </button>
              )}
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-56 overflow-y-auto px-1 py-1 divide-y divide-slate-50">
            {filteredOptions.length === 0 ? (
              <div className="py-3 text-center text-slate-400 text-xs">
                Kategori tidak ditemukan
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isChecked = isAllSelected || selectedValues.includes(opt.value);
                return (
                  <div
                    key={opt.value}
                    onClick={() => handleToggleOption(opt.value)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors text-xs ${
                      isChecked && !isAllSelected
                        ? 'bg-emerald-50/70 text-emerald-950 font-semibold'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <div className="shrink-0 text-emerald-600">
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300" />
                        )}
                      </div>
                      <span className="truncate">{opt.label}</span>
                    </div>

                    {opt.count !== undefined && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono shrink-0 ${
                          isChecked && !isAllSelected
                            ? 'bg-emerald-200/60 text-emerald-900 font-bold'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {opt.count}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
