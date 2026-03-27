import React from "react";
import { IoMdAdd } from "react-icons/io";

const Header = ({ setAdd }) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-sky-100 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <button
          className="flex items-center gap-3 text-left"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          type="button"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-200 bg-sky-50 text-lg font-semibold text-sky-700 shadow-[0_12px_30px_rgba(56,189,248,0.18)]">
            A
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.32em] text-slate-500">
              Retail dashboard
            </p>
            <h1 className="text-lg font-semibold text-slate-900 sm:text-xl">
              Anndorch Priceboard
            </h1>
          </div>
        </button>

        <button
          className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-600"
          onClick={() => setAdd(true)}
          type="button"
        >
          <IoMdAdd className="text-lg" />
          Add product
        </button>
      </div>
    </header>
  );
};

export default Header;
