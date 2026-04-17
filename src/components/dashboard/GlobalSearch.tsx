'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Loader2,
  X,
  User,
  Target,
  Building2,
  Briefcase,
  Mail,
  Calendar,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearch } from '@/context/SearchContext';
import { getCompanies, getLeads, getDeals } from '@/lib/api';
import { Lead } from '@/app/types/leadtypes';
import { Company } from '@/app/types/companytypes';
import { Deal } from '@/app/types/dealtypes';


// --- Types ---
interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  type: 'contact' | 'lead' | 'company' | 'deal' | 'email' | 'ticket';
  metadata?: string;
}

interface GroupedResults {
  contacts: SearchResult[];
  leads: SearchResult[];
  companies: SearchResult[];
  deals: SearchResult[];
  emails: SearchResult[];
  tickets: SearchResult[];
}

interface Filters {
  entityType: string;
  status: string;
  dateRange: string;
}

// --- Component ---
export default function GlobalSearch() {
  const router = useRouter();
  const { searchQuery, setSearchQuery } = useSearch();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<GroupedResults | null>(null);
  const [filters, setFilters] = useState<Filters>({
    entityType: 'All Types',
    status: 'All Status',
    dateRange: 'All Time'
  });

  const debouncedQuery = useDebounce(searchQuery, 300);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // --- Click Outside Handler ---
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- Fetch Search Results ---
  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery.trim()) {
        setResults(null);
        return;
      }

      setIsLoading(true);
      setIsOpen(true);

       try {
    const [companies, leads, deals] = await Promise.all([
      getCompanies(),
      getLeads(),
      getDeals()
    ]);

    const query = debouncedQuery.toLowerCase();

    const filterFn = (item: any) => {
  const query = debouncedQuery.toLowerCase();

  return (
    item.name?.toLowerCase().includes(query) ||
    item.email?.toLowerCase().includes(query) ||
    item.phone?.toLowerCase().includes(query) ||
    item.company?.toLowerCase().includes(query) ||
    item.industry?.toLowerCase().includes(query) ||
    item.city?.toLowerCase().includes(query) ||
    item.country?.toLowerCase().includes(query) ||
    item.stage?.toLowerCase().includes(query) ||
    item.status?.toLowerCase().includes(query) ||
    item.ownerName?.toLowerCase().includes(query) ||
    item.assignedTo?.toLowerCase().includes(query) 
  );
};

    const formattedResults: GroupedResults = {
      companies: companies.filter(filterFn).map((c: Company) => ({
         id: c.id.toString(),
  title: c.name,                 // ✅ MAIN TEXT
  subtitle: c.industry,          // ✅ SMALL TEXT
  metadata: c.city,              // ✅ OPTIONAL
        type: 'company'
      })),
      leads: leads.filter(filterFn).map((l: Lead) => ({
       id: l.id.toString(),
  title: l.name,                 // or l.title if exists
  subtitle: l.company,           // company name
  metadata: l.status,            // optional
  type: 'lead'
      })),
      deals: deals.filter(filterFn).map((d: Deal) => ({
  
   id: d.id.toString(),
  title: d.name,                 // deal name
  subtitle: d.amount?.toString(),// amount
  metadata: d.stage,             // stage
  type: 'deal'
      })),
      contacts: [],
      emails: [],
      tickets: []
    };

    setResults(formattedResults);

  } catch (error) {
    console.error(error);
  } finally {
    setIsLoading(false);
  }
};

    fetchResults();
  }, [debouncedQuery, filters]);

  const handleResultClick = (result: SearchResult) => {
    setIsOpen(false);
    setSearchQuery('');

    // Map types to routes
    const routeMap = {
      contact: '/dashboard/leads', // assuming contacts are leads in this context
      lead: '/dashboard/leads',
      company: '/dashboard/companies',
      deal: '/dashboard/deals',
      email: '/dashboard/activities', // or appropriate route
      ticket: '/dashboard/tickets'
    };

    router.push(`${routeMap[result.type]}/${result.id}`);
  };

  const hasResults = results && Object.values(results).some(group => group.length > 0);

  return (
    <div className="relative w-full max-w-[500px]" ref={dropdownRef}>
      {/* --- Search Input Container --- */}
      <div className={`
        flex items-center gap-3 px-4 py-2.5 rounded-2xl border transition-all duration-200
        ${isOpen ? 'bg-white border-indigo-400 shadow-lg ring-4 ring-indigo-50' : 'bg-gray-50 border-gray-200'}
      `}>
        <Search className={`w-5 h-5 ${isOpen ? 'text-indigo-500' : 'text-gray-400'}`} />
        <input
          type="text"
          placeholder="Search everything..."
          className="w-full bg-transparent outline-none text-[15px] text-gray-900 placeholder-gray-400"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery.trim() && setIsOpen(true)}
        />
        {isLoading ? (
          <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
        ) : searchQuery && (
          <button onClick={() => { setSearchQuery(''); setResults(null); setIsOpen(false); }}>
            <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* --- Dropdown Results --- */}
      {isOpen && searchQuery.trim() && (
        <div className="absolute top-[calc(100%+12px)] right-0 w-[600px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">

          {/* --- Filters Header --- */}
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50/50 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-[13px] font-bold text-gray-400 uppercase tracking-tight">
                <Filter className="w-3.5 h-3.5" />
                <span>Filters</span>
              </div>

              <div className="h-4 w-px bg-gray-200 mx-2" />

              <div className="flex items-center gap-2">
                <select
                  value={filters.entityType}
                  onChange={(e) => setFilters(prev => ({ ...prev, entityType: e.target.value }))}
                  className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-[12px] font-semibold text-gray-700 outline-none focus:border-indigo-500 hover:border-gray-300 transition-all cursor-pointer shadow-sm"
                >
                  <option>All Types</option>
                  <option>Contacts</option>
                  <option>Leads</option>
                  <option>Companies</option>
                  <option>Deals</option>
                  <option>Emails</option>
                  <option>Tickets</option>
                </select>

                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-[12px] font-semibold text-gray-700 outline-none focus:border-indigo-500 hover:border-gray-300 transition-all cursor-pointer shadow-sm"
                >
                  <option>All Status</option>
                  <option>Open</option>
                  <option>Won</option>
                  <option>In Progress</option>
                  <option>Closed</option>
                </select>

                <select
                  value={filters.dateRange}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                  className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-[12px] font-semibold text-gray-700 outline-none focus:border-indigo-500 hover:border-gray-300 transition-all cursor-pointer shadow-sm"
                >
                  <option>All Time</option>
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>This Year</option>
                </select>
              </div>
            </div>

            <div className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
              {Object.values(results || {}).flat().length} Results
            </div>
          </div>

          <div className="max-h-[480px] overflow-y-auto custom-scrollbar">
            {isLoading && !results && (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-gray-400">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                <p className="text-sm font-medium">Searching across records...</p>
              </div>
            )}

            {!isLoading && !hasResults && (
              <div className="flex flex-col items-center justify-center py-12 gap-2 text-gray-400">
                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-2">
                  <Search className="w-6 h-6" />
                </div>
                <p className="text-[15px] font-semibold text-gray-600">No results found for "{debouncedQuery}"</p>
                <p className="text-sm">Try searching with different keywords or filters</p>
              </div>
            )}

            {!isLoading && results && (
              <div className="p-2">
                <ResultGroup
                  title="Leads"
                  results={results.leads}
                  icon={<Target className="w-4 h-4" />}
                  color="emerald"
                  onClick={handleResultClick}
                  searchQuery={debouncedQuery}
                />
                <ResultGroup
                  title="Contacts"
                  results={results.contacts}
                  icon={<User className="w-4 h-4" />}
                  color="blue"
                  onClick={handleResultClick}
                  searchQuery={debouncedQuery}
                />
                <ResultGroup
                  title="Companies"
                  results={results.companies}
                  icon={<Building2 className="w-4 h-4" />}
                  color="amber"
                  onClick={handleResultClick}
                  searchQuery={debouncedQuery}
                />
                <ResultGroup
                  title="Deals"
                  results={results.deals}
                  icon={<Briefcase className="w-4 h-4" />}
                  color="indigo"
                  onClick={handleResultClick}
                  searchQuery={debouncedQuery}
                />
                <ResultGroup
                  title="Emails"
                  results={results.emails}
                  icon={<Mail className="w-4 h-4" />}
                  color="rose"
                  onClick={handleResultClick}
                  searchQuery={debouncedQuery}
                />
                <ResultGroup
                  title="Tickets"
                  results={results.tickets}
                  icon={<Calendar className="w-4 h-4" />}
                  color="rose"
                  onClick={handleResultClick}
                  searchQuery={debouncedQuery}
                />
              </div>
            )}
          </div>

          {/* --- Dropdown Footer --- */}
          {hasResults && (
            <div className="px-6 py-3 bg-indigo-600 flex items-center justify-between text-white hover:bg-indigo-700 cursor-pointer transition-colors">
              <span className="text-[13px] font-semibold italic opacity-90">Press Enter for Advanced Search</span>
              <div className="flex items-center gap-1 text-[13px] font-bold">
                See all results
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E2E8F0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #CBD5E1;
        }
      `}</style>
    </div>
  );
}

// --- Sub-components ---
function ResultGroup({
  title,
  results,
  icon,
  color,
  onClick,
  searchQuery
}: {
  title: string;
  results: SearchResult[];
  icon: React.ReactNode;
  color: string;
  onClick: (res: SearchResult) => void;
  searchQuery: string;
}) {
  if (results.length === 0) return null;

  const query = searchQuery.toLowerCase();

  // Sort results: prioritize those that start with the query
  const sortedResults = [...results].sort((a, b) => {
    const aTitle = a.title.toLowerCase();
    const bTitle = b.title.toLowerCase();
    const aStarts = aTitle.startsWith(query);
    const bStarts = bTitle.startsWith(query);

    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;
    return aTitle.localeCompare(bTitle);
  });

  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    rose: 'bg-rose-50 text-rose-600',
  };

  return (
    <div className="mb-4 last:mb-0">
      <div className="px-4 py-2 flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-gray-400">
        <div className={`p-1.5 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        <span>{title}</span>
        <span className="ml-auto bg-gray-50 px-2 py-0.5 rounded text-[10px] text-gray-500">{results.length}</span>
      </div>
      <div className="space-y-0.5">
        {sortedResults.map((result) => (
          <button
            key={result.id}
            onClick={() => onClick(result)}
            className="w-full flex items-center gap-4 px-6 py-3 hover:bg-gray-50 text-left transition-colors group"
          >
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                {result.title}
              </p>
              {result.subtitle && (
                <p className="text-[13px] text-gray-500 truncate">{result.subtitle}</p>
              )}
            </div>
            {result.metadata && (
              <span className="text-[11px] font-bold px-2 py-1 bg-gray-100 text-gray-600 rounded-md group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                {result.metadata}
              </span>
            )}
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}
