import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AiFillHome } from "react-icons/ai";
import styles from "./MembersDirectory.module.scss";
import { MembersAPI, type Member } from "./api/member_directory";

const PAGE_SIZE = 10;

const MembersDirectory: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    MembersAPI.getAll()
      .then(setMembers)
      .catch(() => setMembers([]))
      .finally(() => setLoading(false));
  }, []);

  /* ✅ SAFE FILTER (NO CRASH) */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    return members.filter((m) => {
      const mobile = String(m.mobile ?? "");
      const name = String(m.name ?? "").toLowerCase();
      const city = String(m.city ?? "").toLowerCase();

      return mobile.includes(q) || name.includes(q) || city.includes(q);
    });
  }, [members, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  return (
    <>
      {/* HEADER */}
      <section className={styles.header}>
        <h1>Member’s Directory</h1>

        <p className={styles.breadcrumb}>
          <Link to="/" className={styles.home}>
            <AiFillHome />
            <span>Home</span>
          </Link>
          <span className={styles.separator}>&gt;</span>
          <span className={styles.current}>Member’s Directory</span>
        </p>
      </section>

      {/* CONTENT */}
      <section className={styles.page}>
        <div className={styles.container}>
          <input
            className={styles.search}
            placeholder="SEARCH BY MOBILE NO., NAME, CITY"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          {loading ? (
            <p className={styles.empty}>Loading members...</p>
          ) : (
            <>
              <div className={styles.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th>GPICC No.</th>
                      <th>Mobile</th>
                      <th>Surname</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Gender</th>
                      <th>City</th>
                      <th>Pincode</th>
                      <th>CIAP No.</th>
                      <th>Address</th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginated.map((m) => (
                      <tr key={m.id}>
                        <td>{m.gpicc_no}</td>
                        <td>{m.mobile}</td>
                        <td>{m.surname}</td>
                        <td>{m.name}</td>
                        <td>{m.email}</td>
                        <td>{m.gender}</td>
                        <td>{m.city}</td>
                        <td>{m.pincode}</td>
                        <td>{m.ciap_no}</td>
                        <td>{m.address}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              <div className={styles.pagination}>
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    className={page === i + 1 ? styles.active : ""}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default MembersDirectory;
