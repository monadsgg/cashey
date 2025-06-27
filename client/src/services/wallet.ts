import api from "./api";

export async function getWallets() {
  const result = await api.get("/api/wallets");
  return result.data;
}
