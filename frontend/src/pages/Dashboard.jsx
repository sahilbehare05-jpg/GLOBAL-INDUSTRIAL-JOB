import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import NoticeCard from "../components/NoticeCard";
import Spinner from "../components/Spinner";

const CATEGORIES = ["All", "Mechanical", "Electrical", "Oil & Gas", "Civil", "Safety", "Other"];

const Dashboard = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/notices", { params: { search, category } });
      setNotices(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(fetchNotices, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category]);

  return (
    <div className="flex min-h-screen bg-primary-50/40">
      <Sidebar />
      <main className="flex-1 p-6 md:p-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Notices</h2>

        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="flex items-center flex-1 bg-white border border-gray-200 rounded-xl px-3">
            <FiSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search notices..."
              className="w-full px-2 py-2 focus:outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="input-field md:w-56"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <Spinner />
        ) : notices.length === 0 ? (
          <p className="text-gray-500">No notices found.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {notices.map((n) => (
              <NoticeCard key={n._id} notice={n} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
