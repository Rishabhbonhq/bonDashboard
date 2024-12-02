import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Select,
  SelectSection,
  SelectItem,
  Spinner
} from "@nextui-org/react";
import React, { FormEvent, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import apiClient from "@/helpers/axiosRequest";
import config from "@/config/config";
import UploadInput from "../inputs/UploadInput";
import { toast } from 'react-hot-toast';

export const AddUser = (props: any) => {
  const [loading, setLoading] = useState(false)

  const [fileImage, setFileImage] = useState(null)
  const [fileBgImage, setFileBgImage] = useState(null)
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );

  

  const [formData, setFormData] = useState<any>({});
  const [products, setProducts] = useState([]);
  const [backgroundColor, setBackgroundColor] = useState("white");
  const [textColor, setTextColor] = useState("black");

  const uploadImage = async (file:any) => {
    const formData = new FormData()
    formData.append("file", file)
    
    let response = await axios.post(config.BACKEND_URL + "/v1/users/upload-images", formData, { headers:{"Content-Type": "multipart/form-data"} }).catch((err)=>{
      console.log("Upload Images", err)
    })
    return response?.data?.url
  }

  useEffect(()=>{
    console.log(props)
    let editingOffer = props.data.filter(
      (obj: any) => obj.id === props.edit
    )[0];

    if (editingOffer === undefined) editingOffer = {};
    else {
      delete editingOffer.product;
    }

    setFormData((prevState: any)=>({...prevState,...editingOffer}))
  },[props.edit])
  
  const handleDescriptionChange = (value: any) => {
    setFormData((prevState: any)=>({...prevState,"description": value}))
  };

  const handleFormChange = (e: any) => {
    setFormData((prevState: any)=>({...prevState, [e.target.name]: e.target?.value}))
  };


  const submitForm = async (closeModal:Function) => {
    try {
      setLoading(true)
      let submitForm = {...formData}

      if(fileImage!=null){
        let imageURL = await uploadImage(fileImage)
        submitForm["category_image"]=imageURL
      }

      if(fileBgImage!=null){
        let imageURL = await uploadImage(fileBgImage)
        submitForm["category_bg_image"]=imageURL
      }

      if(props.edit===""){
      const response = await apiClient
        .post(config.BACKEND_URL+"/v1/categories/", {...submitForm,status:"ACTIVE"}, {
          headers: { adminsecret: config.ADMIN_SECRET },
        })
        .catch((err) => {

          toast.error(err.response?err.response?.data?.message:"Something Went Wrong!")
        });

        if(response!=undefined){
          toast.success(typeof response==="object"&&response?.data?.message)
        }

        console.log(response);
      }else{
        const response = await apiClient
        .post(config.BACKEND_URL+"/v1/categories/update", {...submitForm}, {
          headers: { adminsecret: config.ADMIN_SECRET },
        })
        .catch((err) => {
          console.log(err)
          toast.error(err.response?err.response?.data?.message:"Something Went Wrong!")
        });

        if(response!=undefined){
          toast.success(typeof response==="object"&&response?.data?.message)
        }

        console.log(response);
      }

      props.fetchData()
      closeModal()
      setLoading(false)
      
    } catch (err) {
      console.log(err);
    }
  };

  console.log(formData)

  return (
    <div>
      <Button onPress={props.onOpen} color="primary">
        Add Category
      </Button>
      <Modal
        isOpen={props.isOpen}
        onOpenChange={props.onOpenChange}
        placement="top-center"
        onClose={() => {
          props.setEdit("");
          setFormData({})
          setFileBgImage(null)
          setFileImage(null)
        }}
      >
        <ModalContent style={{ height: "47%", overflowY: "auto" }}>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {props.edit !== "" ? "Edit Coupon" : "Add Coupon"}
              </ModalHeader>
              <ModalBody>
                
                <Input
                  label="Category Name"
                  name="category_name"
                  onChange={handleFormChange}
                  placeholder="Enter Category Name"
                  variant="bordered"
                  value={formData["category_name"]}
                />
                
                <UploadInput 
                  setFileParent={setFileImage}
                  label="Category Image URL"
                  value={formData["category_image"]}
                />

                <UploadInput 
                  setFileParent={setFileBgImage}
                  label="Category Bg Image URL"
                  value={formData["category_bg_image"]}
                />
               
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
                    // Add code to handle form submission here, including sending `description` as HTML content
                    // Replace with API call
                    
                    props.setEdit("");
                    submitForm(onClose);
                  }}
                >
                  {loading?<Spinner color="white" />:"Submit"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
