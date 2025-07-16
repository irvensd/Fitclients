// Test referral link generation
export const testReferralLink = () => {
  const testCode = "TEST123";
  const referralLink = `${window.location.origin}/login?ref=${testCode}`;
  
  console.log("🧪 Testing Referral Link Generation:");
  console.log("Current origin:", window.location.origin);
  console.log("Generated link:", referralLink);
  console.log("Expected format: http://localhost:8080/login?ref=TEST123");
  
  return referralLink;
}; 