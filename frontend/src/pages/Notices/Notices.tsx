import React, { useState, useEffect } from "react";
import styles from "./Notices.module.scss";
import PageHeaderArea from "../../components/PageHeaderArea/PageHeaderArea";
import { Bell, Calendar, Download, FileText } from "lucide-react";

const NoticeCard = ({ notice_title, notice_description, publish_date, attachment_path }: any) => {
  // Format the publish date
  const date = publish_date 
    ? new Date(publish_date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) 
    : "";

  // Helper to get full URL for attachment
  const attachmentUrl = attachment_path ? `http://localhost:8000/storage/${attachment_path}` : null;

  return (
    <div className={styles.noticeCard}>
      <div className={styles.iconBox}>
        <Bell size={22} />
      </div>
      
      <div className={styles.details}>
        <div className={styles.meta}>
          <Calendar size={14} className="me-1" />
          <span>Published on: {date}</span>
        </div>
        
        <h3 className={styles.title}>{notice_title}</h3>
        <p className={styles.content}>{notice_description}</p>

        {attachmentUrl && (
          <div className={styles.attachmentSection}>
            <a href={attachmentUrl} target="_blank" rel="noopener noreferrer" className={styles.downloadBtn}>
              <FileText size={16} className="me-2" />
              View Attachment
              <Download size={14} className="ms-2" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

const NoticePage: React.FC = () => {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/notices")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setNotices(json.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <PageHeaderArea title="Notice Board" current="Notices" />
      <section className={styles.page}>
        <div className={styles.container}>
          <div className={styles.contentHeader}>
            <h2>Important Announcements</h2>
            <p>Stay updated with the latest news and official notices from GPICC.</p>
          </div>

          <div className={styles.list}>
            {!loading && notices.length > 0 ? (
              notices.map((notice) => (
                <NoticeCard key={notice.id} {...notice} />
              ))
            ) : !loading ? (
              <div className={styles.empty}>No active notices found.</div>
            ) : (
              <div className={styles.empty}>Loading notices...</div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default NoticePage;