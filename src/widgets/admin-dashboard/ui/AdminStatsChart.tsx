import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
} from 'recharts';

export interface AdminStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  trendData: { name: string; completed: number; total: number }[];
  planInfo: { planName: string; currentMembers: number; maxMembers: number };
}

interface AdminStatsChartProps {
  stats?: AdminStats;
  isLoading: boolean;
}

export function AdminStatsChart({ stats, isLoading }: AdminStatsChartProps) {
  if (isLoading || !stats) {
    return (
      <div className="grid h-80 w-full grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-1 animate-pulse rounded-xl bg-gray-100 lg:col-span-2" />
        <div className="col-span-1 animate-pulse rounded-xl bg-gray-100" />
      </div>
    );
  }

  const pieData = [
    { name: '완료됨', value: stats.completedTasks, fill: 'var(--color-brand-primary)' },
    { name: '진행 중', value: stats.pendingTasks, fill: 'var(--color-background-tertiary)' },
  ];

  const memberUsagePercent = Math.min(
    (stats.planInfo.currentMembers / stats.planInfo.maxMembers) * 100,
    100,
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="col-span-1 flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
        <h3 className="mb-6 text-lg font-bold text-gray-800">주차별 업무 처리 동향</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.trendData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748b' }}
                dy={10}
              />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Bar
                dataKey="total"
                name="전체 할 일"
                fill="var(--color-background-tertiary)"
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
              <Bar
                dataKey="completed"
                name="완료된 할 일"
                fill="var(--color-brand-primary)"
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="col-span-1 flex flex-col gap-6">
        <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="w-full text-left text-base font-bold text-gray-800">이번 달 달성률</h3>
          <div className="relative h-40 w-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-gray-800">
                {Math.round((stats.completedTasks / stats.totalTasks) * 100) || 0}%
              </span>
            </div>
          </div>
          <div className="mt-2 flex w-full justify-center gap-4 text-sm">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-emerald-500"></span>완료
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-slate-200"></span>진행 중
            </div>
          </div>
        </div>

        <div className="bg-brand-secondary rounded-xl p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-brand-tertiary text-sm font-bold">워크스페이스 플랜</h3>
            <span className="bg-brand-primary rounded-full px-2.5 py-0.5 text-xs font-bold text-indigo-700">
              {stats.planInfo.planName}
            </span>
          </div>
          <div className="mt-4">
            <div className="text-brand-tertiary mb-1.5 flex justify-between text-sm">
              <span>멤버 사용량</span>
              <span className="font-semibold">
                {stats.planInfo.currentMembers} / {stats.planInfo.maxMembers}명
              </span>
            </div>
            <div className="bg-background-primary h-2 w-full overflow-hidden rounded-full">
              <div
                className="bg-brand-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${memberUsagePercent}%` }}
              ></div>
            </div>
          </div>
          <button className="bg-brand-primary hover:bg-interaction-hover text-background-primary mt-5 w-full rounded-lg px-4 py-2.5 text-sm font-semibold shadow-sm transition-colors">
            플랜 업그레이드
          </button>
        </div>
      </div>
    </div>
  );
}
