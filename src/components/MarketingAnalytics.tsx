import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
  BarChart3,
  PieChart,
  RefreshCw,
  Download,
  Share2,
  Mail,
  Phone,
  Globe,
} from "lucide-react";
import { useMarketing } from "@/contexts/MarketingContext";
import { MarketingMetrics } from "@/lib/marketingTypes";

interface PeriodMetrics {
  current: MarketingMetrics;
  previous?: MarketingMetrics;
}

export const MarketingAnalytics: React.FC = () => {
  const { metrics, getMetricsByPeriod, refreshMetrics } = useMarketing();
  const [selectedPeriod, setSelectedPeriod] = useState<
    "week" | "month" | "quarter" | "year"
  >("month");
  const [periodMetrics, setPeriodMetrics] = useState<PeriodMetrics>({
    current: metrics,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPeriodMetrics(selectedPeriod);
  }, [selectedPeriod]);

  const loadPeriodMetrics = async (
    period: "week" | "month" | "quarter" | "year",
  ) => {
    setLoading(true);
    try {
      const currentMetrics = await getMetricsByPeriod(period);
      // For demo purposes, generate previous period data
      const previousMetrics = generatePreviousPeriodData(currentMetrics);
      setPeriodMetrics({
        current: currentMetrics,
        previous: previousMetrics,
      });
    } catch (error) {
      console.error("Failed to load period metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  const generatePreviousPeriodData = (
    current: MarketingMetrics,
  ): MarketingMetrics => {
    // Generate realistic previous period data for comparison
    const variation = 0.8 + Math.random() * 0.4; // 0.8 to 1.2 multiplier
    return {
      ...current,
      totalLeads: Math.floor(current.totalLeads * variation),
      convertedLeads: Math.floor(current.convertedLeads * variation),
      conversionRate: current.conversionRate * variation,
      totalRevenue: Math.floor(current.totalRevenue * variation),
      marketingCost: Math.floor(current.marketingCost * variation),
      roi: current.roi * variation,
      topSources: current.topSources.map((source) => ({
        ...source,
        leads: Math.floor(source.leads * variation),
        conversions: Math.floor(source.conversions * variation),
        revenue: Math.floor(source.revenue * variation),
      })),
    };
  };

  const calculateChange = (current: number, previous: number): number => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const formatChange = (change: number): string => {
    const sign = change >= 0 ? "+" : "";
    return `${sign}${change.toFixed(1)}%`;
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? (
      <TrendingUp className="h-3 w-3 text-green-600" />
    ) : (
      <TrendingDown className="h-3 w-3 text-red-600" />
    );
  };

  const getChangeColor = (change: number): string => {
    return change >= 0 ? "text-green-600" : "text-red-600";
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "website":
        return <Globe className="h-4 w-4" />;
      case "social":
        return <Share2 className="h-4 w-4" />;
      case "referral":
        return <Users className="h-4 w-4" />;
      case "email":
        return <Mail className="h-4 w-4" />;
      case "phone":
        return <Phone className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  const handleRefresh = async () => {
    await refreshMetrics();
    await loadPeriodMetrics(selectedPeriod);
  };

  const exportData = () => {
    const data = {
      period: selectedPeriod,
      generatedAt: new Date().toISOString(),
      metrics: periodMetrics.current,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `marketing-analytics-${selectedPeriod}-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const { current, previous } = periodMetrics;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Marketing Analytics</h3>
          <p className="text-sm text-muted-foreground">
            Track your marketing performance and ROI
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button variant="outline" size="sm" onClick={exportData}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Total Leads</span>
              </div>
              {previous && (
                <div
                  className={`flex items-center gap-1 text-xs ${getChangeColor(calculateChange(current.totalLeads, previous.totalLeads))}`}
                >
                  {getChangeIcon(
                    calculateChange(current.totalLeads, previous.totalLeads),
                  )}
                  {formatChange(
                    calculateChange(current.totalLeads, previous.totalLeads),
                  )}
                </div>
              )}
            </div>
            <div className="text-2xl font-bold">{current.totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              {current.convertedLeads} converted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Conversion Rate</span>
              </div>
              {previous && (
                <div
                  className={`flex items-center gap-1 text-xs ${getChangeColor(calculateChange(current.conversionRate, previous.conversionRate))}`}
                >
                  {getChangeIcon(
                    calculateChange(
                      current.conversionRate,
                      previous.conversionRate,
                    ),
                  )}
                  {formatChange(
                    calculateChange(
                      current.conversionRate,
                      previous.conversionRate,
                    ),
                  )}
                </div>
              )}
            </div>
            <div className="text-2xl font-bold">
              {current.conversionRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Industry avg: 2-5%</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Revenue</span>
              </div>
              {previous && (
                <div
                  className={`flex items-center gap-1 text-xs ${getChangeColor(calculateChange(current.totalRevenue, previous.totalRevenue))}`}
                >
                  {getChangeIcon(
                    calculateChange(
                      current.totalRevenue,
                      previous.totalRevenue,
                    ),
                  )}
                  {formatChange(
                    calculateChange(
                      current.totalRevenue,
                      previous.totalRevenue,
                    ),
                  )}
                </div>
              )}
            </div>
            <div className="text-2xl font-bold">${current.totalRevenue}</div>
            <p className="text-xs text-muted-foreground">
              ${current.averageLeadValue.toFixed(0)} avg per lead
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium">ROI</span>
              </div>
              {previous && (
                <div
                  className={`flex items-center gap-1 text-xs ${getChangeColor(calculateChange(current.roi, previous.roi))}`}
                >
                  {getChangeIcon(calculateChange(current.roi, previous.roi))}
                  {formatChange(calculateChange(current.roi, previous.roi))}
                </div>
              )}
            </div>
            <div className="text-2xl font-bold">{current.roi.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              ${current.marketingCost} spent
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lead Sources Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Lead Sources
            </CardTitle>
            <CardDescription>
              Where your leads are coming from this {selectedPeriod}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {current.topSources.map((source, index) => (
                <div key={source.source} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getSourceIcon(source.source)}
                      <span className="font-medium capitalize">
                        {source.source}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{source.leads} leads</div>
                      <div className="text-sm text-muted-foreground">
                        {source.conversions} converted
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Progress
                      value={
                        current.totalLeads > 0
                          ? (source.leads / current.totalLeads) * 100
                          : 0
                      }
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        {current.totalLeads > 0
                          ? ((source.leads / current.totalLeads) * 100).toFixed(
                              1,
                            )
                          : 0}
                        % of total leads
                      </span>
                      <span>
                        {source.leads > 0
                          ? ((source.conversions / source.leads) * 100).toFixed(
                              1,
                            )
                          : 0}
                        % conversion rate
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {current.topSources.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No lead source data available for this period
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Campaign Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Campaign Performance
            </CardTitle>
            <CardDescription>
              ROI and conversion metrics for active campaigns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {current.campaignPerformance.map((campaign) => (
                <div key={campaign.campaignId} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{campaign.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {campaign.clicks} clicks • {campaign.conversions}{" "}
                        conversions
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={campaign.roi > 100 ? "default" : "secondary"}
                      >
                        {campaign.roi.toFixed(1)}% ROI
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Cost</div>
                      <div className="font-medium">${campaign.cost}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Revenue</div>
                      <div className="font-medium">${campaign.revenue}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Conversion</div>
                      <div className="font-medium">
                        {campaign.clicks > 0
                          ? (
                              (campaign.conversions / campaign.clicks) *
                              100
                            ).toFixed(1)
                          : 0}
                        %
                      </div>
                    </div>
                  </div>
                  <Progress
                    value={Math.min(campaign.roi, 200)}
                    className="h-2"
                  />
                </div>
              ))}

              {current.campaignPerformance.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No campaign data available for this period
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
          <CardDescription>
            AI-powered recommendations to improve your marketing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {current.conversionRate > 5 ? (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800">
                    Excellent Performance
                  </span>
                </div>
                <p className="text-sm text-green-700">
                  Your conversion rate of {current.conversionRate.toFixed(1)}%
                  is above industry average. Consider scaling successful
                  campaigns to maximize growth.
                </p>
              </div>
            ) : (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium text-yellow-800">
                    Optimization Opportunity
                  </span>
                </div>
                <p className="text-sm text-yellow-700">
                  Your conversion rate could be improved. Focus on qualifying
                  leads better and following up more consistently with potential
                  clients.
                </p>
              </div>
            )}

            {current.roi > 200 ? (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-800">
                    High ROI Alert
                  </span>
                </div>
                <p className="text-sm text-blue-700">
                  Outstanding ROI of {current.roi.toFixed(1)}%! Consider
                  increasing your marketing budget to scale these successful
                  campaigns.
                </p>
              </div>
            ) : current.roi < 50 ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                  <span className="font-medium text-red-800">
                    ROI Improvement Needed
                  </span>
                </div>
                <p className="text-sm text-red-700">
                  Your ROI of {current.roi.toFixed(1)}% could be improved.
                  Review your most expensive campaigns and focus budget on
                  higher-performing channels.
                </p>
              </div>
            ) : null}

            {current.topSources.length > 0 && (
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-purple-600" />
                  <span className="font-medium text-purple-800">
                    Top Performing Source
                  </span>
                </div>
                <p className="text-sm text-purple-700">
                  {current.topSources[0].source.charAt(0).toUpperCase() +
                    current.topSources[0].source.slice(1)}{" "}
                  is your best lead source with {current.topSources[0].leads}{" "}
                  leads and{" "}
                  {(
                    (current.topSources[0].conversions /
                      current.topSources[0].leads) *
                    100
                  ).toFixed(1)}
                  % conversion rate. Consider investing more in this channel.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
