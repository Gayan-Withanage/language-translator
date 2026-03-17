import { useState } from "react";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "zh-cn", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "ar", name: "Arabic" },
  { code: "ru", name: "Russian" },
  { code: "hi", name: "Hindi" },
  { code: "si", name: "Sinhala" },
  { code: "tr", name: "Turkish" },
];

const API_URL = "http://localhost:8000";

export default function Translator() {
  const [inputText, setInputText] = useState("");
  const [targetLang, setTargetLang] = useState("en");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleTranslate() {
    if (!inputText.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`${API_URL}/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText, target: targetLang }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Translation failed");
      }

      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError(e.message || "Could not connect to backend.");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!result) return;
    navigator.clipboard.writeText(result.translation);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleTranslate();
  }

  const targetName = LANGUAGES.find((l) => l.code === targetLang)?.name || targetLang;

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.dot} />
          <h1 style={styles.title}>Linguist</h1>
          <span style={styles.subtitle}>Language Translator</span>
        </div>

        {/* Input Card */}
        <div style={styles.card}>
          <div style={styles.cardTop}>
            <span style={styles.tag}>INPUT</span>
            {result && (
              <span style={styles.detectedBadge}>
                Detected: {result.detected_name}
              </span>
            )}
          </div>

          <textarea
            style={styles.textarea}
            placeholder="Type or paste a sentence..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={4}
          />

          <div style={styles.cardBottom}>
            <span style={styles.hint}>Ctrl+Enter to translate</span>
            <span style={styles.charCount}>{inputText.length}</span>
          </div>
        </div>

        {/* Language Selector */}
        <div style={styles.langSection}>
          <span style={styles.langLabel}>Translate to →</span>
          <div style={styles.langGrid}>
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                style={{
                  ...styles.langChip,
                  ...(targetLang === lang.code ? styles.langChipActive : {}),
                }}
                onClick={() => setTargetLang(lang.code)}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>

        {/* Translate Button */}
        <button
          style={{
            ...styles.translateBtn,
            ...(loading ? styles.translateBtnDisabled : {}),
          }}
          onClick={handleTranslate}
          disabled={loading || !inputText.trim()}
        >
          {loading ? (
            <span style={styles.loadingDots}>
              <span>●</span><span>●</span><span>●</span>
            </span>
          ) : (
            `Translate to ${targetName}`
          )}
        </button>

        {/* Error */}
        {error && <div style={styles.error}>{error}</div>}

        {/* Result Card */}
        {result && (
          <div style={styles.resultCard}>
            <div style={styles.resultHeader}>
              <div style={styles.resultMeta}>
                <span style={styles.tag}>OUTPUT</span>
                <span style={styles.resultLang}>{result.target_name}</span>
              </div>
              <button style={styles.copyBtn} onClick={handleCopy}>
                {copied ? "Copied ✓" : "Copy"}
              </button>
            </div>
            <p style={styles.resultText}>{result.translation}</p>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0f; }
        textarea:focus { outline: none; border-color: #3d3d5c !important; }
        textarea::placeholder { color: #3a3a55; }
        @keyframes blink {
          0%, 80%, 100% { opacity: 0.2; }
          40% { opacity: 1; }
        }
        .loading-dot:nth-child(1) { animation: blink 1.2s 0s infinite; }
        .loading-dot:nth-child(2) { animation: blink 1.2s 0.2s infinite; }
        .loading-dot:nth-child(3) { animation: blink 1.2s 0.4s infinite; }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0a0a0f",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "48px 16px",
    fontFamily: "'Outfit', sans-serif",
  },
  container: {
    width: "100%",
    maxWidth: "580px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "8px",
  },
  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#6c63ff",
  },
  title: {
    fontSize: "22px",
    fontWeight: "600",
    color: "#e8e8f0",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    fontSize: "13px",
    color: "#3a3a55",
    fontFamily: "'JetBrains Mono', monospace",
  },
  card: {
    background: "#111118",
    border: "1px solid #1e1e2e",
    borderRadius: "12px",
    padding: "16px",
  },
  cardTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "12px",
  },
  cardBottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "10px",
  },
  tag: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "10px",
    fontWeight: "500",
    color: "#3a3a55",
    letterSpacing: "1.5px",
  },
  detectedBadge: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "11px",
    color: "#6c63ff",
    background: "#1a1a2e",
    padding: "3px 8px",
    borderRadius: "6px",
    border: "1px solid #2a2a45",
  },
  textarea: {
    width: "100%",
    background: "transparent",
    border: "1px solid #1e1e2e",
    borderRadius: "8px",
    padding: "12px",
    color: "#c8c8d8",
    fontSize: "15px",
    fontFamily: "'Outfit', sans-serif",
    lineHeight: "1.6",
    resize: "vertical",
    transition: "border-color 0.2s",
  },
  hint: {
    fontSize: "11px",
    color: "#2a2a3a",
    fontFamily: "'JetBrains Mono', monospace",
  },
  charCount: {
    fontSize: "11px",
    color: "#2a2a3a",
    fontFamily: "'JetBrains Mono', monospace",
  },
  langSection: {
    background: "#111118",
    border: "1px solid #1e1e2e",
    borderRadius: "12px",
    padding: "16px",
  },
  langLabel: {
    fontSize: "11px",
    color: "#3a3a55",
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: "1px",
    display: "block",
    marginBottom: "12px",
  },
  langGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
  },
  langChip: {
    fontFamily: "'Outfit', sans-serif",
    fontSize: "13px",
    fontWeight: "400",
    padding: "5px 12px",
    borderRadius: "999px",
    border: "1px solid #1e1e2e",
    background: "transparent",
    color: "#4a4a6a",
    cursor: "pointer",
    transition: "all 0.15s",
  },
  langChipActive: {
    background: "#6c63ff",
    border: "1px solid #6c63ff",
    color: "#ffffff",
    fontWeight: "500",
  },
  translateBtn: {
    width: "100%",
    padding: "14px",
    background: "#6c63ff",
    border: "none",
    borderRadius: "10px",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "500",
    fontFamily: "'Outfit', sans-serif",
    cursor: "pointer",
    letterSpacing: "0.2px",
    transition: "opacity 0.2s",
  },
  translateBtnDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  loadingDots: {
    display: "flex",
    justifyContent: "center",
    gap: "6px",
    fontSize: "10px",
  },
  error: {
    background: "#1a0f0f",
    border: "1px solid #3d1a1a",
    borderRadius: "8px",
    padding: "12px 16px",
    color: "#e05555",
    fontSize: "13px",
    fontFamily: "'JetBrains Mono', monospace",
  },
  resultCard: {
    background: "#111118",
    border: "1px solid #2a2a45",
    borderRadius: "12px",
    padding: "16px",
  },
  resultHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "12px",
  },
  resultMeta: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  resultLang: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#6c63ff",
  },
  copyBtn: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "11px",
    padding: "4px 10px",
    background: "transparent",
    border: "1px solid #2a2a45",
    borderRadius: "6px",
    color: "#4a4a6a",
    cursor: "pointer",
  },
  resultText: {
    fontSize: "16px",
    color: "#c8c8d8",
    lineHeight: "1.7",
  },
};
