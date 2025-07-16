# 🚀 Domain Setup Guide for fitclients.io

## ✅ **Current Status**
- ✅ App deployed to Firebase: https://fitclients-4c5f2.web.app
- ✅ Domain purchased: `fitclients.io`
- ✅ Ready for custom domain configuration

## 📋 **Step-by-Step Domain Setup**

### **Step 1: Firebase Console Configuration**

1. **Go to Firebase Console**:
   - Visit: https://console.firebase.google.com/project/fitclients-4c5f2/hosting
   - Click on your project: `fitclients-4c5f2`

2. **Add Custom Domain**:
   - In the Hosting section, click **"Add custom domain"**
   - Enter: `fitclients.io`
   - Click **Continue**

3. **Verify Domain Ownership**:
   - Firebase will provide you with DNS records to add to Namecheap
   - You'll need to add a TXT record for verification

### **Step 2: Namecheap DNS Configuration**

Go to your Namecheap dashboard and add these DNS records:

#### **A Records** (for root domain):
```
Type: A
Name: @
Value: 151.101.1.195
TTL: Automatic
```

```
Type: A  
Name: @
Value: 151.101.65.195
TTL: Automatic
```

#### **CNAME Record** (for www subdomain):
```
Type: CNAME
Name: www
Value: fitclients-4c5f2.web.app
TTL: Automatic
```

### **Step 3: SSL Certificate**

Firebase will automatically provision an SSL certificate for your domain once the DNS is configured correctly.

### **Step 4: Verification**

After DNS propagation (can take up to 48 hours):

1. **Test your domain**: https://fitclients.io
2. **Test www subdomain**: https://www.fitclients.io
3. **Verify SSL**: Both should show secure HTTPS

## 🔄 **Deployment Commands**

### **Build and Deploy**:
```bash
# Build the app
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

### **Deploy Everything**:
```bash
# Deploy hosting, functions, and Firestore rules
firebase deploy
```

## 📊 **Analytics Setup**

Your app is already configured with Google Analytics:
- **Measurement ID**: G-BEWLBZ55RR
- **Tracking**: Automatic in production
- **Domain**: Will track fitclients.io once live

## 🔧 **Environment Configuration**

The app automatically detects the environment:
- **Development**: Uses localhost with emulators
- **Production**: Uses production Firebase services
- **Custom Domain**: Will work seamlessly with fitclients.io

## 🚨 **Important Notes**

1. **DNS Propagation**: Can take 24-48 hours
2. **SSL Certificate**: Automatic provisioning by Firebase
3. **Analytics**: Already configured for the new domain
4. **Demo Account**: Always available at `trainer@demo.com` / `demo123`

## ✅ **Success Checklist**

- [ ] Firebase custom domain added
- [ ] DNS records configured in Namecheap
- [ ] Domain verification completed
- [ ] SSL certificate provisioned
- [ ] App accessible at https://fitclients.io
- [ ] www subdomain working
- [ ] Analytics tracking on new domain

## 🆘 **Troubleshooting**

### **If domain doesn't work**:
1. Check DNS propagation: https://www.whatsmydns.net/
2. Verify Firebase console shows domain as active
3. Check SSL certificate status in Firebase console

### **If SSL issues**:
1. Wait 24 hours for certificate provisioning
2. Check Firebase console for certificate status
3. Clear browser cache and try again

## 🎯 **Final Result**

Once complete, your app will be accessible at:
- **Main site**: https://fitclients.io
- **WWW**: https://www.fitclients.io
- **Firebase URL**: https://fitclients-4c5f2.web.app (fallback)

All URLs will work seamlessly with full SSL security and analytics tracking! 