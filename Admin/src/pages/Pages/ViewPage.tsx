import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Card, CardBody, Spinner, Button } from "reactstrap";
import { APIClient } from "../../helpers/api_helper";
import { toast } from "react-toastify";

const api = new APIClient();

interface PageItem {
  id: number;
  title: string;
  slug: string;
  content: string;
  status: "published" | "draft";
  created_at: string;
}

const ViewPage = () => {
  const { id } = useParams();
  const [page, setPage] = useState<PageItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPage();
  }, []);

  const fetchPage = async () => {
    try {
      const res: any = await api.get(`/api/admin/pages/${id}`);
      setPage(res);
    } catch {
      toast.error("Failed to load page");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner /> Loading...
      </div>
    );
  }

  if (!page) return <div>Page not found</div>;

  return (
    <div className="page-content">
      <Container>
        <Card>
          <CardBody>
            <h2>{page.title}</h2>
            <p><strong>Slug:</strong> /{page.slug}</p>
            <p><strong>Status:</strong> {page.status}</p>
            <p><strong>Created:</strong> {new Date(page.created_at).toLocaleString()}</p>

            <hr />

            <div
              dangerouslySetInnerHTML={{ __html: page.content }}
            />

            <Link to="/pages">
              <Button color="secondary" className="mt-4">
                Back
              </Button>
            </Link>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default ViewPage;