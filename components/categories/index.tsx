"use client";
import { Button, Input, useDisclosure } from "@nextui-org/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { TableWrapper } from "@/components/table/table";
import { AddUser } from "./add-category";
import axios from "axios";
import config from "../../config/config"
import apiClient from "@/helpers/axiosRequest";
import { useRouter } from "next/navigation";

export const offerColumns = [
  { name: "CATEGORY ID", uid: "category_id" },
  { name: "CATEGORY NAME", uid: "category_name" },
  { name: "CATEGORY IMAGE", uid: "category_image" },
  { name: "CATEGORY BG IMAGE", uid: "category_bg_image" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

export const Categories = () => {
  const router = useRouter()
  const [offers, setOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]); // For filtered data
  const [searchQuery, setSearchQuery] = useState(""); // Search query
  const [edit, setEdit] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const fetchData = async () => {
    try {
      const response = await apiClient.get(config.BACKEND_URL+"/v1/categories/all", {headers:{adminsecret:"12345"}}).catch((err)=>{
        if(err.status==401){
          router.push("/admin/login")
        }
      });
      console.log(response);
      setOffers(response?.data?.data);
      setFilteredOffers(response?.data?.data); // Initialize filteredOffers
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
      offer?.category_name?.toLowerCase()
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
    await axios.post(config.BACKEND_URL+"/v1/categories/updateStatus",{category_id: id, status: status}).catch(err=>{
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
            placeholder="Search categories"
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
        <TableWrapper columns={offerColumns} data={filteredOffers} onEdit={onEdit} onDelete={onDelete} updateStatus={updateStatus}/>
      </div>
    </div>
  );
};
