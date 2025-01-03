import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  TablePagination,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const DataTable = ({ data, columns }) => {
  const [orderBy, setOrderBy] = useState(null);
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#F3F6F9",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  useEffect(() => {
    // ถ้ามีการเปลี่ยนข้อมูล ให้ setpage กลับไปที่หน้าแรก
    setPage(0);
  }, [data]);
  const handleSort = (columnId) => {
    console.log("columnId", columnId);
    const isAsc = orderBy === columnId && order === "asc";
    setOrderBy(columnId);
    setOrder(isAsc ? "desc" : "asc");
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortedData = data.sort((a, b) => {
    if (orderBy === null) return 0;

    const aValue = a[orderBy];
    const bValue = b[orderBy];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return order === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    // Handle numeric sorting
    return order === "asc" ? aValue - bValue : bValue - aValue;
  });

  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div>
      <TableContainer
        component={Paper}
        style={{ border: "none", boxShadow: "none" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <StyledTableCell key={column.id} align={column.align} width={column.width}>
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={orderBy === column.id ? order : "asc"}
                    onClick={() => handleSort(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  style={{ textAlign: "center" }}
                >
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, index) => {
                return (
                  <TableRow key={index}>
                    {columns.map((column) => {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.render(row)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Show:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} of ${count}`
        }
      />
    </div>
  );
};

export default DataTable;
