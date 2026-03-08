"use client";
import React, { useEffect, useState } from "react";
import Header from "./component/header";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";

const Page = () => {
  const [data, setData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const[add,setAdd] = useState(false)
  const[pro,setPro] = useState({
    name:"",
    price:""
  })
  const[upPrice,setUpPrice] = useState("")
  const [edit ,setEdit] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    async function getProduct() {
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
      }
    }

    getProduct();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput.trim());
  };

  const filteredData = (Array.isArray(data) ? data : []).filter((item) => {
    if (!searchQuery) return true;

    const name = item?.name?.toLowerCase() || "";
    const price = String(item?.price ?? "");
    const query = searchQuery.toLowerCase();

    return name.includes(query) || price.includes(query);
  });


  async function addProduct(){
    try {
      const res = await axios.post("/api/addProduct",{
        name:pro.name,
        price:Number(pro.price)
      })
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }

  async function deletePro(id){
    try {
      const res = await axios.delete(`/api/deleteProduct/${id}`)
      console.log(res)
      window.location.reload()
    } catch (error) {
      console.log(error)
    }
  }

  async function update(id) {
    try {
      await axios.patch(`/api/updateProduct/${id}`, {
        price: Number(upPrice),
      });
    } catch (error) {
      console.log(error);
    }
  }



  return (
    <div className="w-full min-h-dvh flex flex-col bg-slate-100">
      <Header add={add} setAdd={setAdd} />

      <main className="w-full flex-1 flex flex-col gap-6 md:gap-8 items-center justify-start px-4 pt-4 pb-8 sm:px-6 md:px-8">
        <h1 className="text-center text-2xl sm:text-3xl md:text-4xl font-serif capitalize font-semibold text-slate-900 px-2">
          anndorch shopping price
        </h1>

        <form
          onSubmit={handleSearchSubmit}
          className="w-full max-w-4xl border flex items-center rounded-lg border-2 overflow-hidden border-gray-300 bg-white"
        >
          <input
            type="text"
            placeholder="search for item"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1 outline-none p-3 sm:p-4 text-sm sm:text-base"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white text-lg sm:text-xl p-3 sm:p-4 md:p-5 shrink-0"
          >
            <FaSearch />
          </button>
        </form>

        <div className="w-full max-w-4xl flex flex-col gap-2 sm:gap-3 p-3 sm:p-5 min-h-[280px] sm:min-h-[400px] rounded-xl shadow-lg bg-blue-500">
          {filteredData.length === 0 && (
            <p className="text-white text-center font-medium pt-6">
              No products found.
            </p>
          )}

          {filteredData.map((item, i) => {
            return (
              <div
                key={item.id || i}
                className="flex justify-between  gap-3 rounded-lg bg-white/10 p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex flex-wrap gap-x-6 gap-y-1 *:text-base sm:*:text-lg *:font-serif *:capitalize *:text-white *:tracking-wide">
                  <p>{item.name}</p>
                  <p>{`#${item.price}`}</p>
                </div>
                <div className="flex gap-2 sm:gap-3 *:border-2 sm:*:border-4 *:rounded-full *:p-2 *:border-white *:text-white *:text-lg sm:*:text-xl *:font-bold *:cursor-pointer *:active:scale-120 *:duration-300">
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setUpPrice(String(item.price ?? ""));
                      setEdit(true);
                    }}
                  >
                    <CiEdit />
                  </button>
                  <button onClick={() => deletePro(item.id)}>
                    <MdDeleteForever />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {add && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4 py-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addProduct();
              window.location.reload();
            }}
            className="w-full max-w-md bg-white flex flex-col gap-4 items-center p-4 sm:p-5 rounded-lg"
          >
            <h1 className="capitalize text-sm sm:text-base">add a new product</h1>

            <div className="w-full flex flex-col relative">
              <label
                htmlFor="name"
                className="bg-white absolute left-4 top-[-12px] capitalize font-bold font-serif text-sm"
              >
                p.name
              </label>
              <input
                type="text"
                placeholder="eg.gino"
                value={pro.name}
                onChange={(e) =>
                  setPro((prev) => ({ ...prev, name: e.target.value }))
                }
                className="border-2 border-blue-500 p-3 outline-none rounded-md"
              />
            </div>

            <div className="w-full mt-2 sm:mt-3 flex flex-col relative">
              <label
                htmlFor="name"
                className="bg-white absolute left-4 top-[-12px] capitalize font-bold font-serif text-sm"
              >
                p.price
              </label>
              <input
                type="number"
                placeholder="eg.#300"
                value={pro.price}
                onChange={(e) =>
                  setPro((prev) => ({ ...prev, price: e.target.value }))
                }
                className="border-2 border-blue-500 p-3 outline-none rounded-md"
              />
            </div>

            <div className="w-full flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3 mt-2">
              <button
                type="button"
                onClick={() => setAdd(false)}
                className="border border-gray-300 text-gray-700 capitalize px-6 py-2 rounded-lg cursor-pointer"
              >
                cancel
              </button>
              <button className="flex gap-2 items-center justify-center bg-black text-white capitalize px-8 py-2 rounded-lg cursor-pointer active:scale-110 duration-300">
                add
                <IoMdAdd />
              </button>
            </div>
          </form>
        </div>
      )}

      {edit && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4 py-6">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!selectedItem?.id) return;
              await update(selectedItem.id);
              window.location.reload();
            }}
            className="w-full max-w-md bg-white flex flex-col gap-4 items-center p-4 sm:p-5 rounded-lg"
          >
            <h1 className="capitalize text-sm sm:text-base">update item</h1>
            <div className="w-full flex flex-col relative">
              <label
                htmlFor="name"
                className="bg-white absolute left-4 top-[-12px] capitalize font-bold font-serif text-sm"
              >
                p.price
              </label>
              <input
                type="number"
                value={upPrice}
                onChange={(e) => setUpPrice(e.target.value)}
                placeholder={selectedItem ? String(selectedItem.price ?? "") : "eg.#300"}
                className="border-2 border-blue-500 p-3 outline-none rounded-md"
              />
            </div>

            <div className="w-full flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3 mt-2">
              <button
                type="button"
                onClick={() => setEdit(false)}
                className="border border-gray-300 text-gray-700 capitalize px-6 py-2 rounded-lg cursor-pointer"
              >
                cancel
              </button>
              <button className="flex gap-2 items-center justify-center bg-black text-white capitalize px-8 py-2 rounded-lg cursor-pointer active:scale-110 duration-300">
                update
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Page;
