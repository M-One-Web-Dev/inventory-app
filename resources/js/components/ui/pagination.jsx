import React, { useState } from "react";
import { Button } from "./button";
import {
    HiOutlineChevronLeft,
    HiOutlineChevronRight,
    HiOutlineChevronDoubleRight,
    HiOutlineChevronDoubleLeft,
} from "react-icons/hi2";

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const generatePagination = () => {
        const pages = [];

        if (totalPages <= 6) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage < 3) {
                pages.push(1, 2, 3, 4, "...", totalPages);
            } else if (currentPage >= 3 && currentPage <= totalPages - 3) {
                pages.push(
                    1,
                    "...",
                    currentPage,
                    currentPage + 1,
                    "...",
                    totalPages
                );
            } else {
                pages.push(
                    1,
                    "...",
                    totalPages - 3,
                    totalPages - 2,
                    totalPages - 1,
                    totalPages
                );
            }
        }

        return pages;
    };

    const paginationItems = generatePagination();

    return (
        <div className="flex items-center justify-center space-x-2">
            <Button
                size="sm"
                className={`${
                    currentPage === 1
                        ? "text-neutral-400 disabled:opacity-100"
                        : "text-black"
                } rounded-xl m-0 p-0 h-[35px] w-[35px] bg-neutral-100  hover:bg-neutral-200`}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <HiOutlineChevronLeft className="text-[16px]" />
            </Button>
            {paginationItems.map((page, index) =>
                page === "..." ? (
                    <span
                        key={index}
                        className=""
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        {hoveredIndex === index ? (
                            <Button
                                size="sm"
                                className="flex items-center justify-center rounded-xl p-0 h-[35px] w-[35px] bg-neutral-100 hover:bg-neutral-200 transition-all duration-300 active:scale-95"
                                onClick={() =>
                                    onPageChange(
                                        index === 1
                                            ? currentPage - 2
                                            : currentPage + 2
                                    )
                                }
                            >
                                {index === 1 ? (
                                    <HiOutlineChevronDoubleLeft className="text-[16px] text-black" />
                                ) : (
                                    <HiOutlineChevronDoubleRight className="text-[16px] text-black" />
                                )}
                            </Button>
                        ) : (
                            <div className="h-[35px] w-[35px] flex justify-center items-center">
                                <span>...</span>
                            </div>
                        )}
                    </span>
                ) : (
                    <Button
                        key={index}
                        size="sm"
                        className={`${
                            page === currentPage
                                ? "bg-violet-600 hover:bg-violet-500 text-white font-semibold"
                                : "bg-neutral-100 text-black hover:bg-neutral-200"
                        } rounded-xl pt-[3px] h-[35px] w-[35px] transition-all duration-300 active:scale-95`}
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </Button>
                )
            )}
            <Button
                size="sm"
                className={`${
                    currentPage === totalPages
                        ? "text-neutral-400 disabled:opacity-100"
                        : "text-black"
                } rounded-xl m-0 p-0 h-[35px] w-[35px] bg-neutral-100  hover:bg-neutral-200`}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <HiOutlineChevronRight className="text-[16px]" />
            </Button>
        </div>
    );
};
