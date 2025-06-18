import { MarketingHub } from "@/components/MarketingHub";
import { DevModeNotice } from "@/components/DevModeNotice";

const Marketing = () => {
  return (
    <div className="p-6 space-y-6">
      <DevModeNotice />

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Marketing & Growth
        </h1>
        <p className="text-muted-foreground">
          Grow your fitness business with automated marketing tools and client
          referral programs.
        </p>
      </div>

      {/* Marketing Hub */}
      <MarketingHub />
    </div>
  );
};

export default Marketing;
