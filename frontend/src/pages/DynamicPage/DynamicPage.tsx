import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

interface Page {
  id: number;
  title: string;
  content: string;
}

const DynamicPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    axios
      .get(`http://localhost:8000/api/pages/slug/${slug}`)
      .then((res) => {
        setPage(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Page not found:", err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!page) return <div className="p-10 text-center">Page Not Found</div>;

  return (
    <div className="container py-5">
      <h1 className="mb-4">{page.title}</h1>

      {/* CKEditor HTML */}
      <div
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </div>
  );
};

export default DynamicPage;