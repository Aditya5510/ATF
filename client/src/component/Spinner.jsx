import React from "react";

const Spinner = ({ size, color = "#4f46e5", thickness = 2 }) => {
  return (
    <div
      className="relative inline-block animate-spin"
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <div
        className="absolute border-t-transparent rounded-full"
        style={{
          width: "100%",
          height: "100%",
          border: `${thickness}px solid ${color}`,
          borderTopColor: "transparent",
          opacity: 0.3,
        }}
      ></div>
      <div
        className="absolute border-t-transparent rounded-full animate-pulse"
        style={{
          width: "100%",
          height: "100%",
          border: `${thickness}px solid ${color}`,
          borderTopColor: "transparent",
          borderRightColor: "transparent",
          borderBottomColor: "transparent",
        }}
      ></div>
    </div>
  );
};

export default Spinner;
