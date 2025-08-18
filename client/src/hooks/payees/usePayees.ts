import { useQuery } from "@tanstack/react-query";
import { getPayees, type Payee } from "../../services/payees";

export const usePayees = () => {
  const { data: payees = [], isLoading } = useQuery<Payee[]>({
    queryKey: ["payees"],
    queryFn: getPayees,
  });

  return { payees, isLoading };
};
