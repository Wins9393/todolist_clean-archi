export function generateUniqueId() {
  return `${Math.floor(Math.random() * 10000)}-${Date.now()}`;
}
