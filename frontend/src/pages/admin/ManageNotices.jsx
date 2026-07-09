import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiX } from "react-icons/fi";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";
import Spinner from "../../components/Spinner";

const emptyForm = {
  title: "",
  shortDescription: "",
  fullInformation: "",
  category: "Mechanical",
  isPremium: false,
  price: 99,
  date: "",
};

const ManageNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/notices/admin/all");
      setNotices(data);
    } catch (error) {
      toast.error("Could not load notices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setImageFile(null);
    setShowModal(true);
  };

  const openEditModal = (notice) => {
    setEditingId(notice._id);
    setForm({
      title: notice.title,
      shortDescription: notice.shortDescription,
      fullInformation: notice.fullInformation,
      category: notice.category,
      isPremium: notice.isPremium,
      price: notice.price,
      date: notice.date ? notice.date.substring(0, 10) : "",
    });
    setImageFile(null);
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, val]) => fd.append(key, val));
      if (imageFile) fd.append("image", imageFile);

      if (editingId) {
        await api.put(`/notices/${editingId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Notice updated");
      } else {
        await api.post("/notices", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Notice created");
      }
      setShowModal(false);
      fetchNotices();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save notice");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this notice?")) return;
    try {
      await api.delete(`/notices/${id}`);
      toast.success("Notice deleted");
      fetchNotices();
    } catch (error) {
      toast.error("Could not delete notice");
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      await api.patch(`/notices/${id}/publish`);
      fetchNotices();
    } catch (error) {
      toast.error("Could not update notice");
    }
  };

  return (
    <div className="flex min-h-screen bg-primary-50/40">
      <Sidebar />
      <main className="flex-1 p-6 md:p-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Manage Notices</h2>
          <button onClick={openCreateModal} className="btn-primary flex items-center gap-2">
            <FiPlus /> Create Notice
          </button>
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-primary-50 text-gray-600">
                <tr>
                  <th className="text-left px-4 py-3">Title</th>
                  <th className="text-left px-4 py-3">Category</th>
                  <th className="text-left px-4 py-3">Type</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {notices.map((n) => (
                  <tr key={n._id} className="border-t border-gray-100">
                    <td className="px-4 py-3 font-medium text-gray-800">{n.title}</td>
                    <td className="px-4 py-3">{n.category}</td>
                    <td className="px-4 py-3">{n.isPremium ? `Premium (₹${n.price})` : "Free"}</td>
                    <td className="px-4 py-3">
                      <span className={n.isPublished ? "text-green-600" : "text-gray-400"}>
                        {n.isPublished ? "Published" : "Unpublished"}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex gap-3">
                      <button onClick={() => openEditModal(n)} className="text-primary-600" title="Edit">
                        <FiEdit2 />
                      </button>
                      <button onClick={() => handleTogglePublish(n._id)} className="text-gray-500" title="Publish/Unpublish">
                        {n.isPublished ? <FiEyeOff /> : <FiEye />}
                      </button>
                      <button onClick={() => handleDelete(n._id)} className="text-red-500" title="Delete">
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <FiX size={20} />
              </button>
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                {editingId ? "Edit Notice" : "Create Notice"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  className="input-field"
                  name="title"
                  placeholder="Heading / Title"
                  required
                  value={form.title}
                  onChange={handleChange}
                />
                <textarea
                  className="input-field"
                  name="shortDescription"
                  placeholder="Short Description (2-3 lines)"
                  required
                  rows={2}
                  value={form.shortDescription}
                  onChange={handleChange}
                />
                <textarea
                  className="input-field"
                  name="fullInformation"
                  placeholder="Complete Information"
                  required
                  rows={4}
                  value={form.fullInformation}
                  onChange={handleChange}
                />
                <div className="grid grid-cols-2 gap-3">
                  <select
                    className="input-field"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                  >
                    {["Mechanical", "Electrical", "Oil & Gas", "Civil", "Safety", "Other"].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <input
                    type="date"
                    className="input-field"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      name="isPremium"
                      checked={form.isPremium}
                      onChange={handleChange}
                    />
                    Premium Notice
                  </label>
                  {form.isPremium && (
                    <input
                      type="number"
                      className="input-field w-28"
                      name="price"
                      placeholder="Price ₹"
                      value={form.price}
                      onChange={handleChange}
                    />
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-600 block mb-1">Upload Image (optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                  />
                </div>

                <button type="submit" disabled={saving} className="btn-primary w-full mt-2">
                  {saving ? "Saving..." : editingId ? "Update Notice" : "Create Notice"}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ManageNotices;
