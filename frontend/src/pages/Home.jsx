import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiBriefcase, FiLock, FiTrendingUp } from "react-icons/fi";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="flex items-center justify-between px-6 md:px-16 py-5 border-b border-gray-100">
        <h1 className="text-xl font-bold text-primary-700">GLOBAL INDUSTRIAL JOB</h1>
        <div className="flex gap-3">
          <Link to="/login" className="btn-outline text-sm">Login</Link>
          <Link to="/register" className="btn-primary text-sm">Register</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 md:px-16 py-20 bg-gradient-to-b from-primary-50 to-white text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-5xl font-bold text-gray-800 mb-4"
        >
          Latest Industrial Job Notices,<br /> All in One Place
        </motion.h2>
        <p className="text-gray-500 max-w-xl mx-auto mb-8">
          Stay updated with the latest recruitment, hiring, and industrial news.
          Free updates for everyone, premium insights for members.
        </p>
        <Link to="/register" className="btn-primary inline-flex items-center gap-2 text-base px-6 py-3">
          Get Started <FiArrowRight />
        </Link>
      </section>

      {/* Features */}
      <section className="px-6 md:px-16 py-16 grid md:grid-cols-3 gap-6">
        <div className="card p-6 text-center">
          <FiBriefcase className="mx-auto text-primary-600 mb-3" size={28} />
          <h3 className="font-semibold text-gray-800 mb-2">Latest Jobs</h3>
          <p className="text-sm text-gray-500">Fresh industrial and mechanical recruitment notices, updated regularly.</p>
        </div>
        <div className="card p-6 text-center">
          <FiLock className="mx-auto text-primary-600 mb-3" size={28} />
          <h3 className="font-semibold text-gray-800 mb-2">Premium Information</h3>
          <p className="text-sm text-gray-500">Unlock detailed recruitment info with a simple UPI payment.</p>
        </div>
        <div className="card p-6 text-center">
          <FiTrendingUp className="mx-auto text-primary-600 mb-3" size={28} />
          <h3 className="font-semibold text-gray-800 mb-2">Industrial Updates</h3>
          <p className="text-sm text-gray-500">Get the latest industry trends and hiring updates in one dashboard.</p>
        </div>
      </section>

      <footer className="px-6 md:px-16 py-8 border-t border-gray-100 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Global Industrial Job. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
