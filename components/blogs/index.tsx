"use client";
import { Button, Input, useDisclosure } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { TableWrapper } from "@/components/table/table";
import { AddBlog } from "./add-blog";
import axios from "axios";
import config from "@/config/config";
import apiClient from "@/helpers/axiosRequest";
import { useRouter } from "next/navigation";
import { toast } from 'react-hot-toast';

export const blogColumns = [
  { name: "TITLE", uid: "title", key: "title" },
  { name: "DESCRIPTION", uid: "description", key: "description" },
  { name: "FEATURED IMAGE", uid: "image", type: "image" },
  { name: "STATUS", uid: "status" },
  { name: "ACTIONS", uid: "actions" },
];

export const Blogs = () => {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [edit, setEdit] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const fetchData = async () => {
    try {
      const response = await apiClient.get(
        config.BACKEND_URL + "/v1/blogs", 
        {
          headers: { adminsecret: config.ADMIN_SECRET },
        }
      ).catch((err) => {
        if (err.status == 401) {
          router.push("/login");
        }
        console.error("Error fetching blogs:", err);
      });
      
      if (response?.data?.blogs) {
        let blogs = response.data.blogs?.map((blog:any, index:any) => ({id: "blogs_" + index,...blog}));
        setBlogs(blogs);
        setFilteredBlogs(blogs);
      }
      
      return response?.data;
    } catch (error) {
      console.error("Error fetching blogs:", error);
      throw error;
    }
  };

  const onEdit = (id:any) => {
    let blog:any = blogs.find((blog:any) => blog.id === id);
    setEdit(blog?.blog_id);
    onOpen();
  };

  const handleSearch = (event:any) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    
    const filtered = blogs.filter((blog:any) =>
      blog?.title?.toLowerCase().includes(query) || 
      blog?.author?.toLowerCase().includes(query) ||
      blog?.category?.toLowerCase().includes(query)
    );
    
    setFilteredBlogs(filtered);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onDelete = async (id:any) => {
    alert(id)
    const blog:any = blogs.find((blog:any) => blog.id === id);
    try {
      const response = await apiClient.delete(
        config.BACKEND_URL + "/v1/blogs/" + blog?.blog_id,
        {
          headers: { adminsecret: config.ADMIN_SECRET },
        }
      ).catch((err) => {
        console.log(err);
        toast.error(err.response ? err.response?.data?.message : "Something Went Wrong!");
      });

      if (response !== undefined) {
        toast.success(typeof response === "object" && response?.data?.message);
        fetchData();
      }
    } catch (err) {
      console.log(err);
      toast.error("Error deleting blog");
    }
  };

  const updateStatus = async (id:any, status:any) => {
    try {
      const response = await apiClient.post(
        config.BACKEND_URL + "/v1/blogs/updateStatus",
        { blog_id: id, status: status },
        {
          headers: { adminsecret: config.ADMIN_SECRET },
        }
      ).catch((err) => {
        console.log(err);
        toast.error(err.response ? err.response?.data?.message : "Something Went Wrong!");
      });

      if (response !== undefined) {
        toast.success(typeof response === "object" && response?.data?.message);
        fetchData();
      }
    } catch (err) {
      console.log(err);
      toast.error("Error updating blog status");
    }
  };

  return (
    <div className="my-10 px-4 lg:px-6 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <h3 className="text-xl font-semibold">All Blogs</h3>
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <Input
            classNames={{
              input: "w-full",
              mainWrapper: "w-full",
            }}
            placeholder="Search blogs"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className="flex flex-row gap-3.5 flex-wrap">
          <AddBlog

            setEdit={setEdit}
            isOpen={isOpen}
            onOpen={onOpen}
            onOpenChange={onOpenChange}
            data={blogs}
            edit={edit}
            fetchData={fetchData}
          />
        </div>
      </div>
      <div className="max-w-[95rem] mx-auto w-full">
        <TableWrapper 
          updateStatus={updateStatus} 
          columns={blogColumns} 
          data={filteredBlogs} 
          onEdit={onEdit} 
          onDelete={onDelete} 
          showDelete={false}
        />
      </div>
    </div>
  );
};