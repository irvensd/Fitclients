// Simple test to verify marketing service functions
import { marketingService } from './firebaseService';

// Mock Firebase for testing
const mockTrainerId = 'test-trainer-123';

// Test the getMarketingMetrics function
export const testMarketingMetrics = async () => {
  try {
    console.log('Testing marketing metrics calculation...');
    
    // Test with empty data
    const emptyMetrics = await marketingService.getMarketingMetrics(mockTrainerId);
    console.log('Empty metrics result:', emptyMetrics);
    
    // Verify the structure
    const requiredFields = [
      'period', 'totalLeads', 'convertedLeads', 'conversionRate',
      'averageLeadValue', 'totalRevenue', 'marketingCost', 'roi',
      'topSources', 'campaignPerformance'
    ];
    
    const hasAllFields = requiredFields.every(field => field in emptyMetrics);
    console.log('Has all required fields:', hasAllFields);
    
    if (!hasAllFields) {
      console.error('Missing required fields:', requiredFields.filter(field => !(field in emptyMetrics)));
    }
    
    return hasAllFields;
  } catch (error) {
    console.error('Test failed:', error);
    return false;
  }
};

// Test data validation
export const testDataValidation = () => {
  console.log('Testing data validation...');
  
  // Test with invalid data
  const invalidCampaigns = [
    { id: '1', title: 'Test', metrics: null },
    { id: '2', title: 'Test 2', metrics: { revenue: 'invalid' } },
    { id: '3', title: 'Test 3' }, // missing metrics
  ];
  
  const invalidLeads = [
    { id: '1', name: 'Test', source: null },
    { id: '2', name: 'Test 2' }, // missing source
    null, // null lead
  ];
  
  // This should not throw an error
  try {
    const totalRevenue = invalidCampaigns.reduce((sum, campaign) => {
      if (campaign && campaign.metrics && typeof campaign.metrics.revenue === 'number') {
        return sum + campaign.metrics.revenue;
      }
      return sum;
    }, 0);
    
    console.log('Invalid campaigns total revenue:', totalRevenue);
    
    const sourceStats = invalidLeads.reduce((acc, lead) => {
      if (!lead || !lead.source) return acc;
      
      if (!acc[lead.source]) {
        acc[lead.source] = { leads: 0, conversions: 0, revenue: 0 };
      }
      acc[lead.source].leads++;
      return acc;
    }, {} as Record<string, { leads: number; conversions: number; revenue: number }>);
    
    console.log('Invalid leads source stats:', sourceStats);
    
    return true;
  } catch (error) {
    console.error('Data validation test failed:', error);
    return false;
  }
};

// Run tests
if (typeof window !== 'undefined') {
  // Only run in browser environment
  (window as any).testMarketingService = async () => {
    console.log('=== Marketing Service Tests ===');
    
    const metricsTest = await testMarketingMetrics();
    const validationTest = testDataValidation();
    
    console.log('Metrics test passed:', metricsTest);
    console.log('Validation test passed:', validationTest);
    
    return metricsTest && validationTest;
  };
} 