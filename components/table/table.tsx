import {
  Link,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Pagination,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { RenderCell } from "./render-cell";
import axios from "axios";
import { columns as staticColumns, users as staticData } from "./data";

export const TableWrapper = (props: any) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const data = props.data || staticData;
  const columns = props.columns || staticColumns;

  // Calculate paginated data
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  
  return (
    <div className="w-full flex flex-col gap-4">
      <Table aria-label="Example table with custom cells">
        <TableHeader columns={columns}>
          {(column: any) => (
            <TableColumn
              key={column?.uid || "123"}
              hideHeader={column.uid === "actions"}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={paginatedData}>
          {(item) => (
            <TableRow>
              {(columnKey) => (
                <TableCell>
                  {RenderCell({
                    dataItem: item,
                    columnKey: columnKey,
                    onEdit: props.onEdit,
                    onView: props.onView,
                    onDelete:  props.onDelete,
                    showDelete: props.showDelete,
                    updateStatus: props.updateStatus,

                  })}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      
      {/* Pagination component */}
      <Pagination
        total={totalPages}
        initialPage={currentPage}
        onChange={handlePageChange}
        className="self-center"
        showControls
      />
    </div>
  );
};
