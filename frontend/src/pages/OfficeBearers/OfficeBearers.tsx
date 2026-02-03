import React, { useEffect, useState, useMemo } from "react";
import styles from "./OfficeBearers.module.scss";
import MemberCard from "../../components/Card/MemberCard";
import PageHeaderArea from "../../components/PageHeaderArea/PageHeaderArea";
import { MembersPublicAPI } from "../api/Details";

/* ✅ Standardized Interface */
interface MemberPublic {
  id: number | string;
  name: string;
  position: string;  
  category: string;  
  rank: string | number; 
  photo_url?: string;
  photo?: string;
}

const OfficeBearers: React.FC = () => {
  const [members, setMembers] = useState<MemberPublic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        // ✅ 1. Fetching data as 'any' to bypass strict 'await' typing issues
        const response: any = await MembersPublicAPI.getAll();
        
        if (response && Array.isArray(response)) {
          // ✅ 2. Sort by Rank (Number) - ensures President (Rank 1) is always first
          const dataList = response as MemberPublic[];
          const sortedData = [...dataList].sort((a, b) => {
            const numA = a.rank !== undefined && a.rank !== null ? Number(a.rank) : 999;
            const numB = b.rank !== undefined && b.rank !== null ? Number(b.rank) : 999;
            return (isNaN(numA) ? 999 : numA) - (isNaN(numB) ? 999 : numB);
          });

          setMembers(sortedData);
        }
      } catch (err) {
        console.error("Failed to load members", err);
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  /* ✅ DYNAMIC FILTERING & REDIRECTION
     This logic checks both Category AND Position to place members in the right section.
  */
  const coreCommittee = useMemo(() => {
    return members.filter(m => {
      const cat = m?.category?.trim().toLowerCase() || "";
      const pos = m?.position?.trim().toLowerCase() || "";
      // Redirect to Core if Category is "Core Committee" OR Position is "President" / "Hon. Secretary"
      return cat === "core committee" || pos === "president" || pos === "hon. secretary";
    });
  }, [members]);

  const executiveCommittee = useMemo(() => {
    return members.filter(m => {
      const cat = m?.category?.trim().toLowerCase() || "";
      const pos = m?.position?.trim().toLowerCase() || "";
      const isCore = cat === "core committee" || pos === "president" || pos === "hon. secretary";
      // Show in Executive only if not already categorized as Core
      return cat === "executive committee" && !isCore;
    });
  }, [members]);

  const advisoryCouncil = useMemo(() => {
    return members.filter(m => m?.category?.trim().toLowerCase() === "advisory council");
  }, [members]);

  const otherMembers = useMemo(() => {
    return members.filter(m => {
      const cat = m?.category?.trim().toLowerCase() || "";
      const pos = m?.position?.trim().toLowerCase() || "";
      
      const isCore = cat === "core committee" || pos === "president" || pos === "hon. secretary";
      const isExec = cat === "executive committee";
      const isAdvisory = cat === "advisory council";

      return !isCore && !isExec && !isAdvisory;
    });
  }, [members]);

  return (
    <>
      <PageHeaderArea title="Office Bearers" current="Office Bearers" />

      {loading ? (
        <div className={styles.loadingWrapper}>
          <p className={styles.loading}>Loading Team Members...</p>
        </div>
      ) : (
        <div className={styles.container}>
          
          {/* 1. CORE COMMITTEE - Priority Tier */}
          {coreCommittee.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.categoryHeading}>Core Committee</h2>
              <div className={styles.topGrid}>
                {coreCommittee.map((m) => (
                  <MemberCard
                    key={m.id}
                    name={m.name || "N/A"}
                    role={m.position || "Member"} 
                    image={m.photo_url || m.photo || "/images/user.png"}
                  />
                ))}
              </div>
            </section>
          )}

          {/* 2. EXECUTIVE COMMITTEE */}
          {executiveCommittee.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.subHeading}>Executive Committee</h2>
              <div className={styles.grid}>
                {executiveCommittee.map((m) => (
                  <MemberCard
                    key={m.id}
                    name={m.name}
                    role={m.position || "Member"}
                    image={m.photo_url || m.photo || "/images/user.png"}
                  />
                ))}
              </div>
            </section>
          )}

          {/* 3. ADVISORY COUNCIL */}
          {advisoryCouncil.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.subHeading}>Advisory Council</h2>
              <div className={styles.grid}>
                {advisoryCouncil.map((m) => (
                  <MemberCard
                    key={m.id}
                    name={m.name}
                    role={m.position || "Member"}
                    image={m.photo_url || m.photo || "/images/user.png"}
                  />
                ))}
              </div>
            </section>
          )}

          {/* 4. OTHER MEMBERS - Fallback for general members */}
          {otherMembers.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.subHeading}>Other Members</h2>
              <div className={styles.grid}>
                {otherMembers.map((m) => (
                  <MemberCard
                    key={m.id}
                    name={m.name}
                    role={m.position || "Member"}
                    image={m.photo_url || m.photo || "/images/user.png"}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </>
  );
};

export default OfficeBearers;