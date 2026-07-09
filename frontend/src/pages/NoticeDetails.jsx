import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FiLock, FiCheckCircle } from "react-icons/fi";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Spinner from "../components/Spinner";

const UPI_ID = "ankush.afpl-1@okhdfcbank";

const NoticeDetails = () => {
  const { id } = useParams();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paid, setPaid] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchNotice = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/notices/${id}`);
      setNotice(data);
    } catch (error) {
      toast.error("Could not load notice");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleIHavePaid = async () => {
    setSubmitting(true);
    try {
      await api.post("/payments", { noticeId: id });
      setPaid(true);
      toast.success("Payment request submitted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not submit payment request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-primary-50/40">
      <Sidebar />
      <main className="flex-1 p-6 md:p-10 max-w-3xl">
        {loading || !notice ? (
          <Spinner />
        ) : (
          <div className="card p-8">
            <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
              {notice.category}
            </span>
            <h2 className="text-2xl font-bold text-gray-800 mt-3 mb-1">{notice.title}</h2>
            <p className="text-xs text-gray-400 mb-6">
              {new Date(notice.date).toLocaleDateString()}
            </p>

            <p className="text-gray-600 mb-6">{notice.shortDescription}</p>

            {notice.hasAccess ? (
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Full Information</h3>
                <p className="text-gray-600 whitespace-pre-line">{notice.fullInformation}</p>
              </div>
            ) : (
              <div className="border border-amber-200 bg-amber-50 rounded-xl p-6 text-center">
                <FiLock className="mx-auto text-amber-600 mb-2" size={28} />
                <p className="font-semibold text-amber-800 mb-1">This information is Premium.</p>
                <p className="text-sm text-amber-700 mb-4">Unlock this Notice — ₹{notice.price || 99}</p>

                {!paid ? (
                  <>
                    <div className="bg-white inline-block p-4 rounded-xl border border-gray-200 mb-4">
                      {/* Placeholder QR code - replace src with your real UPI QR image */}
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=${UPI_ID}%26pn=GlobalIndustrialJob%26am=${notice.price || 99}`}
                        alt="UPI QR Code"
                        className="w-40 h-40 mx-auto"
                      />
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Or pay via UPI ID: <span className="font-semibold">{UPI_ID}</span>
                    </p>
                    <button onClick={handleIHavePaid} disabled={submitting} className="btn-primary">
                      {submitting ? "Submitting..." : "I Have Paid"}
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-green-700">
                    <FiCheckCircle size={28} />
                    <p className="font-medium">Payment verification is pending.</p>
                    <p className="text-sm text-green-600">Admin will activate your access shortly.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default NoticeDetails;
