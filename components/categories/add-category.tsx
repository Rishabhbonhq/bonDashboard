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
} from "@nextui-org/react";
import React, { FormEvent, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import axios from "axios";

export const AddUser = (props: any) => {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );

  

  const [formData, setFormData] = useState<any>({});
  const [products, setProducts] = useState([]);
  const [backgroundColor, setBackgroundColor] = useState("white");
  const [textColor, setTextColor] = useState("black");

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

  const getProducts = async () => {
    try {
      const response = await axios
        .get("http://localhost:5000/v1/product/", {
          headers: { adminsecret: "12345" },
        })
        .catch((err) => console.log(err));
      
      setProducts(response?.data.data);
    } catch (err) {
      console.log(err);
    }
  };



  const submitForm = async () => {
    try {
      if(props.edit===""){
      const response = await axios
        .post("http://localhost:5000/v1/categories/", {...formData,status:"ACTIVE"}, {
          headers: { adminsecret: "12345" },
        })
        .catch((err) => console.log(err));

        console.log(response);
      }else{
        const response = await axios
        .post("http://localhost:5000/v1/categories/update", {...formData}, {
          headers: { adminsecret: "12345" },
        })
        .catch((err) => console.log(err));

        console.log(response);
      }

      props.fetchData()
      
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
                
                <Input
                  name="category_image"
                  onChange={handleFormChange}
                  label="Category Image URL"
                  variant="bordered"
                  value={formData["category_image"]}
                />

                <Input
                  name="category_bg_image"
                  onChange={handleFormChange}
                  label="Category Bg Image URL"
                  variant="bordered"
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
                  color="primary"
                  onPress={() => {
                    // Add code to handle form submission here, including sending `description` as HTML content
                    // Replace with API call
                    onClose();
                    props.setEdit("");
                    submitForm();
                  }}
                >
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
