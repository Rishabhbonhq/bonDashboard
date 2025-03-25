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
import React, { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import config from "@/config/config";
import apiClient from "@/helpers/axiosRequest";
import { toast } from 'react-hot-toast';
import UploadInput from "../inputs/UploadInput";
import { Editor } from '@tinymce/tinymce-react';

export const AddBlog = (props) => {
  const editorRef = useRef(null);
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
    description: ""
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
    console.log(value)
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
      submitData.content = editorRef.current.getContent();

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
          closeModal();
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
          closeModal();
          toast.success(typeof response === "object" && response?.data?.message);
        }
      }

      props.fetchData();
      
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 
                   {/* <Input
                    label="Read Time"
                    name="read_time"
                    onChange={handleFormChange}
                    placeholder="Enter Blog Read Time"
                    variant="bordered"
                    value={formData.read_time}
                    type="number"
                  /> */}
                  
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
                  <Editor
                  onInit={(evt, editor) => editorRef.current = editor}
                  apiKey='8j7wiv7q5l0b5pku7vldwja4uqqok48yoq6pl9nlq63x1koz'
                  ref={editorRef}
        initialValue={formData.content}
        init={{
          height: 300,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount'
          ],
          toolbar: 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
        }}
        
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