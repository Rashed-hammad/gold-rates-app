import { useState, useEffect } from "react";
import "./GoldPrice.css";

function getNow() {
  return new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function GoldPrice() {
  const [data, setData] = useState(null);
  const [coinCount, setCoinCount] = useState("");
  const [showCalc, setShowCalc] = useState(false);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [error, setError] = useState(null);

  async function fetchGoldPrice() {
    setSpinning(true);
    setError(null);

    const myHeaders = new Headers();
    myHeaders.append("x-access-token", process.env.REACT_APP_GOLD_API_KEY);
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch("https://www.goldapi.io/api/XAU/USD", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const json = JSON.parse(result);
        console.log("API response:", json);
        setData({
          buy: json.ask,
          sell: json.bid,
          lira: json.price_gram_21k * 8,
        });
        setUpdatedAt(getNow());
      })
      .catch(() => setError("Could not load price. Try again."))
      .finally(() => setSpinning(false));
  }

  useEffect(() => {
    fetchGoldPrice();
    // const interval = setInterval(fetchGoldPrice, 120000);
    // return () => clearInterval(interval);
  }, []);

  return (
    <div className="gold-price-container">
      <h2 className="gold-price-title">Gold Price</h2>
      <p className="gold-price-updated">
        {updatedAt ? `Updated: ${updatedAt}` : "Loading..."}
      </p>
      {error && <p className="gold-price-error">{error}</p>}
      <div className="gold-price-cards">
        <div className="gold-card buy">
          <span className="card-label">Buy</span>
          <span className="card-price">
            {data ? `USD ${data.buy.toLocaleString()}` : "—"}
          </span>
          <span className="card-unit">per troy oz</span>
        </div>
        <div className="gold-card sell">
          <span className="card-label">Sell</span>
          <span className="card-price">
            {data ? `USD ${data.sell.toLocaleString()}` : "—"}
          </span>
          <span className="card-unit">per troy oz</span>
        </div>
      </div>
      <div className="lira-section">
        <h3 className="lira-title">Gold Lira Coin</h3>
        <div className="gold-card lira">
          <span className="card-price">
            {data
              ? `USD ${data.lira.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              : "—"}
          </span>
          <span className="card-unit">8 × 21k gram</span>
        </div>
        <button
          className="calc-toggle"
          onClick={() => setShowCalc((v) => !v)}
          title={showCalc ? "Close" : "Calculator"}
        >
          {showCalc ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="4" y="2" width="16" height="20" rx="2" />
              <line x1="8" y1="6" x2="16" y2="6" />
              <line x1="8" y1="10" x2="8" y2="10" strokeWidth="3" />
              <line x1="12" y1="10" x2="12" y2="10" strokeWidth="3" />
              <line x1="16" y1="10" x2="16" y2="10" strokeWidth="3" />
              <line x1="8" y1="14" x2="8" y2="14" strokeWidth="3" />
              <line x1="12" y1="14" x2="12" y2="14" strokeWidth="3" />
              <line x1="16" y1="14" x2="16" y2="14" strokeWidth="3" />
              <line x1="8" y1="18" x2="8" y2="18" strokeWidth="3" />
              <line x1="12" y1="18" x2="12" y2="18" strokeWidth="3" />
              <line x1="16" y1="18" x2="16" y2="18" strokeWidth="3" />
            </svg>
          )}
        </button>
        {showCalc && (
          <div className="lira-calculator">
            <input
              type="number"
              min="0"
              placeholder="Number of gold coins"
              value={coinCount}
              onChange={(e) => setCoinCount(e.target.value)}
              className="coin-input"
            />
            {coinCount > 0 && data?.lira !== null && (
              <p className="coin-total">
                {coinCount} coin{coinCount !== 1 ? "s" : ""} ={" "}
                <strong>
                  USD{" "}
                  {(coinCount * data.lira).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </strong>
              </p>
            )}
          </div>
        )}
      </div>
      <button
        className={`refresh-btn ${spinning ? "spinning" : ""}`}
        onClick={fetchGoldPrice}
        disabled={spinning}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M23 4v6h-6" />
          <path d="M1 20v-6h6" />
          <path d="M3.51 9a9 9 0 0 1 14.36-3.36L23 10M1 14l5.13 4.36A9 9 0 0 0 20.49 15" />
        </svg>
        Refresh
      </button>
    </div>
  );
}

export default GoldPrice;
