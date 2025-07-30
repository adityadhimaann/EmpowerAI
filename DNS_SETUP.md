# DNS Configuration for empowerai.dev

## 🌐 Quick Setup Guide

Your domains have been successfully added to Vercel! Now you need to configure DNS records in Name.com.

### Step 1: Login to Name.com
1. Go to [name.com](https://name.com)
2. Login to your account
3. Find your domain: `empowerai.dev`
4. Click "Manage DNS" or "DNS Records"

### Step 2: Add These DNS Records

**Delete any existing A or CNAME records for @ and www first, then add:**

| Type | Host | Value           | TTL  |
|------|------|-----------------|------|
| A    | @    | 76.76.21.21    | 3600 |
| A    | www  | 76.76.21.21    | 3600 |

**Alternative (CNAME approach) - Use this if you prefer:**

| Type  | Host | Value                | TTL  |
|-------|------|----------------------|------|
| A     | @    | 76.76.21.21         | 3600 |
| CNAME | www  | cname.vercel-dns.com | 3600 |

### Step 3: Save and Wait
- Save your DNS changes
- Wait 10-60 minutes for DNS propagation
- You'll receive an email from Vercel when verification is complete

### Step 4: Test Your Domain
After DNS propagation:
- Visit: https://empowerai.dev
- Visit: https://www.empowerai.dev
- Both should show your EmpowerAI app!

### Verification Script
Run this to check your domain setup:
```bash
./scripts/verify-domain.sh
```

## 📱 Current Status
- ✅ Domain added to Vercel: `empowerai.dev`
- ✅ Subdomain added to Vercel: `www.empowerai.dev`
- ⏳ Waiting for DNS configuration at Name.com
- ⏳ SSL certificates will be auto-provisioned after DNS verification

## 🔧 Troubleshooting
If your domain doesn't work after 2 hours:
1. Double-check DNS records in Name.com
2. Clear browser cache
3. Try incognito/private browsing mode
4. Run the verification script
5. Check Vercel dashboard for any errors

## 📞 Support Links
- Vercel Project: https://vercel.com/adityadhimaanns-projects/empower-ai
- Name.com Support: https://name.com/support
- DNS Checker: https://whatsmydns.net

Your app will be live at **https://empowerai.dev** once DNS is configured! 🚀
