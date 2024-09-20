import React from "react";

export function Chip({ text, variant }) {
    const handleVariant = () => {
        switch (variant) {
            case "success":
                return "bg-green-500 text-white";

            case "error":
                return "bg-red-500 text-white";
            default:
                return "bg-violet-500";
        }
    };

    return (
        <div
            className={`${handleVariant()} py-[5px] px-[15px] text-[16px] font-[800] w-max rounded-[50px]`}
        >
            {text}
        </div>
    );
}
