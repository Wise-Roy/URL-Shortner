import { useState } from "react";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

function App() {
  const [url, setUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [showAlias, setShowAlias] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);

  const normalizeUrl = (input) => {
    let trimmed = input.trim();
    if (!trimmed) return "";
    if (!/^https?:\/\//i.test(trimmed)) {
      trimmed = "https://" + trimmed;
    }
    return trimmed;
  };

  const isValidUrl = (string) => {
    try {
      const parsed = new URL(string);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setCopied(false);

    const normalized = normalizeUrl(url);
    if (!normalized) {
      setError("Please enter a URL");
      return;
    }
    if (!isValidUrl(normalized)) {
      setError("Please enter a valid URL");
      return;
    }

    setLoading(true);
    try {
      const body = { originalURL: normalized };
      if (customAlias.trim()) {
        body.customAlias = customAlias.trim();
      }

      const res = await fetch(`${API_BASE}/api/v1/url/url-shortner`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      const newResult = {
        shortUrl: data.data.shortUrl,
        originalUrl: data.data.originalUrl,
        shortCode: data.data.shortCode,
      };
      setResult(newResult);
      setHistory((prev) => [newResult, ...prev]);
      setUrl("");
      setCustomAlias("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(index !== undefined ? index : true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Failed to copy to clipboard");
    }
  };

  return (
    <div className="min-h-screen bg-page flex flex-col items-center px-4 py-16">
      {/* Header */}
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card mb-6">
          <span className="w-2 h-2 rounded-full bg-neon shadow-neon-sm" />
          <span className="text-xs font-mono text-neutral-400 tracking-wide uppercase">
            URL Shortener
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
          Shorten a link
        </h1>
        <p className="mt-3 text-neutral-500 text-base max-w-md mx-auto">
          Paste a long URL and get a short, shareable link instantly.
        </p>
      </div>

      {/* Form Card */}
      <div className="w-full max-w-xl">
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 space-y-4">
          {/* URL Input */}
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-2 uppercase tracking-wider">
              Destination URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError("");
              }}
              placeholder="https://example.com/very/long/url"
              className="w-full bg-page border border-border rounded-btn px-4 py-3 text-sm font-mono text-white placeholder-neutral-600 outline-none focus:border-neon focus:shadow-neon-sm transition-all"
            />
          </div>

          {/* Custom Alias Toggle */}
          {!showAlias ? (
            <button
              type="button"
              onClick={() => setShowAlias(true)}
              className="text-xs text-neutral-500 hover:text-neon transition-colors"
            >
              + Custom alias (optional)
            </button>
          ) : (
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-2 uppercase tracking-wider">
                Custom Alias
              </label>
              <input
                type="text"
                value={customAlias}
                onChange={(e) => setCustomAlias(e.target.value)}
                placeholder="my-custom-slug"
                className="w-full bg-page border border-border rounded-btn px-4 py-3 text-sm font-mono text-white placeholder-neutral-600 outline-none focus:border-neon focus:shadow-neon-sm transition-all"
              />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="text-red-400 text-sm bg-red-400/5 border border-red-400/20 rounded-btn px-4 py-2.5">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neon text-page font-semibold text-sm py-3 rounded-btn shadow-neon hover:brightness-110 active:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Shortening...
              </span>
            ) : (
              "Shorten"
            )}
          </button>
        </form>

        {/* Result */}
        {result && (
          <div className="mt-4 bg-card border border-neon/20 rounded-xl p-5 space-y-3 animate-fadeIn">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-neon shadow-neon-sm" />
              <span className="text-xs text-neutral-400 uppercase tracking-wider">
                Your short link
              </span>
            </div>

            <div className="flex items-center gap-3 bg-page border border-border rounded-btn px-4 py-3">
              <a
                href={result.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 font-mono text-neon text-sm hover:underline truncate"
              >
                {result.shortUrl}
              </a>
              <button
                onClick={() => copyToClipboard(result.shortUrl)}
                className="flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-btn border border-border text-neutral-300 hover:text-neon hover:border-neon/30 transition-all"
              >
                {copied === true ? "Copied" : "Copy"}
              </button>
            </div>

            <div className="text-xs text-neutral-500 font-mono truncate px-1">
              <span className="text-neutral-600">Destination:</span>{" "}
              {result.originalUrl}
            </div>
          </div>
        )}

        {/* History */}
        {history.length > 1 && (
          <div className="mt-8">
            <h2 className="text-xs text-neutral-500 uppercase tracking-wider mb-3 px-1">
              Recent links
            </h2>
            <div className="space-y-2">
              {history.slice(1).map((item, i) => (
                <div
                  key={item.shortCode + i}
                  className="bg-card border border-border rounded-btn px-4 py-3 flex items-center gap-3"
                >
                  <a
                    href={item.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 font-mono text-sm text-neon/70 hover:text-neon truncate transition-colors"
                  >
                    {item.shortUrl}
                  </a>
                  <button
                    onClick={() => copyToClipboard(item.shortUrl, i)}
                    className="flex-shrink-0 px-3 py-1.5 text-xs rounded-btn border border-border text-neutral-500 hover:text-neon hover:border-neon/30 transition-all"
                  >
                    {copied === i ? "Copied" : "Copy"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-auto pt-16 text-center">
        <p className="text-xs text-neutral-600 font-mono">
          snip / url shortener
        </p>
      </div>
    </div>
  );
}

export default App;
