// StatsCard.jsx
import { motion } from "framer-motion";
import CountUp from "react-countup";

export default function StatsCard({ title, value, icon, color, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`p-6 rounded-xl ${color}  text-text shadow-lg`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-3xl font-bold">
            <CountUp end={value} duration={2} />
          </h3>
          <p className="text-sm opacity-90">{title}</p>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </motion.div>
  );
}
