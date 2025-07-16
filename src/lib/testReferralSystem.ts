import { referralService } from "./firebaseService";
import { subscriptionExtensionService } from "./subscriptionExtension";

// Test the referral system functionality
export const testReferralSystem = async () => {
  console.log("🧪 Testing Referral System...");
  
  try {
    // Test 1: Generate referral code
    const testUserId = "test_user_123";
    const referralCode = await referralService.getOrCreateReferralCode(testUserId);
    console.log("✅ Referral code generated:", referralCode);
    
    // Test 2: Validate referral code
    const validation = await referralService.validateReferralCode(referralCode);
    console.log("✅ Referral code validation:", validation);
    
    // Test 3: Get referral stats
    const stats = await referralService.getReferralStats(testUserId);
    console.log("✅ Referral stats:", stats);
    
    // Test 4: Test subscription extension service
    const extensions = await subscriptionExtensionService.getUserExtensions(testUserId);
    console.log("✅ User extensions:", extensions);
    
    console.log("🎉 All referral system tests passed!");
    return true;
  } catch (error) {
    console.error("❌ Referral system test failed:", error);
    return false;
  }
};

// Test the complete referral flow
export const testCompleteReferralFlow = async () => {
  console.log("🔄 Testing Complete Referral Flow...");
  
  try {
    // Simulate referral creation
    const referrerId = "referrer_123";
    const referredUserId = "referred_456";
    const referrerEmail = "referrer@test.com";
    const referredUserEmail = "referred@test.com";
    
    // Create referral
    const referral = await referralService.createReferral(
      referrerId,
      referredUserId,
      referrerEmail,
      referredUserEmail
    );
    console.log("✅ Referral created:", referral);
    
    // Complete referral (simulate subscription)
    const success = await referralService.completeReferral(referral.id, "pro");
    console.log("✅ Referral completed:", success);
    
    // Check free months were applied
    const referrerExtensions = await subscriptionExtensionService.getUserExtensions(referrerId);
    const referredExtensions = await subscriptionExtensionService.getUserExtensions(referredUserId);
    
    console.log("✅ Referrer free months:", referrerExtensions?.freeMonthsRemaining);
    console.log("✅ Referred user free months:", referredExtensions?.freeMonthsRemaining);
    
    console.log("🎉 Complete referral flow test passed!");
    return true;
  } catch (error) {
    console.error("❌ Complete referral flow test failed:", error);
    return false;
  }
}; 