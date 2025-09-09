export default function PricingPage() {
  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Our Pricing Plans</h1>
      <p style={{ textAlign: "center", marginBottom: "50px" }}>
        Choose the plan that fits your business needs.
      </p>

      <div style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}>
        {/* Basic Plan */}
        <div style={{ flex: "1", minWidth: "250px", border: "1px solid #ddd", borderRadius: "12px", padding: "30px", textAlign: "center" }}>
          <h2>Basic</h2>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>$19/month</p>
          <ul style={{ listStyle: "none", padding: 0, margin: "20px 0" }}>
            <li>✔ SEO Audit Report</li>
            <li>✔ Keyword Suggestions</li>
            <li>✔ Basic Support</li>
          </ul>
          <button style={{ padding: "10px 20px", borderRadius: "8px", border: "none", background: "#0070f3", color: "white", cursor: "pointer" }}>
            Choose Basic
          </button>
        </div>

        {/* Pro Plan */}
        <div style={{ flex: "1", minWidth: "250px", border: "2px solid #0070f3", borderRadius: "12px", padding: "30px", textAlign: "center", background: "#f0f8ff" }}>
          <h2>Pro</h2>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>$49/month</p>
          <ul style={{ listStyle: "none", padding: 0, margin: "20px 0" }}>
            <li>✔ Everything in Basic</li>
            <li>✔ Competitor Analysis</li>
            <li>✔ Priority Support</li>
          </ul>
          <button style={{ padding: "10px 20px", borderRadius: "8px", border: "none", background: "#0070f3", color: "white", cursor: "pointer" }}>
            Choose Pro
          </button>
        </div>

        {/* Enterprise Plan */}
        <div style={{ flex: "1", minWidth: "250px", border: "1px solid #ddd", borderRadius: "12px", padding: "30px", textAlign: "center" }}>
          <h2>Enterprise</h2>
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>Custom Pricing</p>
          <ul style={{ listStyle: "none", padding: 0, margin: "20px 0" }}>
            <li>✔ Everything in Pro</li>
            <li>✔ Dedicated Manager</li>
            <li>✔ Custom Reports</li>
          </ul>
          <button style={{ padding: "10px 20px", borderRadius: "8px", border: "none", background: "#0070f3", color: "white", cursor: "pointer" }}>
            Contact Sales
          </button>
        </div>
      </div>
    </div>
  );
}
