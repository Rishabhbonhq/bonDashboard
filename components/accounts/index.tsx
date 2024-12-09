"use client";
import { Button, Input, useDisclosure } from "@nextui-org/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { TableWrapper } from "@/components/table/table";
import { AddUser } from "./add-user";
import axios from "axios";
import config from "@/config/config";
import apiClient from "@/helpers/axiosRequest";
import { useRouter } from "next/navigation";

export const offerColumns = [
  { name: "PRODUCT NAME", uid: "product_name" },
  { name: "OFFER NAME", uid: "offer_name" },
  { name: "OFFER PRICE (USD)", uid: "offer_price" },
  { name: "OFFER TYPE", uid: "offer_type" },
  { name: "OFFER START DATE", uid: "offer_start_at", isDate: true },
  { name: "OFFER START DATE", uid: "offer_end_at", isDate: true },
  { name: "IMAGE", uid: "image" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

export const Accounts = () => {
  const router = useRouter()
  const [offers, setOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]); // For filtered data
  const [searchQuery, setSearchQuery] = useState(""); // Search query
  const [edit, setEdit] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const fetchOffers = async () => {
    try {
      const response = await apiClient.get(config.BACKEND_URL+"/v1/offers/all", {}).catch((err)=>{
        if(err.status == 401){
          router.push("/login")
         }
      });
      console.log(response?.data);
      setOffers(response?.data.data);
      setFilteredOffers(response?.data.data); // Initialize filteredOffers
      return response?.data;
    } catch (error) {
      console.error("Error fetching offers:", error);
      throw error;
    }
  };

  const onEdit = (id: any) => {
    setEdit(id);
    onOpen();
  };

  // Handle search functionality
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    console.log(offers)
    const filtered = offers.filter((offer: any) =>
      offer?.offer_name?.toLowerCase()
        .includes(query) || offer?.product_name?.toLowerCase()
        .includes(query)
    );
    
    setFilteredOffers(filtered);
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const onDelete = async (id:any) => {
    console.log("deleting", id)
    await axios.post(config.BACKEND_URL+"/v1/offers/delete",{offer_id: id}).catch(err=>{
      console.log(err)
    })
    fetchOffers()
  }

  const updateStatus = async (id:any, status:any) => {
    await axios.post(config.BACKEND_URL+"/v1/offers/updateStatus",{offer_id: id, status: status}).catch(err=>{
      console.log(err)
    })
    fetchOffers()
  }

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <h3 className="text-xl font-semibold">All Offers</h3>
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <Input
            classNames={{
              input: "w-full",
              mainWrapper: "w-full",
            }}
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearch} // Bind to search handler
          />
        </div>
        <div className="flex flex-row gap-3.5 flex-wrap">
          <AddUser
            setEdit={setEdit}
            isOpen={isOpen}
            onOpen={onOpen}
            onOpenChange={onOpenChange}
            data={offers}
            edit={edit}
            fetchData={fetchOffers}
          />
        </div>
      </div>
      <div className="max-w-[95rem] mx-auto w-full">
        <TableWrapper showDelete={false} columns={offerColumns} data={filteredOffers} onEdit={onEdit} onDelete={onDelete} updateStatus={updateStatus}/>
      </div>
    </div>
  );
};
