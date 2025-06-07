import React from "react";

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="mt-4 flex justify-center gap-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className= {`px-4 py-2 bg-gray-300 rounded ${currentPage!==1 ?"hover:bg-gray-500":""}`}>
        Previous
      </button>
      <p className="px-4 py-2">{currentPage}</p>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 bg-gray-300 rounded ${currentPage!==totalPages ?"hover:bg-gray-500":""}`}
      >
        Next
      </button>
    </div>
  );
};

