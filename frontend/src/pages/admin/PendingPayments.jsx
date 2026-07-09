import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiCheck, FiX } from "react-icons/fi";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";
import Spinner from "../../components/Spinner";

const PendingPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/payments/pending");
      setPayments(data);
    } catch (error) {
      toast.error("Could not load pending payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.patch(`/payments/${id}/approve`);
      toast.success("Payment approved");
      fetchPayments();
    } catch (error) {
      toast.error("Could not approve payment");
    }
  };

  const handleReject = async (id) => {
    try {
      await api.patch(`/payments/${id}/reject`);
      toast.success("Payment rejected");
      fetchPayments();
    } catch (error) {
      toast.error("Could not reject payment");
    }
  };

  return (
    <div className="flex min-h-screen bg-primary-50/40">
      <Sidebar />
      <main className="flex-1 p-6 md:p-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Pending Payments</h2>

        {loading ? (
          <Spinner />
        ) : payments.length === 0 ? (
          <p className="text-gray-500">No pending payment requests.</p>
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-primary-50 text-gray-600">
                <tr>
                  <th className="text-left px-4 py-3">User</th>
                  <th className="text-left px-4 py-3">Notice</th>
                  <th className="text-left px-4 py-3">Amount</th>
                  <th className="text-left px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p._id} className="border-t border-gray-100">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{p.user?.name}</p>
                      <p className="text-xs text-gray-400">{p.user?.email}</p>
                    </td>
                    <td className="px-4 py-3">{p.notice?.title}</td>
                    <td className="px-4 py-3">₹{p.amount}</td>
                    <td className="px-4 py-3 flex gap-3">
                      <button
                        onClick={() => handleApprove(p._id)}
                        className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-lg text-xs font-medium"
                      >
                        <FiCheck /> Approve
                      </button>
                      <button
                        onClick={() => handleReject(p._id)}
                        className="flex items-center gap-1 text-red-500 bg-red-50 px-3 py-1 rounded-lg text-xs font-medium"
                      >
                        <FiX /> Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default PendingPayments;
