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
} from "@nextui-org/react";
import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import config from "../../config/config"
import apiClient from "@/helpers/axiosRequest";

export const AddUser = (props: any) => {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );

  const [formData, setFormData] = useState<any>({
    deal_name: "",
    deal_brand: "",
    deal_image: "",
    deal_points: "",
    deal_link: "",
    product_price: "",
    deal_price: "",
    discount: "",
    status: "ACTIVE",
    coupon: "",
    category_id: "",
  });

  const [categories, setCategories] = useState([]);

  const getCategories = async () => {
    try {
      const response = await apiClient
        .get(config.BACKEND_URL+"/v1/categories/all", {
          headers: { adminsecret: config.ADMIN_SECRET },
        })
        .catch((err) => console.log(err));
      
      setCategories(response?.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    console.log(config);
    let editingOffer = props.data.filter(
      (obj: any) => obj.id === props.edit
    )[0];

    if (editingOffer === undefined) editingOffer = {};

    setFormData((prevState: any) => ({ ...prevState, ...editingOffer }));
  }, [props.edit]);

  const handleFormChange = (e: any) => {
    setFormData((prevState: any) => ({
      ...prevState,
      [e.target.name]: e.target?.value,
    }));
  };

  const submitForm = async () => {
    try {
      if (props.edit === "") {
        const response = await axios
          .post(
            config.BACKEND_URL+"/v1/deals/",
            { ...formData, status: "ACTIVE" },
            {
              headers: { adminsecret: config.ADMIN_SECRET },
            }
          )
          .catch((err) => console.log(err));

        console.log(response);
      } else {
        const response = await axios
          .post(
            config.BACKEND_URL+"/v1/deals/update",
            { ...formData },
            {
              headers: { adminsecret: config.ADMIN_SECRET },
            }
          )
          .catch((err) => console.log(err));

        console.log(response);
      }
      props.fetchData()
    } catch (err) {
      console.log(err);
    }
  };

  console.log(formData);

  return (
    <div>
      <Button onPress={props.onOpen} color="primary">
        Add Deal
      </Button>
      <Modal
        isOpen={props.isOpen}
        onOpenChange={props.onOpenChange}
        placement="top-center"
        onClose={() => {
          props.setEdit("");
          setFormData({});
        }}
      >
        <ModalContent style={{ height: "60%", overflowY: "auto" }}>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {props.edit !== "" ? "Edit Deal" : "Add Deal"}
              </ModalHeader>
              <ModalBody>
                <Input
                  label="Deal Name"
                  name="deal_name"
                  onChange={handleFormChange}
                  placeholder="Enter Deal Name"
                  variant="bordered"
                  value={formData.deal_name}
                />
                <Input
                  label="Brand"
                  name="deal_brand"
                  onChange={handleFormChange}
                  placeholder="Enter Brand"
                  variant="bordered"
                  value={formData.deal_brand}
                />
                <Input
                  label="Image URL"
                  name="deal_image"
                  onChange={handleFormChange}
                  placeholder="Enter Image URL"
                  variant="bordered"
                  value={formData.deal_image}
                />
                <Input
                  label="Points"
                  name="deal_points"
                  type="number"
                  onChange={handleFormChange}
                  placeholder="Enter Points"
                  variant="bordered"
                  value={formData.deal_points}
                />
                <Input
                  label="Deal Link"
                  name="deal_link"
                  onChange={handleFormChange}
                  placeholder="Enter Deal Link"
                  variant="bordered"
                  value={formData.deal_link}
                />
                <Input
                  label="Product Price"
                  name="product_price"
                  type="number"
                  onChange={handleFormChange}
                  placeholder="Enter Product Price"
                  variant="bordered"
                  value={formData.product_price}
                />
                <Input
                  label="Deal Price"
                  name="deal_price"
                  type="number"
                  onChange={handleFormChange}
                  placeholder="Enter Deal Price"
                  variant="bordered"
                  value={formData.deal_price}
                />
                <Input
                  label="Discount"
                  name="discount"
                  type="number"
                  onChange={handleFormChange}
                  placeholder="Enter Discount"
                  variant="bordered"
                  value={formData.discount}
                />
                <Input
                  label="Coupon"
                  name="coupon"
                  onChange={handleFormChange}
                  placeholder="Enter Coupon Code"
                  variant="bordered"
                  value={formData.coupon}
                />

              <Select
                label="Category"
                name="category_id"
                placeholder="Select Category"
                onChange={handleFormChange}
                selectedKeys={[formData["category_id"]?.toString()]}
                variant="bordered"
              >
                {categories.map((obj: any) => (
                  <SelectItem key={obj.id}>
                    {obj.category_name}
                  </SelectItem>
                ))}
              </Select>
                
                {/* <Input
                  label="Category ID"
                  name="category_id"
                  type="number"
                  onChange={handleFormChange}
                  placeholder="Enter Category ID"
                  variant="bordered"
                  value={formData.category_id}
                /> */}
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
