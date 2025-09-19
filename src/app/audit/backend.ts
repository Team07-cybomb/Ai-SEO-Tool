export const runAudit = async (url: string, userId: string, token?: string) => {
  const response = await fetch("https://n8n.cybomb.com/webhook/audit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, userId }),
  });
  if (!response.ok) throw new Error("Audit failed");
  const data = await response.json();


  return data;
};
