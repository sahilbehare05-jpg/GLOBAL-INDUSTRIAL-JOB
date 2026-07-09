import React, { useEffect, useState } from "react";
import { FiUsers, FiFileText, FiLock, FiUnlock, FiClock } from "react-icons/fi";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";
import Spinner from "../../components/Spinner";

const StatCard = ({ icon, label, value, color }) => (
  <div className="card p-6 flex items-center gap-4">
    <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
    <div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [noticesRes, paymentsRes] = await Promise.all([
          api.get("/notices/admin/all"),
          api.get("/payments/pending"),
        ]);

        const notices = noticesRes.data;
        const totalUsers = null; // no dedicated endpoint; can be added later

        setStats({
          totalNotices: notices.length,
          premiumNotices: notices.filter((n) => n.isPremium).length,
          freeNotices: notices.filter((n) => !n.isPremium).length,
          pendingPayments: paymentsRes.data.length,
          totalUsers,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="flex min-h-screen bg-primary-50/40">
      <Sidebar />
      <main className="flex-1 p-6 md:p-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>

        {loading || !stats ? (
          <Spinner />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              icon={<FiUsers className="text-primary-600" />}
              label="Total Notices"
              value={stats.totalNotices}
              color="bg-primary-50"
            />
            <StatCard
              icon={<FiLock className="text-amber-600" />}
              label="Premium Notices"
              value={stats.premiumNotices}
              color="bg-amber-50"
            />
            <StatCard
              icon={<FiUnlock className="text-green-600" />}
              label="Free Notices"
              value={stats.freeNotices}
              color="bg-green-50"
            />
            <StatCard
              icon={<FiClock className="text-red-500" />}
              label="Pending Payments"
              value={stats.pendingPayments}
              color="bg-red-50"
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
