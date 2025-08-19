"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, Bar, PieChart, Pie, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell 
} from "recharts";
import { Users, TrendingUp, Calendar, Smartphone } from "lucide-react";
import { format } from "date-fns";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface Statistics {
  totalResponses: number;
  todayResponses: number;
  deviceStats: Array<{ device_type: string; count: number }>;
  ageStats: Array<{ age_group: string; count: number }>;
  genderStats: Array<{ gender: string; count: number }>;
  regionStats: Array<{ region: string; count: number }>;
  aiUsageStats: Array<{ ai_agent_awareness: string; count: number }>;
  dailyStats: Array<{ date: string; count: number }>;
}

interface Response {
  id: number;
  created_at: string;
  gender?: string;
  age_group?: string;
  region?: string;
  device_type?: string;
  ai_agent_awareness?: string;
}

export default function AdminDashboard() {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, responsesRes] = await Promise.all([
        fetch('/api/admin/statistics'),
        fetch('/api/survey/stats')
      ]);
      
      const statsData = await statsRes.json();
      const responsesData = await responsesRes.json();
      
      if (statsData.success) {
        setStatistics(statsData.data);
      }
      if (responsesData.success) {
        setResponses(responsesData.responses);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">加载中...</h1>
        </div>
      </div>
    );
  }

  const formatGenderLabel = (value: string) => {
    const labels: Record<string, string> = {
      'male': '男性',
      'female': '女性',
      'other': '其他'
    };
    return labels[value] || value;
  };

  const formatDeviceLabel = (value: string) => {
    const labels: Record<string, string> = {
      'android': '安卓',
      'ios': '苹果'
    };
    return labels[value] || value;
  };

  const formatAgeLabel = (value: string) => {
    const labels: Record<string, string> = {
      'under_18': '18岁以下',
      '18_24': '18-24岁',
      '25_34': '25-34岁',
      '35_44': '35-44岁',
      '45_54': '45-54岁',
      '55_plus': '55岁以上'
    };
    return labels[value] || value;
  };

  const formatAIAwarenessLabel = (value: string) => {
    const labels: Record<string, string> = {
      'heard_used': '听说过并使用',
      'heard_not_used': '听说过但没用过',
      'never_heard': '没听说过'
    };
    return labels[value] || value;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">调查问卷数据分析后台</h1>
        
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">总响应数</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics?.totalResponses || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">今日响应</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics?.todayResponses || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">设备分布</CardTitle>
              <Smartphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm">
                {statistics?.deviceStats.map(d => (
                  <div key={d.device_type}>
                    {formatDeviceLabel(d.device_type)}: {d.count}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">平均每日</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statistics?.dailyStats.length 
                  ? Math.round(statistics.totalResponses / statistics.dailyStats.length)
                  : 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 图表区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* 性别分布饼图 */}
          <Card>
            <CardHeader>
              <CardTitle>性别分布</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statistics?.genderStats.map(g => ({
                      name: formatGenderLabel(g.gender),
                      value: g.count
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statistics?.genderStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 年龄分布柱状图 */}
          <Card>
            <CardHeader>
              <CardTitle>年龄分布</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statistics?.ageStats.map(a => ({
                  age: formatAgeLabel(a.age_group),
                  count: a.count
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* AI认知度饼图 */}
          <Card>
            <CardHeader>
              <CardTitle>AI助手认知度</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statistics?.aiUsageStats.map(a => ({
                      name: formatAIAwarenessLabel(a.ai_agent_awareness),
                      value: a.count
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statistics?.aiUsageStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 每日提交趋势 */}
          <Card>
            <CardHeader>
              <CardTitle>每日提交趋势</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={statistics?.dailyStats.slice().reverse().map(d => ({
                  date: format(new Date(d.date), 'MM/dd'),
                  count: d.count
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* 数据表格 */}
        <Card>
          <CardHeader>
            <CardTitle>最近提交的调查数据</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">ID</th>
                    <th className="text-left p-2">提交时间</th>
                    <th className="text-left p-2">性别</th>
                    <th className="text-left p-2">年龄段</th>
                    <th className="text-left p-2">地区</th>
                    <th className="text-left p-2">设备类型</th>
                    <th className="text-left p-2">AI认知</th>
                  </tr>
                </thead>
                <tbody>
                  {responses.slice(0, 10).map((response) => (
                    <tr key={response.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{response.id}</td>
                      <td className="p-2">{format(new Date(response.created_at), 'yyyy-MM-dd HH:mm')}</td>
                      <td className="p-2">{response.gender ? formatGenderLabel(response.gender) : '-'}</td>
                      <td className="p-2">{response.age_group ? formatAgeLabel(response.age_group) : '-'}</td>
                      <td className="p-2">{response.region || '-'}</td>
                      <td className="p-2">{response.device_type ? formatDeviceLabel(response.device_type) : '-'}</td>
                      <td className="p-2">{response.ai_agent_awareness ? formatAIAwarenessLabel(response.ai_agent_awareness) : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}