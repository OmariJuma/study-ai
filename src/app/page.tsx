"use client";
import { useState } from "react";
import * as XLSX from "xlsx";
export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [workBookState, setWorkBookState] = useState<XLSX.WorkBook>();
  const [selectedSheet, setSelectedSheet] = useState<String | null>(null);
  return (
    <div className="text-center mt-10">
      <h1 className="text-4xl font-bold  text-amber-600">Study Like a Pro</h1>
      <strong className="text-2xl  italic text-amber-500">
        "Upload your exam questions and answers and get AI-generated summaries"
      </strong>
      <div className="mt-10 flex flex-col items-center gap-5">
        <input
          type="file"
          className="hidden"
          name="file-upload"
          id="file-upload"
          accept=".xls, .xlsx"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setFile(file);
              const reader = new FileReader();
              reader.onload = (e) => {
                const data = e.target?.result;
                if (data) {
                  const workBook = XLSX.read(data, { type: "array" });
                  setWorkBookState(workBook);
                  console.log(workBook);
                }
              };
              reader.onerror = (e) => {
                console.log(e);
              };
              reader.readAsArrayBuffer(file);
            }
          }}
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer text-amber-600 bg-gray-50 px-4 py-2 rounded-md"
        >
          Upload your exam questions and answers
        </label>
        {file && (
          <p className="bg-amber-500 text-white px-4 py-2 rounded-md w-1/3">
            {file.name} <span className="text-white">{file.size} bytes</span>
          </p>
        )}
        {workBookState && (
          <div className="mt-4 flex flex-wrap gap-3 justify-center">
            {workBookState.SheetNames.map((sheetName) => (
              <button
                key={sheetName}
                className={`px-4 py-2 rounded-full font-bold transition-all ${
                  selectedSheet === sheetName
                    ? "bg-amber-600 text-white scale-110"
                    : "bg-amber-200 text-amber-800 hover:bg-amber-400"
                }`}
                onClick={() => setSelectedSheet(sheetName)}
              >
                {sheetName}
              </button>
            ))}
          </div>
        )}
        {selectedSheet && workBookState && (
          <div className="mt-6 w-full max-w-11/12">
            <h2 className="text-xl font-bold mb-4 text-amber-700">{selectedSheet}</h2>
            <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
              <table className="min-w-full">
                <tbody>
                  {(XLSX.utils.sheet_to_json(
                    workBookState.Sheets[selectedSheet as string],
                    { header: 1 }
                  ) as unknown[]).map((row, rowIndex) => {
                    // Ensure row is an array
                    const cells = Array.isArray(row) ? row : [];
                    return (
                      <tr key={rowIndex} className="border-b border-gray-200 hover:bg-amber-50">
                        {cells.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="px-4 py-3 text-left text-amber-900"
                          >
                            {cell || ''}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
