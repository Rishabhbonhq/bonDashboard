import { User, Tooltip, Chip } from "@nextui-org/react";
import React from "react";
import { DeleteIcon } from "../icons/table/delete-icon";
import { EditIcon } from "../icons/table/edit-icon";
import { EyeIcon } from "../icons/table/eye-icon";
import { users } from "./data";

interface Props {
  dataItem: any;
  columnKey: string | React.Key;
  onEdit: any;
  onView: any;
  onDelete: Function;
  showDelete: boolean;
  updateStatus: Function;
  isDate: boolean;
}

export const RenderCell = ({ dataItem, columnKey, onEdit, onDelete, showDelete, updateStatus, isDate }: Props) => {
  // @ts-ignore
  console.log(onDelete)
  const cellValue = dataItem[columnKey];
  let isUrl = false;
  if( typeof cellValue === 'string' && cellValue?.startsWith("http")){
    isUrl = true;
  }
 
  switch (columnKey) {
    case "name":
      return (
        <User
          avatarProps={{
            src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
          }}
          name={cellValue}
        >
          {dataItem.email}
        </User>
      );
    case "role":
      return (
        <div>
          <div>
            <span>{cellValue}</span>
          </div>
          <div>
            <span>{dataItem.team}</span>
          </div>
        </div>
      );
    case "status":
      return (
        <Chip
        
          className="cursor-pointer"
          size="sm"
          variant="flat"
          onClick={()=>updateStatus(dataItem.id, cellValue?.toLowerCase() === "active"?"DISABLED":"ACTIVE")}
          color={
            cellValue?.toLowerCase() === "active"
              ? "success"
              : cellValue === "paused"
              ? "danger"
              : "warning"
          }
        >
          <span className="capitalize text-xs">{cellValue}</span>
        </Chip>
      );
    case "actions":
      return (
        <div className="flex items-center gap-4 ">
          {/* <div>
            <Tooltip content="Details">
              <button onClick={() => console.log("View user", dataItem.id)}>
                <EyeIcon size={20} fill="#979797" />
              </button>
            </Tooltip>
          </div> */}
          <div>
            <Tooltip content="Edit user" color="secondary">
              <button onClick={() => onEdit(dataItem.id)}>
                <EditIcon size={20} fill="#979797" />
              </button>
            </Tooltip>
          </div>
          {showDelete!==false?<div>
            <Tooltip
              content="Delete user"
              color="danger"
             
            >
              <button  onClick={() => {
                onDelete(dataItem.offer_id)
              }}>
                <DeleteIcon size={20} fill="#FF0080" />
              </button>
            </Tooltip>
          </div>:<></>}
        </div>
      );
    default:
      if(isUrl){
        return (<div>
          <Tooltip content="View">
            <button onClick={() => window.open(cellValue)}>
              <EyeIcon size={20} fill="#979797" />
            </button>
          </Tooltip>
        </div>)
      }
      if(isDate){
        try{
          let date = new Date(cellValue)
          return new Intl.DateTimeFormat('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        }).format(date);
        }catch(err){
          return ""
        }
        
      }
      return cellValue;
  }
};
