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
  Spinner,
} from "@nextui-org/react";
import React, { FormEvent, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import config from "@/config/config";
import apiClient from "@/helpers/axiosRequest";
import UploadInput from "@/components/inputs/UploadInput"
import { toast } from 'react-hot-toast';
import {
  Autocomplete,
  AutocompleteSection,
  AutocompleteItem
  } from "@nextui-org/autocomplete";

export const AddUser = (props: any) => {
  const [loading, setLoading] = useState(false)
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );

  
  const [file, setFile] = useState<any>(null)
  const [formData, setFormData] = useState<any>({});
  const [products, setProducts] = useState([]);
  const [backgroundColor, setBackgroundColor] = useState("white");
  const [textColor, setTextColor] = useState("black");

  useEffect(()=>{
    console.log(props)
    let editingOffer = props.data.filter(
      (obj: any) => obj.offer_id === props.edit
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
    console.log(e)
    setFormData((prevState: any)=>({...prevState, [e.target.name]: e.target?.value}))
  };

  const getProducts = async () => {
    try {
      const response = await apiClient
        .get(config.BACKEND_URL+"/v1/product/", {
          headers: { adminsecret: config.ADMIN_SECRET },
        })
        .catch((err) => console.log(err));
      
      setProducts(response?.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const uploadImage = async () => {
    const formData = new FormData()
    formData.append("file", file)
    
    let response = await axios.post(config.BACKEND_URL + "/v1/users/upload-images", formData, { headers:{"Content-Type": "multipart/form-data"} }).catch((err)=>{
      console.log("Upload Images", err)
    })
    return response?.data?.url
  }

  const submitForm = async (closeModal:Function) => {
    try {
      setLoading(true)
      let submitBody = {...formData}
      if(file!==null){
        let url = await uploadImage()
        setFormData((prevState:any)=>{
          return {
            ...prevState,
            image: url
          }
        })
        submitBody["image"] = url
      }
      if(props.edit===""){
      const response = await axios
        .post(config.BACKEND_URL+"/v1/offers/create", {offer: submitBody}, {
          headers: { adminsecret: config.ADMIN_SECRET },
        })
        .catch((err) => toast.error(err.response?err.response?.data?.message:"Something Went Wrong!"));

        console.log(response);

        if(response!=undefined){
          toast.success(typeof response==="object"&&response?.data?.message)
        }
      }else{
        const response = await axios
        .post(config.BACKEND_URL+"/v1/offers/update", {offer: submitBody}, {
          headers: { adminsecret: config.ADMIN_SECRET },
        })
        .catch((err) =>  toast.error(err.response?err.response?.data?.message:"Something Went Wrong!"));

        console.log(response);

        if(response!=undefined){
          toast.success(typeof response==="object"&&response?.data?.message)
        }
      }
      props.fetchData()
      closeModal()
      setLoading(false)
      
    } catch (err) {
      console.log(err);
    }
  };

  const onSelectionChange = (key: any) => {
    setFormData((prevState: any)=>({...prevState, ["product_id"]:key}))
  }

  console.log(formData)

  return (
    <div>
      <Button onPress={props.onOpen} color="primary">
        Add Offer
      </Button>
      <Modal
        isOpen={props.isOpen}
        onOpenChange={props.onOpenChange}
        placement="top-center"
        size={"3xl"}
        onClose={() => {
          props.setEdit("");
          setFormData({})
          setFile(null)
        }}
      >
        <ModalContent style={{ height: "70%", overflowY: "auto" }}>
          {(onClose) => (
            <div>
              <ModalHeader className="flex flex-col gap-1">
                {props.edit !== "" ? "Edit Offer" : "Add Offer"}
              </ModalHeader>
              <ModalBody >
                <div className="grid grid-cols-2 gap-2">
                
                <Autocomplete
                  label="Product"
                  placeholder="Select Product"
                  name="product_id"
                  variant="bordered"
                  defaultItems={products}
                  selectedKey={formData["product_id"]?.toString()}
                  onSelectionChange={onSelectionChange}
                >
                  {(product:any) => <AutocompleteItem key={product?.product_id}>{product?.product_name}</AutocompleteItem>}
                </Autocomplete>
                <Input
                  label="Offer Name"
                  name="offer_name"
                  onChange={handleFormChange}
                  placeholder="Enter Offer Name"
                  variant="bordered"
                  value={formData["offer_name"]}
                />
                <Input
                  name="offer_price"
                  onChange={handleFormChange}
                  label="Offer Price  (USD)"
                  placeholder="Enter Offer Price"
                  type="number"
                  value={formData["offer_price"]}
                  variant="bordered"
                />
                <Input
                  name="heading"
                  onChange={handleFormChange}
                  label="Heading"
                  placeholder="Enter Heading"
                  value={formData["heading"]}
                  variant="bordered"
                />
                <Input
                  name="offer_start_at"
                  onChange={handleFormChange}
                  label="Offer Start Date"
                  placeholder="placeholder"
                  type="date"
                  value={formData["offer_start_at"]?.split("T")[0]}
                  variant="bordered"
                />
                <Input
                  name="offer_end_at"
                  onChange={handleFormChange}
                  label="Offer End Date"
                  placeholder="placeholder"
                  type="date"
                  value={formData["offer_end_at"]?.split("T")[0]}
                  variant="bordered"
                />
                {/* <Input
                  name="image"
                  onChange={handleFormChange}
                  label="Image URL"
                  variant="bordered"
                  value={formData["image"]}
                /> */}
                <UploadInput
                  setFileParent={setFile}
                  label="Upload Image"
                  value={formData["image"]}
                />

                <Select
                  label="Offer Type"
                  name="offer_type"
                  placeholder="Select Offer Type"
                  onChange={handleFormChange}
                  selectedKeys={[formData["offer_type"]]}
                  variant="bordered"
                >
                  <SelectItem key="SIGNUP_OFFER">SIGNUP_OFFER</SelectItem>
                  <SelectItem key="OFFER">OFFER</SelectItem>
                  <SelectItem key="BON_EXPERIENCE">BON_EXPERIENCE</SelectItem>
                </Select>

                <Select
                  label="Background Color"
                  placeholder="Select color"
                  selectedKeys={[formData["bg_color"]]}
                  onChange={handleFormChange}
                  name="bg_color"
                  variant="bordered"
                >
                  <SelectItem key="WHITE">White</SelectItem>
                  <SelectItem key="BLACK">Black</SelectItem>
                </Select>

                <Select
                  label="Text Color"
                  placeholder="Select color"
                  selectedKeys={[formData["txt_color"]]}
                  name="txt_color"
                  onChange={handleFormChange}
                  variant="bordered"
                >
                  <SelectItem key="WHITE">White</SelectItem>
                  <SelectItem key="BLACK">Black</SelectItem>
                </Select>
                </div>

                <div className="mt-4">
                  <label className="mb-2 block text-sm font-medium ">
                    Description
                  </label>
                  <ReactQuill
                    
                    theme="snow"
                    value={formData["description"]}
                    onChange={handleDescriptionChange}
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
                    // Add code to handle form submission here, including sending `description` as HTML content
                    // Replace with API call
        
                    props.setEdit("");
                    submitForm(onClose);
                  }}
                >
                  {loading?<Spinner color="white"/>:"Submit"}
                </Button>
              </ModalFooter>
            </div>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
