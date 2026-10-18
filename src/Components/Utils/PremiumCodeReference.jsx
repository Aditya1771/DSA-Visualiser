import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Check, Copy, Info, Loader2 } from "lucide-react";

/**
 * PremiumCodeReference
 * @param {Object} codeData - Object containing strings for each language (javascript, python, etc.)
 * @param {Object} complexity - { time: "O(n²)", space: "O(1)", stable: "Yes" }
 * @param {boolean} isDark - Theme toggle
 */
const PremiumCodeReference = ({ codeData, complexity, isDark }) => {
  const [lang, setLang] = useState("javascript");
  const [copied, setCopied] = useState(false);

  // Fallback to first available language if javascript isn't provided
  useEffect(() => {
    if (codeData && !codeData[lang]) {
      setLang(Object.keys(codeData)[0]);
    }
  }, [codeData]);

  const handleCopy = () => {
    if (!codeData[lang]) return;
    navigator.clipboard.writeText(codeData[lang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const editorOptions = {
    readOnly: true,
    minimap: { enabled: true },
    fontSize: 14,
    lineNumbers: "on",
    fontFamily: "'Fira Code', 'Cascadia Code', monospace",
    fontLigatures: true,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    padding: { top: 20, bottom: 20 },
    cursorStyle: "block",
    renderLineHighlight: "all",
    smoothScrolling: true,
    contextmenu: true,
    domReadOnly: true,
  };

  if (!codeData) return null;

  return (
    <section className="w-full max-w-5xl mx-auto mb-12 animate-fadeIn">
      <div
        className={`rounded-2xl overflow-hidden border transition-all duration-500 shadow-2xl 
                ${isDark ? "bg-[#1E1E1E] border-white/10" : "bg-white border-slate-200"}`}
      >
        {/* Header Toolbar */}
        <div
          className={`flex flex-col md:flex-row items-center justify-between px-6 py-4 gap-4 
                    ${isDark ? "bg-[#252526]" : "bg-slate-50 border-b"}`}
        >
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex gap-1.5 mr-4">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <span
              className={`text-xs font-bold font-mono tracking-widest ${
                isDark ? "text-gray-400" : "text-slate-400"
              }`}
            >
              {lang.toUpperCase()} SOURCE
            </span>
          </div>

          {/* Language Tabs */}
          <div className="flex bg-black/10 p-1 rounded-xl overflow-x-auto max-w-full">
            {Object.keys(codeData).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all whitespace-nowrap
                                    ${
                                      lang === l
                                        ? isDark
                                          ? "bg-[#1E1E1E] text-purple-400 shadow-lg"
                                          : "bg-white text-purple-600 shadow-sm"
                                        : "text-gray-500 hover:text-gray-300"
                                    }`}
              >
                {l === "javascript" ? "JS" : l === "cpp" ? "C++" : l}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all
                            ${
                              isDark
                                ? "bg-white/5 hover:bg-white/10 text-white"
                                : "bg-slate-800 hover:bg-slate-900 text-white"
                            }`}
          >
            {copied ? (
              <Check className="w-3 h-3 text-green-400" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
            {copied ? "Copied!" : "Copy Code"}
          </button>
        </div>

        {/* Complexity Metadata Strip */}
        {complexity && (
          <div
            className={`flex items-center gap-8 px-6 py-2 text-[10px] font-mono border-b
                        ${isDark ? "bg-[#1E1E1E] border-white/5" : "bg-white border-slate-100"}`}
          >
            <span className="flex gap-2">
              <span className="text-gray-500">TIME:</span>
              <span className="text-amber-500">{complexity.time}</span>
            </span>
            <span className="flex gap-2">
              <span className="text-gray-500">SPACE:</span>
              <span className="text-emerald-500">{complexity.space}</span>
            </span>
            <span className="flex gap-2">
              <span className="text-gray-500">STABLE:</span>
              <span className="text-blue-500">{complexity.stable}</span>
            </span>
          </div>
        )}

        {/* Monaco Editor Implementation */}
        <div className="h-[600px] relative">
          <Editor
            height="100%"
            language={lang === "c" || lang === "cpp" ? "cpp" : lang}
            theme={isDark ? "vs-dark" : "light"}
            value={codeData[lang] || ""}
            options={editorOptions}
            loading={
              <div
                className={`flex items-center justify-center h-full ${
                  isDark ? "bg-[#1E1E1E]" : "bg-white"
                }`}
              >
                <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
              </div>
            }
          />
        </div>
      </div>

      <div
        className={`mt-4 p-4 rounded-xl border flex items-start gap-3 transition-colors
                ${
                  isDark
                    ? "bg-blue-900/10 border-blue-500/20 text-blue-300"
                    : "bg-blue-50 border-blue-100 text-blue-700"
                }`}
      >
        <Info className="w-5 h-5 shrink-0 mt-0.5" />
        <p className="text-xs leading-relaxed">
          <strong>Note for Beginners:</strong> This implementation includes the full
          boilerplate (main functions and printing) so you can copy and run it directly in your local environment to see how the algorithm behaves with real data.
        </p>
      </div>
    </section>
  );
};

export default PremiumCodeReference;