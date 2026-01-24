import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MemberCard from "../Card/MemberCard";
import styles from "./Members.module.scss";
import { MembersAPI, type Member } from "./api/members";

const OfficeBearersPreview: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await MembersAPI.getAll();
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

  const previewMembers = members.slice(0, 3);

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>OFFICE BEARERS 2026</h2>

      {loading ? (
        <p className={styles.empty}>Loading members...</p>
      ) : members.length === 0 ? (
        <p className={styles.empty}>No members found</p>
      ) : (
        <>
          {/* CENTERED 3 CARDS */}
          <div className={styles.grid}>
            {previewMembers.map((member) => (
              <MemberCard
                key={member.id}
                name={member.name}
                role={member.role}
                image={member.photo_url ?? ""}
              />
            ))}
          </div>

          {/* VIEW MORE BUTTON */}
          {members.length > 3 && (
            <div className={styles.viewMoreWrap}>
              <button
                className={styles.viewMoreBtn}
                onClick={() => navigate("/office-bearers")}
              >
                View More
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default OfficeBearersPreview;
