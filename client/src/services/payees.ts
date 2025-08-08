import api from "./api";

export interface Payee {
  id: number;
  name: string;
}

export interface PayeePayload {
  name: string;
}

export async function getPayees(): Promise<Payee[]> {
  const result = await api.get<Payee[]>("/api/payees");
  return result.data;
}

export async function addPayee(payload: PayeePayload): Promise<Payee> {
  const result = await api.post<Payee>("/api/payees", payload);
  return result.data;
}

export async function updatePayee(
  id: number,
  payload: PayeePayload
): Promise<Payee> {
  const result = await api.put<Payee>(`/api/payees/${id}`, payload);
  return result.data;
}

export async function deletePayee(id: number): Promise<void> {
  const result = await api.delete(`/api/payees/${id}`);
  return result.data;
}
