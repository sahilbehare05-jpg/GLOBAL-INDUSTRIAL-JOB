import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiLock, FiCalendar, FiTag } from "react-icons/fi";

const NoticeCard = ({ notice }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="flex items-center gap-1 text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
            <FiTag size={12} /> {notice.category}
          </span>
          {notice.isPremium && (
            <span className="flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded-full">
              <FiLock size={12} /> Premium
            </span>
          )}
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-1">{notice.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-3 mb-3">{notice.shortDescription}</p>

        <div className="flex items-center gap-1 text-xs text-gray-400 mb-4">
          <FiCalendar size={12} />
          {new Date(notice.date).toLocaleDateString()}
        </div>
      </div>

      <Link to={`/notice/${notice._id}`} className="btn-primary text-center text-sm">
        Read More
      </Link>
    </motion.div>
  );
};

export default NoticeCard;
