import { PageLayout } from "@/components/layout/PageLayout";
import { ReviewPolicyContent } from "./content/ReviewPolicyContent";

const ReviewPolicy = () => (
  <PageLayout seo={{ title: "Hoe wij reviews verzamelen | SenseGlow", description: "Reviews op SenseGlow komen van klanten die het product kochten en gebruikten. We plaatsen positieve en negatieve reviews, zonder beloning.", path: "/reviews-beleid", dutchOnly: true }}>
    <ReviewPolicyContent />
  </PageLayout>
);

export default ReviewPolicy;
