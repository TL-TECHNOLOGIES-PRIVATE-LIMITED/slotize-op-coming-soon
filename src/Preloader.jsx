import React from "react";

const Preloader = () => {
  return (
    <div
      id="preloader"
      className="fixed inset-0 bg-slate-100 z-[99999999] flex flex-col justify-center items-center"
    >
      <div
        id="status"
        className="w-28 h-28 bg-center bg-no-repeat bg-cover  animate-fadeIn"
        style={{
          backgroundImage: "url('/Slotize.png')",
          backgroundSize: "80px auto",
          transform: "scale(1.5)",
        }}
      ></div>
      <div
        id="preloader-text"
        className="text-4xl font-semibold text-[#19B2EB] text-center tracking-wide animate-fadeIn"
      >
        SLOTIZE
      </div>
    </div>
  );
};

export default Preloader;
