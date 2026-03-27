"use client";

import React, {
  useDeferredValue,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import Header from "./component/header";
import Spotlight from "./component/ui/spotlight";
import CardSpotlight from "./component/ui/cardSpotlight";

const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

const initialProductState = {
  name: "",
  price: "",
};

const Notice = ({ feedback }) => {
  if (feedback.error) {
    return (
      <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        {feedback.error}
      </p>
    );
  }

  if (feedback.success) {
    return (
      <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
        {feedback.success}
      </p>
    );
  }

  return null;
};

const ModalShell = ({ eyebrow, title, description, children, actions }) => (
  <div className="w-full max-w-lg rounded-[30px] border border-sky-100 bg-white/95 p-6 shadow-[0_30px_80px_rgba(148,163,184,0.22)]">
    <div className="mb-6 space-y-2">
      <p className="text-xs font-medium uppercase tracking-[0.28em] text-sky-600">
        {eyebrow}
      </p>
      <h3 className="text-2xl font-semibold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-600">{description}</p>
    </div>

    {children}
    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      {actions}
    </div>
  </div>
);

const Page = () => {
  const [data, setData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [add, setAdd] = useState(false);
  const [pro, setPro] = useState(initialProductState);
  const [upPrice, setUpPrice] = useState("");
  const [edit, setEdit] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busyAction, setBusyAction] = useState("");
  const [feedback, setFeedback] = useState({ error: "", success: "" });
  const searchFormRef = useRef(null);
  const searchInputRef = useRef(null);

  const searchQuery = useDeferredValue(searchInput).trim().toLowerCase();

  const handleBodyTap = useEffectEvent((event) => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: coarse)").matches) return;
    if (document.activeElement !== searchInputRef.current) return;
    if (searchFormRef.current?.contains(event.target)) return;

    searchInputRef.current?.blur();
  });

  useEffect(() => {
    async function getProducts() {
      setLoading(true);

      try {
        const res = await axios.get("/api/getProduct");
        const products = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
            ? res.data.data
            : [];
        setData(products);
      } catch (error) {
        console.log(error);
        setData([]);
        setFeedback({
          error: "Unable to load products right now.",
          success: "",
        });
      } finally {
        setLoading(false);
      }
    }

    getProducts();
  }, []);

  const clearFeedback = () => setFeedback({ error: "", success: "" });

  const closeAddModal = () => {
    setAdd(false);
    setPro(initialProductState);
    clearFeedback();
  };

  const closeEditModal = () => {
    setEdit(false);
    setSelectedItem(null);
    setUpPrice("");
    clearFeedback();
  };

  const filteredData = data.filter((item) => {
    if (!searchQuery) return true;

    const name = item?.name?.toLowerCase() || "";
    const price = String(item?.price ?? "");

    return name.includes(searchQuery) || price.includes(searchQuery);
  });

  const totalProducts = data.length;
  const totalPrice = data.reduce(
    (sum, item) => sum + Number(item?.price || 0),
    0,
  );
  const highestPrice = totalProducts
    ? Math.max(...data.map((item) => Number(item?.price || 0)))
    : 0;
  const stats = [
    { label: "Products tracked", value: totalProducts },
    {
      label: "Average price",
      value: currencyFormatter.format(
        totalProducts ? Math.round(totalPrice / totalProducts) : 0,
      ),
    },
    {
      label: "Highest price",
      value: currencyFormatter.format(highestPrice),
    },
  ];

  async function addProduct() {
    if (!pro.name.trim() || !pro.price) {
      setFeedback({
        error: "Enter both a product name and a valid price.",
        success: "",
      });
      return;
    }

    setBusyAction("add");
    clearFeedback();

    try {
      const res = await axios.post("/api/addProduct", {
        name: pro.name.trim(),
        price: Number(pro.price),
      });
      const createdProduct = Array.isArray(res.data?.data) ? res.data.data[0] : null;

      if (createdProduct) {
        setData((prev) => [createdProduct, ...prev]);
      }

      setPro(initialProductState);
      setAdd(false);
      setFeedback({
        error: "",
        success: "Product added successfully.",
      });
    } catch (error) {
      console.log(error);
      setFeedback({
        error: "Unable to add product.",
        success: "",
      });
    } finally {
      setBusyAction("");
    }
  }

  async function deleteProduct(id) {
    setBusyAction(`delete-${id}`);
    clearFeedback();

    try {
      await axios.delete(`/api/deleteProduct/${id}`);
      setData((prev) => prev.filter((item) => item.id !== id));
      setFeedback({
        error: "",
        success: "Product deleted successfully.",
      });
    } catch (error) {
      console.log(error);
      setFeedback({
        error: "Unable to delete product.",
        success: "",
      });
    } finally {
      setBusyAction("");
    }
  }

  async function updatePrice() {
    if (!selectedItem?.id || !upPrice) {
      setFeedback({
        error: "Enter a valid price before updating.",
        success: "",
      });
      return;
    }

    setBusyAction(`update-${selectedItem.id}`);
    clearFeedback();

    try {
      const res = await axios.patch(`/api/updateProduct/${selectedItem.id}`, {
        price: Number(upPrice),
      });
      const updatedProduct = Array.isArray(res.data?.data) ? res.data.data[0] : null;

      setData((prev) =>
        prev.map((item) =>
          item.id === selectedItem.id
            ? updatedProduct || { ...item, price: Number(upPrice) }
            : item,
        ),
      );

      setEdit(false);
      setSelectedItem(null);
      setUpPrice("");
      setFeedback({
        error: "",
        success: "Price updated successfully.",
      });
    } catch (error) {
      console.log(error);
      setFeedback({
        error: "Unable to update price.",
        success: "",
      });
    } finally {
      setBusyAction("");
    }
  }

  return (
    <div className="min-h-dvh w-full" onPointerDown={handleBodyTap}>
      <Header
        setAdd={(value) => {
          clearFeedback();
          setAdd(value);
        }}
      />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pb-14">
        <section className="relative overflow-hidden rounded-[32px] border border-sky-100 bg-white/85 px-6 py-10 shadow-[0_30px_80px_rgba(148,163,184,0.18)] sm:px-8 lg:px-10">
          <Spotlight className="-top-44 left-0 h-[150%] w-[120%]" fill="#22d3ee" />
          <Spotlight className="left-[65%] top-16 h-[110%] w-[90%]" fill="#0ea5e9" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(125,211,252,0.28),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.96),rgba(239,246,255,0.92))]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:42px_42px] opacity-40" />

          <div className="relative z-10 grid gap-8 lg:grid-cols-[1.4fr_0.9fr] lg:items-end">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-medium uppercase tracking-[0.28em] text-sky-700">
                Trusted store pricing
              </div>

              <div className="space-y-4">
                <h2 className="max-w-3xl text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
                  Everyday essentials, clearly priced for every customer.
                </h2>
                <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                  Keep track of the products on your shelves, check current
                  prices at a glance, and make quick updates so the store stays
                  ready for the next sale.
                </p>
              </div>

              <form
                ref={searchFormRef}
                onSubmit={(event) => event.preventDefault()}
                className="flex flex-col gap-3 rounded-[24px] border border-sky-100 bg-white/80 p-3 shadow-[0_20px_60px_rgba(14,165,233,0.08)] backdrop-blur xl:flex-row"
              >
                <div className="flex flex-1 items-center gap-3 rounded-[18px] border border-sky-100 bg-slate-50 px-4 py-3">
                  <FaSearch className="text-base text-sky-600" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search products or prices"
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    className="w-full bg-transparent text-[16px] text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-[18px] bg-sky-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 sm:text-base"
                >
                  Search inventory
                </button>
              </form>

              <Notice feedback={feedback} />
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {stats.map((stat) => (
                <CardSpotlight className="p-5" color="34, 211, 238" key={stat.label} radius={260}>
                  <p className="text-xs font-medium uppercase tracking-[0.28em] text-slate-500">
                    {stat.label}
                  </p>
                  <p className="mt-4 text-3xl font-semibold text-slate-900">
                    {stat.value}
                  </p>
                </CardSpotlight>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-sky-100 bg-white/85 p-4 shadow-[0_24px_80px_rgba(148,163,184,0.18)] backdrop-blur sm:p-6">
          <div className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-slate-500">
                Inventory overview
              </p>
              <h3 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                Current product pricing
              </h3>
              <p className="text-sm text-slate-600 sm:text-base">
                {searchQuery
                  ? `${filteredData.length} result(s) for "${searchInput.trim()}".`
                  : "A clear view of the items and prices your store manages every day."}
              </p>
            </div>

            <button
              className="inline-flex items-center justify-center gap-2 rounded-full border border-sky-200 bg-sky-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-600"
              onClick={() => {
                clearFeedback();
                setAdd(true);
              }}
              type="button"
            >
              <IoMdAdd />
              Add new product
            </button>
          </div>

          {loading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[0, 1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-36 animate-pulse rounded-[28px] border border-slate-200 bg-slate-100"
                />
              ))}
            </div>
          ) : null}

          {!loading && filteredData.length === 0 ? (
            <div className="flex min-h-[220px] items-center justify-center rounded-[26px] border border-dashed border-slate-200 bg-slate-50 px-6 text-center">
              <div className="max-w-md space-y-3">
                <p className="text-sm font-medium uppercase tracking-[0.3em] text-sky-600">
                  No match
                </p>
                <h3 className="text-2xl font-semibold text-slate-900">
                  No products matched your search.
                </h3>
                <p className="text-sm text-slate-600 sm:text-base">
                  Try another keyword or add a fresh product to keep your pricing board current.
                </p>
              </div>
            </div>
          ) : null}

          {!loading && filteredData.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredData.map((item, index) => {
                const deleteBusy = busyAction === `delete-${item.id}`;

                return (
                  <CardSpotlight
                    className="p-5 sm:p-6"
                    color={index % 2 === 0 ? "34, 211, 238" : "56, 189, 248"}
                    key={item.id || index}
                  >
                    <div className="flex h-full flex-col gap-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-3">
                          <p className="text-xs font-medium uppercase tracking-[0.28em] text-slate-500">
                            Product
                          </p>
                          <h4 className="text-2xl font-semibold capitalize text-slate-900">
                            {item.name}
                          </h4>
                          <p className="text-sm text-slate-600">
                            A store essential ready for quick price checks and updates.
                          </p>
                        </div>

                        <div className="rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700">
                          {currencyFormatter.format(Number(item.price || 0))}
                        </div>
                      </div>

                      <div className="mt-auto flex flex-wrap items-center gap-3">
                        <button
                          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                          onClick={() => {
                            clearFeedback();
                            setSelectedItem(item);
                            setUpPrice(String(item.price ?? ""));
                            setEdit(true);
                          }}
                          type="button"
                        >
                          <CiEdit className="text-lg" />
                          Edit price
                        </button>

                        <button
                          className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                          disabled={deleteBusy}
                          onClick={() => deleteProduct(item.id)}
                          type="button"
                        >
                          <MdDeleteForever className="text-lg" />
                          {deleteBusy ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  </CardSpotlight>
                );
              })}
            </div>
          ) : null}
        </section>
      </main>

      {add ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/20 px-4 py-6 backdrop-blur-sm">
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              await addProduct();
            }}
          >
            <ModalShell
              actions={
                <>
                  <button
                    type="button"
                    onClick={closeAddModal}
                    className="rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={busyAction === "add"}
                    type="submit"
                  >
                    {busyAction === "add" ? "Adding..." : "Add product"}
                    <IoMdAdd />
                  </button>
                </>
              }
              description="Capture the item name and latest market price without leaving the dashboard."
              eyebrow="Product entry"
              title="Add a new product"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="product-name" className="text-sm font-medium text-slate-700">
                    Product name
                  </label>
                  <input
                    id="product-name"
                    type="text"
                    placeholder="eg. Gino tomatoes"
                    value={pro.name}
                    onChange={(event) =>
                      setPro((prev) => ({ ...prev, name: event.target.value }))
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[16px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="product-price" className="text-sm font-medium text-slate-700">
                    Product price
                  </label>
                  <input
                    id="product-price"
                    type="number"
                    placeholder="eg. 300"
                    value={pro.price}
                    onChange={(event) =>
                      setPro((prev) => ({ ...prev, price: event.target.value }))
                    }
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[16px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300"
                  />
                </div>
              </div>
            </ModalShell>
          </form>
        </div>
      ) : null}

      {edit ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/20 px-4 py-6 backdrop-blur-sm">
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              await updatePrice();
            }}
          >
            <ModalShell
              actions={
                <>
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={busyAction === `update-${selectedItem?.id}`}
                    type="submit"
                  >
                    {busyAction === `update-${selectedItem?.id}` ? "Updating..." : "Update price"}
                  </button>
                </>
              }
              description={
                selectedItem ? `Editing ${selectedItem.name}.` : "Update the latest price."
              }
              eyebrow="Price adjustment"
              title="Update product price"
            >
              <div className="space-y-2">
                <label htmlFor="updated-price" className="text-sm font-medium text-slate-700">
                  New price
                </label>
                <input
                  id="updated-price"
                  type="number"
                  value={upPrice}
                  onChange={(event) => setUpPrice(event.target.value)}
                  placeholder={selectedItem ? String(selectedItem.price ?? "") : "eg. 300"}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[16px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300"
                />
              </div>
            </ModalShell>
          </form>
        </div>
      ) : null}
    </div>
  );
};

export default Page;
