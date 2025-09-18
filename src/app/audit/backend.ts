export const API_BASE = "http://localhost:5000/api";

export const runAudit = async (url: string, userId: string, token?: string) => {
  const response = await fetch("https://n8n.cybomb.com/webhook/audit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, userId }),
  });
  if (!response.ok) throw new Error("Audit failed");
  const data = await response.json();

  // Save to DB
  if (token) {
    await fetch(`${API_BASE}/create-audits`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...data, date: new Date().toLocaleDateString() }),
    });
  }

  return data;
};
