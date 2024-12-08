"use client";
import { Button, Input, useDisclosure } from "@nextui-org/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { TableWrapper } from "@/components/table/table";
import { AddUser } from "./add-deals";
import axios from "axios";
import config from "../../config/config"
import apiClient from "@/helpers/axiosRequest";
import { useRouter } from "next/navigation";

export const offerColumns = [
  { name: "DEAL NAME", uid: "deal_name" },
  { name: "DEAL BRAND", uid: "deal_brand" },
  { name: "CATEGORY NAME", uid: "category.category_name" },
  { name: "DEAL IMAGE", uid: "deal_image", type:"image" },
  { name: "DEAL POINTS ", uid: "deal_points" },
  { name: "DEAL LINK", uid: "deal_link" },
  { name: "PRODUCT PRICE ($)", uid: "product_price" },
  { name: "DEAL PRICE ($) ", uid: "deal_price" },
  { name: "DISCOUNT (%)", uid: "discount" },
  { name: "COUPON", uid: "coupon" },
  { name: "SATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

export const Deals = () => {
  const router = useRouter()
  const [offers, setOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]); // For filtered data
  const [searchQuery, setSearchQuery] = useState(""); // Search query
  const [edit, setEdit] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const fetchData = async () => {
    try {
      
      const response = await apiClient.get(config.BACKEND_URL+"/v1/deals/all", {headers:{adminsecret: config.ADMIN_SECRET}}).catch((err)=>{
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
      offer?.deal_name?.toLowerCase()
        .includes(query)
    );
    setFilteredOffers(filtered);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onDelete = async (id:any) => {
    console.log("deleting", id)
    await axios.post(config.BACKEND_URL+"/v1/offers/delete",{category_id: id}).catch(err=>{
      console.log(err)
    })
    fetchData()
  }

  const updateStatus = async (id:any, status:any) => {
    await axios.post(config.BACKEND_URL+"/v1/deals/updateStatus",{deal_id: id, status: status}).catch(err=>{
      console.log(err)
    })
    fetchData()
  }

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <h3 className="text-xl font-semibold">All Categories</h3>
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <Input
            classNames={{
              input: "w-full",
              mainWrapper: "w-full",
            }}
            placeholder="Search deals"
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
            fetchData={fetchData}
          />
        </div>
      </div>
      <div className="max-w-[95rem] mx-auto w-full">
        <TableWrapper updateStatus={updateStatus} columns={offerColumns} data={filteredOffers} onEdit={onEdit} onDelete={onDelete} showDelete={false}/>
      </div>
    </div>
  );
};
