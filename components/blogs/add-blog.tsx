import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Spinner,
} from "@nextui-org/react";
import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import config from "@/config/config";
import apiClient from "@/helpers/axiosRequest";
import { toast } from 'react-hot-toast';
import UploadInput from "../inputs/UploadInput";

export const AddBlog = (props) => {
  const [loading, setLoading] = useState(false);
  const [featuredImage, setFeaturedImage] = useState(null);

  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );

  const [formData, setFormData] = useState({
    title: "",
    image: "",
    content: "",
    status: "DRAFT",
    description: "",
    read_time: "",
  });

  const [categories] = useState([
    { id: 1, name: "Development" },
    { id: 2, name: "Design" },
    { id: 3, name: "Marketing" },
    { id: 4, name: "Business" },
  ]);

  useEffect(() => {
    let editingBlog = props.data.filter(
      (obj) => obj.blog_id === props.edit
    )[0];

    if (editingBlog === undefined) editingBlog = {};

    setFormData((prevState) => ({ ...prevState, ...editingBlog }));
  }, [props.edit, props.data]);

  const handleFormChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target?.value,
    }));
  };

  const handleContentChange = (value) => {
    setFormData((prevState) => ({
      ...prevState,
      content: value,
    }));
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const response = await axios.post(
        config.BACKEND_URL + "/v1/users/upload-images", 
        formData, 
        { 
          headers: {
            "Content-Type": "multipart/form-data",
            "adminsecret": config.ADMIN_SECRET
          } 
        }
      );
      
      return response?.data?.url;
    } catch (err) {
      console.log("Upload Images Error:", err);
      toast.error("Failed to upload image");
      return null;
    }
  };

  const submitForm = async (closeModal) => {
    try {
      setLoading(true);
      let submitData = { ...formData };

      if (featuredImage != null) {
        let imageURL = await uploadImage(featuredImage);
        if (imageURL) {
          submitData.image = imageURL;
        }
      }

      // Generate slug if not present
      if (!submitData.slug) {
        submitData.slug = submitData.title
          .toLowerCase()
          .replace(/[^\w\s]/gi, '')
          .replace(/\s+/g, '-');
      }

      if (props.edit === "") {
        // Create new blog
        const response = await apiClient
          .post(
            config.BACKEND_URL + "/v1/blogs/", 
            submitData, 
            {
              headers: { adminsecret: config.ADMIN_SECRET },
            }
          )
          .catch((err) => {
            console.log(err);
            toast.error(err.response ? err.response?.data?.message : "Something Went Wrong!");
          });

        if (response !== undefined) {
          toast.success(typeof response === "object" && response?.data?.message);
        }
      } else {
        delete submitData.id
        delete submitData.blog_id
        delete submitData.created_at
        delete submitData.updated_at
        delete submitData.published_at
        delete submitData.views
        delete submitData.user_id
        delete submitData.author
        // Update existing blog
        const response = await apiClient
          .patch(
            config.BACKEND_URL + "/v1/blogs/" + props.edit,
            submitData,
            {
              headers: { adminsecret: config.ADMIN_SECRET },
            }
          )
          .catch((err) => {
            console.log(err);
            toast.error(err.response ? err.response?.data?.message : "Something Went Wrong!");
          });

        if (response !== undefined) {
          toast.success(typeof response === "object" && response?.data?.message);
        }
      }

      props.fetchData();
      closeModal();
    } catch (err) {
      console.log(err);
      toast.error("Error saving blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button onPress={props.onOpen} color="primary">
        Add Blog
      </Button>
      <Modal
        isOpen={props.isOpen}
        onOpenChange={props.onOpenChange}
        placement="top-center"
        size="3xl"
        onClose={() => {
          props.setEdit("");
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {props.edit !== "" ? "Edit Blog" : "Add Blog"}
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Title"
                    name="title"
                    onChange={handleFormChange}
                    placeholder="Enter Blog Title"
                    variant="bordered"
                    value={formData.title}
                  />
                   <Input
                    label="Description"
                    name="description"
                    onChange={handleFormChange}
                    placeholder="Enter Blog Description"
                    variant="bordered"
                    value={formData.description}
                  />
                   <Input
                    label="Read Time"
                    name="read_time"
                    onChange={handleFormChange}
                    placeholder="Enter Blog Read Time"
                    variant="bordered"
                    value={formData.read_time}
                    type="number"
                  />
                  
                  {/* <Input
                    label="Author"
                    name="author"
                    onChange={handleFormChange}
                    placeholder="Enter Author Name"
                    variant="bordered"
                    value={formData.author}
                  /> */}
                  
                  {/* <Select
                    label="Category"
                    name="category"
                    placeholder="Select Category"
                    onChange={handleFormChange}
                    selectedKeys={[formData.category]}
                    variant="bordered"
                  >
                    {categories.map((category) => (
                      <SelectItem key={category.name} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </Select> */}
                  
                  {/* <Input
                    label="Published Date"
                    name="published_date"
                    type="date"
                    onChange={handleFormChange}
                    variant="bordered"
                    value={formData.published_date}
                  /> */}
                  
                  <UploadInput
                    label="Featured Image"
                    value={formData.image}
                    setFileParent={setFeaturedImage}
                  />
                  
                  <Select
                    label="Status"
                    name="status"
                    placeholder="Select Status"
                    onChange={handleFormChange}
                    selectedKeys={[formData.status]}
                    variant="bordered"
                  >
                    <SelectItem key="draft">Draft</SelectItem>
                    <SelectItem key="published">Published</SelectItem>
                  </Select>
                </div>
                
                {/* <Input
                  label="Excerpt"
                  name="excerpt"
                  onChange={handleFormChange}
                  placeholder="Enter a short excerpt"
                  variant="bordered"
                  value={formData.excerpt}
                /> */}
                
                <div className="mt-4">
                  <label className="mb-2 block text-sm font-medium">
                    Content
                  </label>
                  <ReactQuill
                    theme="snow"
                    defaultValue={formData.content}
                    onChange={handleContentChange}
                    style={{ height: "200px", marginBottom: "50px" }}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="flat"
                  onClick={() => {
                    props.setEdit("");
                    onClose();
                  }}
                >
                  Close
                </Button>
                <Button
                  isDisabled={loading}
                  disabled={loading}
                  color="primary"
                  onPress={() => {
                    props.setEdit("");
                    submitForm(onClose);
                  }}
                >
                  {loading ? <Spinner color="white" /> : "Submit"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}; 