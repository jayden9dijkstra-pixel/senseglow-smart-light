import { PageLayout } from "@/components/layout/PageLayout";

const Tracking = () => {
  return (
    <PageLayout>
      <div className="w-full" style={{ minHeight: "calc(100vh - 200px)" }}>
        <iframe
          src="https://senseglow-smart-light-5jjoq.myshopify.com/apps/17TRACK"
          title="Bestelling volgen"
          className="w-full border-0"
          style={{ minHeight: "calc(100vh - 200px)" }}
          allow="clipboard-read; clipboard-write"
        />
      </div>
    </PageLayout>
  );
};

export default Tracking;
