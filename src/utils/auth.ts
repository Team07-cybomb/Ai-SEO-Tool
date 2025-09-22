// utils/auth.ts
export async function fetchUser() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error("Error fetching user:", err);
    return null;
  }
}
