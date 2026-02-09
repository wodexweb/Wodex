import React, { useEffect, useState } from "react";
import axios from "axios";

interface UserInfo {
  name: string;
  surname: string;
  mobile: string;
  email: string;
  city: string;
}

interface MembershipInfo {
  title: string;
}

interface Purchase {
  id: number;
  amount: string;
  status: string;
  start_date: string;
  end_date: string;
  user: UserInfo | null;
  membership: MembershipInfo | null;
}

const User: React.FC = () => {
  const [data, setData] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/admin/memberships"
      );
      setData(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>User Membership Purchases</h2>

      {loading && <p style={styles.infoText}>Loading...</p>}

      {error && <p style={styles.errorText}>{error}</p>}

      {!loading && !error && data.length === 0 && (
        <p style={styles.infoText}>No membership purchases found.</p>
      )}

      {!loading && !error && data.length > 0 && (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>City</th>
                <th>Membership</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Start Date</th>
                <th>End Date</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>
                    {item.user
                      ? `${item.user.name} ${item.user.surname}`
                      : "N/A"}
                  </td>
                  <td>{item.user?.mobile || "N/A"}</td>
                  <td>{item.user?.email || "N/A"}</td>
                  <td>{item.user?.city || "N/A"}</td>
                  <td>{item.membership?.title || "N/A"}</td>
                  <td>₹{item.amount}</td>
                  <td>
                    <span
                      style={{
                        ...styles.status,
                        background:
                          item.status === "paid" ? "#e6fffa" : "#fff5f5",
                        color:
                          item.status === "paid" ? "#047857" : "#b91c1c",
                      }}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td>{item.start_date}</td>
                  <td>{item.end_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

/* ================= STYLES ================= */

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: 20,
    background: "#ffffff",
    borderRadius: 8,
  },
  heading: {
    marginBottom: 15,
    fontSize: 22,
    fontWeight: 600,
  },
  infoText: {
    color: "#555",
    marginTop: 10,
  },
  errorText: {
    color: "#dc2626",
    marginTop: 10,
  },
  tableWrapper: {
    overflowX: "auto",
    marginTop: 10,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  status: {
    padding: "4px 10px",
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 600,
    textTransform: "capitalize",
    display: "inline-block",
  },
};

export default User;