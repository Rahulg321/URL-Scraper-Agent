"use client";

import "react-data-grid/lib/styles.css";
import { DataGrid } from "react-data-grid";
import { sampleListings } from "@/lib/samples/listings";
import * as XLSX from "xlsx";
import { CSVLink } from "react-csv";
import { Button } from "./ui/button";

function transformToDataGrid(data: any[]) {
  if (!Array.isArray(data) || data.length === 0) {
    return { columns: [], rows: [] };
  }
  const sampleItem = data[0];
  const keys = Object.keys(sampleItem);

  const columns = keys.map((key) => ({
    key,
    name: key,
  }));

  const rows = data.map((item, index) => ({
    id: index,
    ...item,
  }));

  return { columns, rows };
}

function exportToXlsx(rows: any[], columns: any[], fileName = "data.xlsx") {
  const headerKeys = columns.map((c) => c.key);
  const headerRow = columns.map((c) => c.name);

  const dataRows = rows.map((row) => {
    return headerKeys.map((key) => row[key] ?? "");
  });

  const sheetData = [headerRow, ...dataRows];

  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  XLSX.writeFile(workbook, fileName);
}

const ChatSheetEditor = ({ data }: any) => {
  // Convert your listings array into columns + rows
  console.log("in chat sheet editor", data);
  console.log("in chat sheet editor", data);
  const { columns, rows } = transformToDataGrid(data!);

  const handleDownloadXLSX = () => {
    exportToXlsx(rows, columns, "exported_data.xlsx");
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mt-4 space-x-4">
        <Button onClick={handleDownloadXLSX}>Save to DB</Button>
        <Button onClick={handleDownloadXLSX}>Export as XLSX</Button>

        <Button>
          <CSVLink
            data={rows}
            headers={columns.map((c) => ({ label: c.name, key: c.key }))}
            filename="export_data.csv"
          >
            Export as CSV (react-csv)
          </CSVLink>
        </Button>
      </div>
      <DataGrid columns={columns} rows={rows} />
    </div>
  );
};

export default ChatSheetEditor;
