// import {
//   FiChevronLeft,
//   FiChevronRight,
// } from "react-icons/fi";

// export default function Pagination({
//   page = 1,
//   limit = 3,
//   total = 0,
//   onPageChange,
// }) {

//   const totalPages =
//     Math.ceil(total / limit) || 1;

//   if (totalPages === 1) {return null};


//   const getPages = () => {
//     const pages = [];

//     for (let i = 1; i <= totalPages; i++) {
//       pages.push(i);
//     }

//     return pages;
//   };

//   return (
//     <div
//       className="
//         flex flex-col sm:flex-row
//         items-center justify-between
//         gap-3 mt-6
//       "
//     >
   
//       <p className="text-sm text-gray-500">
//         Page <b>{page}</b> of{" "}
       
//       </p>


//       <div className="flex items-center gap-1">

//         {/* Prev */}
//         <button
//           onClick={() =>
//             onPageChange(page - 1)
//           }
//           disabled={page === 1}
//           className="
//             p-2 border rounded-lg
//             disabled:opacity-40
//             hover:bg-gray-100
//           "
//         >
//           <FiChevronLeft />
//         </button>

//         {/* Numbers */}
//         {getPages().map((p) => (
//           <button
//             key={p}
//             onClick={() =>
//               onPageChange(p)
//             }
//             className={`
//               px-3 py-1.5 border rounded-lg text-sm
//               ${
//                 p === page
//                   ? "bg-indigo-600 text-white border-indigo-600"
//                   : "hover:bg-gray-100"
//               }
//             `}
//           >
//             {p}
//           </button>
//         ))}

//         {/* Next */}
//         <button
//           onClick={() =>
//             onPageChange(page + 1)
//           }
//           disabled={
//             page === totalPages
//           }
//           className="
//             p-2 border rounded-lg
//             disabled:opacity-40
//             hover:bg-gray-100
//           "
//         >
//           <FiChevronRight />
//         </button>
//       </div>
//     </div>
//   );
// }

import {
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

export default function Pagination({
  page = 1,
  limit = 10,
  total = 0,
  onPageChange,
}) {
  const safeLimit = Number(limit) || 10;
  const safeTotal = Number(total) || 0;
  const currentPage = Number(page) || 1;

  const totalPages =
    Math.max(Math.ceil(safeTotal / safeLimit), 1);

  if (totalPages <= 1) return null;

  const maxVisiblePages = 5;

  const generatePages = () => {
    const pages = [];

    const start =
      Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2)
      );

    const end =
      Math.min(
        totalPages,
        start + maxVisiblePages - 1
      );

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1)
        pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const handleChange = (newPage) => {
    if (
      newPage < 1 ||
      newPage > totalPages ||
      newPage === currentPage
    )
      return;

    onPageChange(newPage);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6">

      {/* Page Info */}
      <p className="text-sm text-gray-500">
        Showing{" "}
        <b>
          {(currentPage - 1) * safeLimit + 1}
        </b>{" "}
        -{" "}
        <b>
          {Math.min(
            currentPage * safeLimit,
            safeTotal
          )}
        </b>{" "}
        of <b>{safeTotal}</b> results
      </p>

      {/* Controls */}
      <div
        className="flex items-center gap-1"
        role="navigation"
        aria-label="Pagination Navigation"
      >

        {/* Prev */}
        <button
          onClick={() =>
            handleChange(currentPage - 1)
          }
          disabled={currentPage === 1}
          className="p-2 border rounded-lg disabled:opacity-40 hover:bg-gray-100"
          aria-label="Previous Page"
        >
          <FiChevronLeft />
        </button>

        {/* Page Numbers */}
        {generatePages().map((p, index) =>
          p === "..." ? (
            <span
              key={index}
              className="px-2 text-gray-400"
            >
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() =>
                handleChange(p)
              }
              aria-current={
                p === currentPage
                  ? "page"
                  : undefined
              }
              className={`px-3 py-1.5 border rounded-lg text-sm ${
                p === currentPage
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "hover:bg-gray-100"
              }`}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() =>
            handleChange(currentPage + 1)
          }
          disabled={
            currentPage === totalPages
          }
          className="p-2 border rounded-lg disabled:opacity-40 hover:bg-gray-100"
          aria-label="Next Page"
        >
          <FiChevronRight />
        </button>

      </div>
    </div>
  );
}