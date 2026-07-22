import { useMemo, useState } from "react";
import type { FormEvent } from "react";

type TokenSnapshot = {
  mode: "paper";
  token: {
    contractAddress: string;
    name: string;
    symbol: string;
    decimals: number;
  };
  market: {
    priceUsd: number;
    priceChange24h: number;
    liquidityUsd: number;
    volume24hUsd: number;
    marketCapUsd: number;
  };
  risk: {
    score: number;
    level: "low" | "medium" | "high";
    flags: string[];
  };
  chart: Array<{
    time: string;
    value: number;
  }>;
  updatedAt: string;
};

const demoContract = "0x1111111111111111111111111111111111111111";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

function currency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value < 1 ? 8 : 2,
  }).format(value);
}

function TokenChart({ chart }: { chart: TokenSnapshot["chart"] }) {
  const points = useMemo(() => {
    const values = chart.map((point) => point.value);
    const minimum = Math.min(...values);
    const maximum = Math.max(...values);
    const range = maximum - minimum || 1;

    return chart
      .map((point, index) => {
        const x = (index / Math.max(chart.length - 1, 1)) * 100;
        const y = 92 - ((point.value - minimum) / range) * 84;
        return `${x},${y}`;
      })
      .join(" ");
  }, [chart]);

  return (
    <div className="chart-wrap" aria-label="Simulated price chart">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img">
        <polyline points={points} fill="none" stroke="currentColor" strokeWidth="2.5" />
      </svg>
      <div className="chart-labels">
        <span>24h ago</span>
        <span>Now</span>
      </div>
    </div>
  );
}

function App() {
  const [contract, setContract] = useState(demoContract);
  const [snapshot, setSnapshot] = useState<TokenSnapshot | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function inspectToken(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSnapshot(null);

    const address = contract.trim();
    if (!address) {
      setError("Paste a token contract address first.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${apiBaseUrl}/api/token/${encodeURIComponent(address)}`,
      );
      const payload: unknown = await response.json();

      if (!response.ok) {
        const message =
          typeof payload === "object" &&
          payload !== null &&
          "error" in payload &&
          typeof payload.error === "string"
            ? payload.error
            : "Unable to inspect this token.";
        throw new Error(message);
      }

      setSnapshot(payload as TokenSnapshot);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to contact the backend. Confirm it is running on port 3000.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  const changeClass =
    snapshot && snapshot.market.priceChange24h >= 0 ? "positive" : "negative";

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Robinhood Chain</p>
          <h1>Token Analyzer</h1>
        </div>
        <span className="mode-badge">Paper mode</span>
      </header>

      <section className="intro">
        <h2>Analyze a token by contract address</h2>
        <p>
          This first version uses simulated data. It never connects a wallet or sends a transaction.
        </p>
      </section>

      <form className="search-panel" onSubmit={inspectToken}>
        <label htmlFor="contract">Token contract address</label>
        <div className="search-row">
          <input
            id="contract"
            value={contract}
            onChange={(event) => setContract(event.target.value)}
            placeholder="0x..."
            spellCheck="false"
            autoComplete="off"
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Analyzing…" : "Analyze token"}
          </button>
        </div>
        <button
          className="link-button"
          type="button"
          onClick={() => setContract(demoContract)}
        >
          Use demo contract
        </button>
      </form>

      {error ? <p className="error-message">{error}</p> : null}

      {snapshot ? (
        <section className="results" aria-live="polite">
          <div className="token-heading">
            <div>
              <p className="eyebrow">Simulated token</p>
              <h2>{snapshot.token.name}</h2>
              <p className="token-symbol">
                {snapshot.token.symbol} · {snapshot.token.contractAddress}
              </p>
            </div>
            <span className={`risk-badge ${snapshot.risk.level}`}>
              Risk: {snapshot.risk.level}
            </span>
          </div>

          <div className="metric-grid">
            <article>
              <span>Price</span>
              <strong>{currency(snapshot.market.priceUsd)}</strong>
              <small className={changeClass}>
                {snapshot.market.priceChange24h >= 0 ? "+" : ""}
                {snapshot.market.priceChange24h}% (24h)
              </small>
            </article>
            <article>
              <span>Liquidity</span>
              <strong>{currency(snapshot.market.liquidityUsd)}</strong>
              <small>Simulated</small>
            </article>
            <article>
              <span>24h volume</span>
              <strong>{currency(snapshot.market.volume24hUsd)}</strong>
              <small>Simulated</small>
            </article>
            <article>
              <span>Market cap</span>
              <strong>{currency(snapshot.market.marketCapUsd)}</strong>
              <small>Simulated</small>
            </article>
          </div>

          <section className="chart-card">
            <div>
              <h3>24-hour simulated movement</h3>
              <p>Stable demo data for designing the strategy and user interface.</p>
            </div>
            <TokenChart chart={snapshot.chart} />
          </section>

          <section className="risk-card">
            <div>
              <h3>Risk assessment</h3>
              <p>Score: {snapshot.risk.score}/100</p>
            </div>
            <ul>
              {snapshot.risk.flags.map((flag) => (
                <li key={flag}>{flag}</li>
              ))}
            </ul>
          </section>

          <button className="buy-button" type="button" disabled>
            Buy simulation — next module
          </button>
          <p className="updated-at">
            Last updated: {new Date(snapshot.updatedAt).toLocaleString()}
          </p>
        </section>
      ) : null}
    </main>
  );
}

export default App;
