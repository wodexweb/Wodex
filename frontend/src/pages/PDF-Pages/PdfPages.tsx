// src/pages/PdfPages/PdfPages.tsx
import React, { useEffect, useState } from "react";
import styles from "./PdfPages.module.scss";
import { PdfPagesAPI, type PdfPageItem } from "./api/pdfPages.api";

const PdfPages: React.FC = () => {
  const [data, setData] = useState<PdfPageItem[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await PdfPagesAPI.getAll();
      setData(res);
    } catch (err) {
      console.error("Failed to load PDF pages", err);
    }
  };

  const filteredData = data.filter((item) =>
    `${item.title} ${item.pdf_for}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div className={styles.wrapper}>
      {/* HEADER */}
      <div className={styles.header}>
        <h1>PDF Pages</h1>
        <p>
          <span>Home</span> &gt; PDF Pages
        </p>
      </div>

      {/* SEARCH */}
      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="SEARCH BY TITLE OR CATEGORY"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className={styles.tableWrapper}>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Category</th>
              <th>Description</th>
              <th>PDF</th>
              <th>Link</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={6} className={styles.empty}>
                  No records found
                </td>
              </tr>
            )}

            {filteredData.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.title}</td>
                <td>{item.pdf_for}</td>
                <td>{item.description || "-"}</td>

                <td>
                  {item.file_url ? (
                    <a href={item.file_url} target="_blank" rel="noreferrer">
                      View PDF
                    </a>
                  ) : (
                    "-"
                  )}
                </td>

                <td>
                  {item.link ? (
                    <a href={item.link} target="_blank" rel="noreferrer">
                      Open Link
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION (UI ONLY like directory page) */}
      <div className={styles.pagination}>
        <button disabled>Previous</button>
        <button className={styles.active}>1</button>
        <button disabled>Next</button>
      </div>
    </div>
  );
};

export default PdfPages;
