// utils/guest.ts
export function getGuestId() {
  let guestId =
    localStorage.getItem("guestId") ||
    document.cookie.match(/guestId=([^;]+)/)?.[1];

  if (!guestId) {
    guestId = "guest_" + Math.random().toString(36).substring(2) + Date.now();
    localStorage.setItem("guestId", guestId);
    document.cookie = `guestId=${guestId}; max-age=31536000; path=/; samesite=lax`;
  }

  return guestId;
}
