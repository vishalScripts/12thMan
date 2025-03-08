import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { CheckCircleIcon, ClockIcon, BoltIcon, CoffeeIcon } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const StatCard = ({ title, value, icon, color, percentage }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-xl shadow-lg flex flex-col relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg bg-${color}-100`}>{icon}</div>
      </div>

      {percentage !== undefined && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className={`bg-${color}-500 h-2 rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      )}

      <div
        className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-${color}-100 opacity-30`}
      />
    </motion.div>
  );
};

const StatsDashboard = () => {
  const stats = useSelector((state) => state.stats);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Calculate some derivatives
  const totalTime = stats.hoursStudied + stats.breakTime;
  const studyPercentage =
    totalTime > 0 ? (stats.hoursStudied / totalTime) * 100 : 0;
  const breakPercentage =
    totalTime > 0 ? (stats.breakTime / totalTime) * 100 : 0;

  // Format time values
  const formatHours = (hours) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  // Prepare data for charts
  const pieData = [
    { name: "Study", value: stats.hoursStudied, color: "#4F46E5" },
    { name: "Breaks", value: stats.breakTime, color: "#10B981" },
  ];

  const barData = [
    { name: "Tasks", value: stats.tasksDone, color: "#F59E0B" },
    { name: "Pomodoros", value: stats.pomodoros, color: "#EF4444" },
  ];

  // Sample weekly data (in a real app, this would come from an API or historical data)
  const weeklyData = [
    {
      day: "Mon",
      tasks: Math.round(stats.tasksDone * 0.2),
      hours: stats.hoursStudied * 0.15,
    },
    {
      day: "Tue",
      tasks: Math.round(stats.tasksDone * 0.1),
      hours: stats.hoursStudied * 0.2,
    },
    {
      day: "Wed",
      tasks: Math.round(stats.tasksDone * 0.3),
      hours: stats.hoursStudied * 0.25,
    },
    {
      day: "Thu",
      tasks: Math.round(stats.tasksDone * 0.15),
      hours: stats.hoursStudied * 0.15,
    },
    {
      day: "Fri",
      tasks: Math.round(stats.tasksDone * 0.25),
      hours: stats.hoursStudied * 0.25,
    },
  ];

  const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444"];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Productivity Stats
          </h1>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-indigo-600 text-white py-2 px-4 rounded-md text-sm font-medium cursor-pointer"
          >
            This Week
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Tasks Completed"
            value={stats.tasksDone}
            icon={<CheckCircleIcon size={24} className="text-green-500" />}
            color="green"
            percentage={
              stats.tasksDone > 0
                ? Math.min((stats.tasksDone / 10) * 100, 100)
                : 0
            }
          />

          <StatCard
            title="Hours Studied"
            value={formatHours(stats.hoursStudied)}
            icon={<ClockIcon size={24} className="text-blue-500" />}
            color="blue"
            percentage={studyPercentage}
          />

          <StatCard
            title="Break Time"
            value={formatHours(stats.breakTime)}
            icon={<CoffeeIcon size={24} className="text-amber-500" />}
            color="amber"
            percentage={breakPercentage}
          />

          <StatCard
            title="Pomodoros"
            value={stats.pomodoros}
            icon={<BoltIcon size={24} className="text-red-500" />}
            color="red"
            percentage={
              stats.pomodoros > 0
                ? Math.min((stats.pomodoros / 20) * 100, 100)
                : 0
            }
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-4">Time Distribution</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-4">Productivity Metrics</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" name="Count">
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-lg mb-8"
        >
          <h2 className="text-xl font-semibold mb-4">Weekly Progress</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={weeklyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="day" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="tasks"
                  name="Tasks"
                  stroke="#F59E0B"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="hours"
                  name="Hours"
                  stroke="#4F46E5"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <h2 className="text-xl font-semibold mb-4">Productivity Insights</h2>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="font-medium text-blue-800 mb-2">
                Efficiency Score
              </h3>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                  <motion.div
                    className="bg-blue-600 h-2.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(
                        (stats.tasksDone / Math.max(stats.pomodoros, 1)) * 100,
                        100
                      )}%`,
                    }}
                    transition={{ duration: 1 }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {Math.round(
                    (stats.tasksDone / Math.max(stats.pomodoros, 1)) * 100
                  )}
                  %
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Tasks completed per pomodoro session
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-100">
              <h3 className="font-medium text-green-800 mb-2">
                Focus/Break Ratio
              </h3>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                  <motion.div
                    className="bg-green-600 h-2.5 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${studyPercentage}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {Math.round(studyPercentage)}%
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Percentage of productive time vs. break time
              </p>
            </div>

            {stats.pomodoros > 0 && (
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                <h3 className="font-medium text-amber-800">
                  Average Study Time
                </h3>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {formatHours(stats.hoursStudied / stats.pomodoros)} per
                  pomodoro
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default StatsDashboard;
