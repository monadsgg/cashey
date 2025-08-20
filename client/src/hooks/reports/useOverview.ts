import { useQuery } from "@tanstack/react-query";
import { getOverview, type StatsOverview } from "../../services/reports";

export const useStatsOverview = (month: number, year: number) => {
  const { data: statsOverview, isLoading } = useQuery<StatsOverview>({
    queryKey: ["statsOverview", month, year],
    queryFn: () => getOverview(month, year),
  });

  return { statsOverview, isLoading };
};
