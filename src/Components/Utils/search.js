 {/* Search Input */}
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="search"
            placeholder="Search DSA Algorithms"
            className="w-full pl-10 pr-3 py-2 font-mono text-white bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Filtered Results Dropdown */}
          {searchQuery && (
            <ul className="absolute z-10 left-0 right-0 bg-gray-900 border border-gray-700 mt-1 rounded-md max-h-60 overflow-y-auto text-white">
              {filteredAlgorithms.length > 0 ? (
                filteredAlgorithms.map((algo, i) => (
                  <li
                    key={i}
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer z-10"
                    onClick={() => {
                       console.log(algo) ;
                        navigate(`${algo}`) ;
                      // Optional: Navigate or trigger visualization
                      // alert(`Navigate to ${algo}`);
                      setSearchQuery(""); // Clear after selection
                     
                    }}
                  >
                    {algo}
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-gray-400">No results found</li>
              )}
            </ul>
          )}
        </div>