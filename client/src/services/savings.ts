import api from "./api";

export async function getSavings() {
  const result = await api.get("/api/savings");
  return result.data;
}

export async function addSavings(data: SavingAccountPayload) {
  const result = await api.post("/api/savings", data);
  return result.data;
}
