import { useEffect } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { PlacementGuideContent } from "./content/PlacementGuideContent";
import { PLACEMENT_GUIDE_PATH } from "@/lib/placementGuide";
import { getRouteSeo } from "@/lib/seoContent";
import { breadcrumbSchema } from "@/lib/structuredData";

const PlacementGuide = () => {
  useEffect(() => {
    document.body.classList.add("print-placement-guide");
    return () => document.body.classList.remove("print-placement-guide");
  }, []);

  return (
    <PageLayout
      seo={{
        ...getRouteSeo(PLACEMENT_GUIDE_PATH),
        path: PLACEMENT_GUIDE_PATH,
        dutchOnly: true,
        jsonLd: breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Plaatsingsgids trapverlichting", path: PLACEMENT_GUIDE_PATH },
        ]),
      }}
    >
      <PlacementGuideContent />
    </PageLayout>
  );
};

export default PlacementGuide;
