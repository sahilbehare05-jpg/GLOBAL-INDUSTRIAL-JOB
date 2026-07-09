import React from "react";

const Spinner = ({ size = "h-8 w-8" }) => (
  <div className="flex justify-center items-center py-8">
    <div className={`${size} border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin`} />
  </div>
);

export default Spinner;
