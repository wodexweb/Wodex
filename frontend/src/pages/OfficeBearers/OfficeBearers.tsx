import React, { useEffect, useState } from "react";
import styles from "./OfficeBearers.module.scss";
import MemberCard from "../../components/Card/MemberCard";
import PageHeaderArea from "../../components/PageHeaderArea/PageHeaderArea";
import { MembersPublicAPI, type MemberPublic } from "../api/Details";

const OfficeBearers: React.FC = () => {
  const [members, setMembers] = useState<MemberPublic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await MembersPublicAPI.getAll();
        setMembers(data);
      } catch (err) {
        console.error("Failed to load members", err);
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  /* ROLE FILTERING */
  const topRoles = ["President", "Hon. Secretary", "Treasurer"];
  const bottomRoles = ["President Elect", "Past President"];

  const topMembers = members.filter((m) => topRoles.includes(m.role));
  const bottomMembers = members.filter((m) => bottomRoles.includes(m.role));
  const executiveMembers = members.filter(
    (m) => ![...topRoles, ...bottomRoles].includes(m.role),
  );

  return (
    <>
      {/* HEADER */}
      <PageHeaderArea title="OfficeBearers" current="OfficeBearers" />

      {loading ? (
        <p className={styles.loading}>Loading members...</p>
      ) : (
        <>
          {/* TOP ROW (3) */}
          <section className={styles.section}>
            <div className={styles.topGrid}>
              {topMembers.map((m) => (
                <MemberCard
                  key={m.id}
                  name={m.name}
                  role={m.role}
                  image={m.photo_url ?? "/images/user.png"}
                />
              ))}
            </div>
          </section>

          {/* BOTTOM ROW (2 CENTERED) */}
          <section className={styles.section}>
            <div className={styles.bottomGrid}>
              {bottomMembers.map((m) => (
                <MemberCard
                  key={m.id}
                  name={m.name}
                  role={m.role}
                  image={m.photo_url ?? "/images/user.png"}
                />
              ))}
            </div>
          </section>

          {/* EXECUTIVE COMMITTEE */}
          {executiveMembers.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.subHeading}>Executive Committee Members</h2>

              <div className={styles.grid}>
                {executiveMembers.map((m) => (
                  <MemberCard
                    key={m.id}
                    name={m.name}
                    role={m.role}
                    image={m.photo_url ?? "/images/user.png"}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
};

export default OfficeBearers;
