import { useState } from "react";
import { Search, FileText } from "lucide-react";
import { apiPost } from "../lib/api";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setHasSearched(true);

    try {
      const data = await apiPost("/documents/search", { query, limit: 10 });
      setResults(data.results);
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-2xl mx-auto">
        <h1
          className="text-xl font-semibold mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          Semantic Search
        </h1>
        <p className="text-sm mb-6" style={{ color: "var(--text-tertiary)" }}>
          Cari konten dari dokumen berdasarkan makna, bukan keyword.
        </p>

        {/* Search input */}
        <form onSubmit={handleSearch} className="mb-6">
          <div
            className="flex items-center gap-2 rounded-xl border px-4 py-3 transition-all focus-within:ring-2 focus-within:ring-[var(--accent)]"
            style={{
              backgroundColor: "var(--bg-tertiary)",
              borderColor: "var(--border)",
            }}
          >
            <Search size={16} style={{ color: "var(--text-tertiary)" }} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari dokumen..."
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: "var(--text-primary)" }}
            />
            <button
              type="submit"
              disabled={!query.trim() || isLoading}
              className="px-3 py-1 rounded-lg text-xs font-medium text-white transition-all disabled:opacity-30"
              style={{ backgroundColor: "var(--accent)" }}
            >
              Cari
            </button>
          </div>
        </form>

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-12">
            <div
              className="w-8 h-8 border-2 rounded-full animate-spin mx-auto"
              style={{
                borderColor: "var(--border)",
                borderTopColor: "var(--accent)",
              }}
            />
            <p
              className="text-sm mt-3"
              style={{ color: "var(--text-tertiary)" }}
            >
              Mencari...
            </p>
          </div>
        )}

        {/* Results */}
        {!isLoading && results.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              {results.length} hasil ditemukan
            </p>
            {results.map((result, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border transition-all hover:scale-[1.005]"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  borderColor: "var(--border)",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileText
                      size={14}
                      style={{ color: "var(--text-tertiary)" }}
                    />
                    <span
                      className="text-xs font-medium"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {result.document.filename}
                    </span>
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: "var(--accent)", color: "white" }}
                  >
                    {result.similarity.toFixed(2)}
                  </span>
                </div>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-primary)" }}
                >
                  {result.content}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && hasSearched && results.length === 0 && (
          <div className="text-center py-12">
            <Search
              size={32}
              className="mx-auto mb-3"
              style={{ color: "var(--text-tertiary)" }}
            />
            <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
              Tidak ada hasil yang ditemukan.
            </p>
          </div>
        )}

        {/* Initial state */}
        {!hasSearched && !isLoading && (
          <div className="text-center py-12">
            <Search
              size={32}
              className="mx-auto mb-3"
              style={{ color: "var(--text-tertiary)" }}
            />
            <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
              Ketik query untuk mulai mencari.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
