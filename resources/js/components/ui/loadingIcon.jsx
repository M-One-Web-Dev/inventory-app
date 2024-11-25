import React from "react";

export default function LoadingIcon({ color = "#262626" }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid"
            width="79"
            height="79"
            style={{
                shapeRendering: "auto",
                display: "block",
                background: "rgba(255, 255, 255, 0)",
            }}
            xmlnsXlink="http://www.w3.org/1999/xlink"
        >
            <g>
                {Array.from({ length: 12 }).map((_, index) => {
                    const rotation = index * 30; // Rotate by 30 degrees for each segment
                    const delay = -(index * 0.0567).toFixed(2); // Incremental delay for opacity animation

                    return (
                        <g key={index} transform={`rotate(${rotation} 50 50)`}>
                            <rect
                                fill={color}
                                height="12"
                                width="6"
                                ry="6"
                                rx="3"
                                y="24"
                                x="47"
                            >
                                <animate
                                    repeatCount="indefinite"
                                    begin={`${delay}s`}
                                    dur="0.6802721088435374s"
                                    keyTimes="0;1"
                                    values="1;0"
                                    attributeName="opacity"
                                ></animate>
                            </rect>
                        </g>
                    );
                })}
            </g>
        </svg>
    );
}
