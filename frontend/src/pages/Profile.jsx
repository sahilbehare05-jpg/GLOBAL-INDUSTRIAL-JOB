import React, { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/Sidebar";
import Spinner from "../components/Spinner";
import { FiMail, FiUser } from "react-icons/fi";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/auth/profile");
        setProfile(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="flex min-h-screen bg-primary-50/40">
      <Sidebar />
      <main className="flex-1 p-6 md:p-10 max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h2>

        {loading || !profile ? (
          <Spinner />
        ) : (
          <div className="card p-8">
            <div className="flex items-center gap-2 mb-3 text-gray-700">
              <FiUser className="text-primary-600" /> <span className="font-medium">{profile.name}</span>
            </div>
            <div className="flex items-center gap-2 mb-6 text-gray-700">
              <FiMail className="text-primary-600" /> <span>{profile.email}</span>
            </div>

            <h3 className="font-semibold text-gray-800 mb-2">Purchased Notices</h3>
            {profile.purchasedNotices?.length ? (
              <ul className="space-y-2">
                {profile.purchasedNotices.map((n) => (
                  <li key={n._id} className="text-sm text-gray-600 bg-primary-50 rounded-lg px-3 py-2">
                    {n.title}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No premium notices purchased yet.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
