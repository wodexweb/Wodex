import { useEffect } from "react";
import { useSettings } from "../Hooks/useSettings";

const DocumentTitle = () => {
  const { settings, loading } = useSettings();

  useEffect(() => {
    if (loading) return;

    const title =
      settings?.application_title ||
      settings?.website_title ||
      "Academy Website";

    document.title = title;
  }, [settings, loading]);

  return null;
};

export default DocumentTitle;
