import { DashboardData } from "../../types";
import StatsGrid from "../StatsGrid";
import RecentUsers from "../RecentUsers";

interface OverviewTabProps {
  data: DashboardData;
}

export default function OverviewTab({ data }: OverviewTabProps) {
  return (
    <div>
      <StatsGrid data={data} />
      <RecentUsers users={data.users} />
    </div>
  );
}