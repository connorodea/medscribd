"use client";
import React from "react";

const AnimatedBackground = ({ children }) => {
  return (
    <div>
      <div
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: -1,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-20%",
              right: "-10%",
              width: "60%",
              height: "60%",
              background:
                "radial-gradient(circle, rgba(244, 184, 96, 0.3) 0%, rgba(244, 184, 96, 0) 60%)",
              filter: "blur(10px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-25%",
              left: "-15%",
              width: "70%",
              height: "70%",
              background:
                "radial-gradient(circle, rgba(15, 93, 93, 0.45) 0%, rgba(15, 93, 93, 0) 65%)",
              filter: "blur(18px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "20%",
              left: "15%",
              width: "120px",
              height: "120px",
              borderRadius: "999px",
              border: "1px solid rgba(232, 243, 241, 0.15)",
              background: "rgba(232, 243, 241, 0.04)",
              transform: "rotate(18deg)",
            }}
          />
        </div>
        {children}
      </div>
    </div>
  );
};

export default AnimatedBackground;
