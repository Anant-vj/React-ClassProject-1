import React, { useState, useEffect, useMemo, useCallback } from 'react';

// Extract the fetch + transform logic into a separate async function
export const fetchRoutes = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos');

  if (!response.ok) {
    throw new Error('Failed to fetch route data');
  }

  const todos = await response.json();

  return todos.map((todo) => {
    // Group todos by (todo.id % 5) + 1 to create 5 route numbers (Route 1-5)
    const routeNumber = (todo.id % 5) + 1;

    // Derive a fake arrival time using (todo.id * 7) % 60 minutes from now
    const arrivesInMinutes = (todo.id * 7) % 60;

    // Truncate destination (using todo.title) to 30 chars
    const destination = todo.title.length > 30
      ? todo.title.substring(0, 30) + '...'
      : todo.title;

    return {
      id: todo.id,
      routeNumber,
      destination,
      arrivesInMinutes
    };
  });
};

export default function TransportSchedule() {
  // Required State Shape
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(1);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Dark mode state - persists in localStorage
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('transport-schedule-dark-mode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('transport-schedule-dark-mode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const loadScheduleData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRoutes();
      setRoutes(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch data on mount
    loadScheduleData();

    // Auto-refresh logic: re-fetch every 30 seconds to keep the real-time schedule fresh
    const intervalId = setInterval(() => {
      loadScheduleData();
    }, 30000);

    // Clear the interval on component unmount to avoid memory leaks
    return () => clearInterval(intervalId);
  }, [loadScheduleData]);

  // Compute the filtered and sorted list based on the selected route
  const filteredAndSortedRoutes = useMemo(() => {
    // Filter by selected route
    const filtered = routes.filter(r => r.routeNumber === selectedRoute);

    // Sort ascending by arrivesInMinutes to find the schedule order easily
    return filtered.sort((a, b) => a.arrivesInMinutes - b.arrivesInMinutes);
  }, [routes, selectedRoute]);

  // Next-bus derivation logic: 
  // Because 'filteredAndSortedRoutes' is already sorted by shortest arrive time,
  // the very first item (index 0) is naturally the shortest arrivesInMinutes for this route.
  const nextArrivalId = filteredAndSortedRoutes.length > 0
    ? filteredAndSortedRoutes[0].id
    : null;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-slate-900' : 'bg-slate-50'} p-4 sm:p-8`}>
      <div className={`max-w-2xl mx-auto p-4 sm:p-6 rounded-2xl shadow-2xl font-sans transition-all duration-300 ${
        darkMode ? 'bg-slate-800 border border-slate-700 text-slate-100' : 'bg-white text-slate-800'
      }`}>
        <header className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-700 pb-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-black tracking-tight">Venture Timings</h1>
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                darkMode ? 'bg-indigo-900/50 text-indigo-300 border border-indigo-500/30' : 'bg-indigo-100 text-indigo-600'
              }`}>LIVE</span>
            </div>
            {lastUpdated && (
              <p className={`text-sm mt-1 flex items-center gap-1.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Updated: <span className="font-semibold">{lastUpdated.toLocaleTimeString()}</span>
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2.5 rounded-xl transition-all border ${
                darkMode 
                  ? 'bg-slate-700 border-slate-600 text-yellow-400 hover:bg-slate-600' 
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
              }`}
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
              )}
            </button>
            <button
              onClick={loadScheduleData}
              disabled={loading}
              className={`flex items-center gap-2 px-5 py-2.5 font-bold rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50 ${
                darkMode 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-900/20' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <span>Syncing...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  <span>Refresh</span>
                </>
              )}
            </button>
          </div>
        </header>

        <section className="mb-8">
          <label htmlFor="routeSelect" className={`block text-xs font-black uppercase tracking-widest mb-3 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            Transport Line
          </label>
          <div className="relative group">
            <select
              id="routeSelect"
              value={selectedRoute}
              onChange={(e) => setSelectedRoute(Number(e.target.value))}
              className={`w-full sm:w-64 p-4 pl-5 rounded-xl border-2 appearance-none cursor-pointer font-bold outline-none transition-all ${
                darkMode 
                  ? 'bg-slate-900/50 border-slate-700 text-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10' 
                  : 'bg-slate-50 border-slate-100 text-slate-800 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100'
              }`}
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num} className={darkMode ? 'bg-slate-900' : 'bg-white'}>Route Line {num}</option>
              ))}
            </select>
            <div className={`pointer-events-none absolute inset-y-0 left-auto right-4 sm:right-[calc(100%-16rem+1rem)] flex items-center px-1 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              <svg className="h-5 w-5 transition-transform group-hover:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </section>

        <section aria-live="polite">
          {loading && routes.length === 0 ? (
            <div className="flex flex-col justify-center items-center py-20 gap-4 opacity-70">
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
              </div>
              <p className={`font-bold tracking-tight ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Connecting to Station...</p>
            </div>
          ) : error ? (
            <div className={`border-2 rounded-2xl p-6 mb-6 flex items-start gap-4 ${
              darkMode ? 'bg-red-900/20 border-red-900/30 text-red-300' : 'bg-red-50 border-red-100 text-red-600'
            }`}>
              <svg className="w-6 h-6 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <div>
                <h3 className="font-black uppercase text-xs tracking-widest mb-1">Signal Interrupted</h3>
                <p className="font-medium">{error}</p>
              </div>
            </div>
          ) : (
            <ul className="space-y-4">
              {filteredAndSortedRoutes.length === 0 ? (
                <li className={`text-center py-16 rounded-2xl border-2 border-dashed ${
                  darkMode ? 'bg-slate-900/30 border-slate-700/50 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  <p className="font-black tracking-tight text-lg">No arrivals scheduled</p>
                  <p className="text-sm font-medium">Please check another route line.</p>
                </li>
              ) : (
                filteredAndSortedRoutes.map((route) => {
                  const isNext = route.id === nextArrivalId;
                  return (
                    <li
                      key={route.id}
                      className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 rounded-2xl border-2 transition-all duration-300 ${
                        isNext 
                          ? darkMode 
                            ? 'bg-indigo-900/20 border-indigo-500/40 shadow-[0_0_20px_rgba(99,102,241,0.1)] ring-1 ring-indigo-500/20' 
                            : 'bg-indigo-50 border-indigo-200 shadow-md scale-[1.01]' 
                          : darkMode 
                            ? 'bg-slate-900/40 border-slate-700/50 hover:border-slate-600 hover:bg-slate-900/60' 
                            : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex flex-col mb-4 sm:mb-0">
                        <span className={`font-black text-xl mb-1 line-clamp-1 leading-tight ${
                          isNext ? (darkMode ? 'text-white' : 'text-indigo-900') : (darkMode ? 'text-slate-200' : 'text-slate-800')
                        }`} title={route.destination}>
                          {route.destination}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                            isNext ? (darkMode ? 'bg-indigo-500/30 text-indigo-300' : 'bg-indigo-200 text-indigo-700') : (darkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500')
                          }`}>
                            Line {route.routeNumber}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center w-full sm:w-auto justify-between sm:justify-end gap-5">
                        {isNext && (
                          <div className={`flex flex-col items-center animate-pulse`}>
                            <span className={`text-[10px] font-black tracking-widest px-2.5 py-1 rounded-full leading-none mb-1 ${
                              darkMode ? 'bg-indigo-500 text-white' : 'bg-indigo-600 text-white shadow-sm'
                            }`}>
                              NEXT
                            </span>
                          </div>
                        )}
                        
                        <div className="text-right flex flex-col justify-center">
                          <div className={`flex items-baseline gap-1 ${
                            isNext ? (darkMode ? 'text-indigo-400' : 'text-indigo-600') : (darkMode ? 'text-slate-300' : 'text-slate-700')
                          }`}>
                            <span className={`font-mono text-3xl font-black tabular-nums tracking-tighter`}>
                              {route.arrivesInMinutes}
                            </span>
                            <span className="text-xs font-black uppercase tracking-widest opacity-70">
                              min
                            </span>
                          </div>
                          {route.arrivesInMinutes === 0 && isNext && (
                            <span className="text-[10px] text-red-500 font-black uppercase tracking-tighter bg-red-500/10 px-1 rounded">ARRIVING NOW</span>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
