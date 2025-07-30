# Vercel Deployment Guide for EmpowerAI

## Prerequisites
1. A [Vercel account](https://vercel.com/signup)
2. A Google Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
3. Your project code pushed to GitHub (recommended) or available locally

## Step-by-Step Deployment

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Import Project on Vercel**:
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect it's a Vite project

3. **Configure Environment Variables**:
   - In the deployment settings, add environment variable:
     - Key: `VITE_API_KEY`
     - Value: Your Google Gemini API key
   - Click "Deploy"

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```
   
4. **Set Environment Variables**:
   ```bash
   vercel env add VITE_API_KEY
   ```
   Then paste your Google Gemini API key when prompted.

5. **Redeploy with Environment Variables**:
   ```bash
   vercel --prod
   ```

## Configuration Files

### vercel.json
The project includes a `vercel.json` file with optimized settings:
- Framework detection: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable mapping
- Cache headers for assets
- SPA routing support

### Environment Variables Required
- `VITE_API_KEY`: Your Google Gemini API key

## Post-Deployment Steps

1. **Verify Deployment**:
   - Visit your Vercel deployment URL
   - Test the presentation generation functionality
   - Check browser console for any errors

2. **Custom Domain Setup**:
   - In Vercel dashboard, go to your project settings
   - Navigate to "Domains" tab
   - Add your custom domain: `empowerai.dev`
   - Configure DNS records in Name.com dashboard

3. **Performance Optimization**:
   - Enable Analytics in Vercel dashboard
   - Monitor Core Web Vitals
   - Consider enabling Edge Functions if needed

## Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check that all dependencies are listed in `package.json`
   - Ensure TypeScript compilation passes locally: `npm run build`

2. **API Key Issues**:
   - Verify `VITE_API_KEY` is set in Vercel environment variables
   - Check the API key has proper permissions in Google AI Studio

3. **Runtime Errors**:
   - Check the Function Logs in Vercel dashboard
   - Ensure all imports are correctly resolved

### Build Optimization:
The current build size might trigger Vercel warnings. Consider:
- Code splitting for large dependencies
- Lazy loading components
- Bundle analysis: `npm install --save-dev @bundle-analyzer/webpack-plugin`

## Security Notes
- API key is properly prefixed with `VITE_` for client-side access
- Consider implementing rate limiting for production use
- Monitor API usage in Google AI Studio

## Custom Domain Setup (empowerai.dev)

### Step 1: Add Domain in Vercel Dashboard

1. **Go to Your Project**:
   - Visit: https://vercel.com/adityadhimaanns-projects/empower-ai
   - Click on "Settings" tab
   - Navigate to "Domains" section

2. **Add Your Domain**:
   - Click "Add Domain"
   - Enter: `empowerai.dev`
   - Click "Add"

3. **Configure Subdomains** (Optional but Recommended):
   - Add `www.empowerai.dev` as well
   - This ensures both www and non-www versions work

### Step 2: Configure DNS at Name.com

1. **Login to Name.com**:
   - Go to [name.com](https://name.com) and login
   - Navigate to your domain: `empowerai.dev`
   - Go to "DNS Records" or "Manage DNS"

2. **Add DNS Records**:
   
   **For Root Domain (empowerai.dev):**
   ```
   Type: A
   Host: @
   Value: 76.76.19.19
   TTL: 3600 (or Auto)
   ```

   **For WWW Subdomain (www.empowerai.dev):**
   ```
   Type: CNAME
   Host: www
   Value: cname.vercel-dns.com
   TTL: 3600 (or Auto)
   ```

   **Alternative - Use CNAME for Root (if Name.com supports ALIAS/ANAME):**
   ```
   Type: CNAME (or ALIAS/ANAME)
   Host: @
   Value: cname.vercel-dns.com
   TTL: 3600
   ```

3. **Save DNS Changes**:
   - Save all DNS record changes
   - DNS propagation can take 24-48 hours, but usually works within 1-2 hours

### Step 3: Verify Domain Setup

1. **Check Vercel Dashboard**:
   - Return to your Vercel project settings
   - In the "Domains" section, you should see verification status
   - Wait for "Valid Configuration" status

2. **Test Your Domain**:
   ```bash
   # Check DNS propagation
   nslookup empowerai.dev
   nslookup www.empowerai.dev
   
   # Test with curl
   curl -I https://empowerai.dev
   curl -I https://www.empowerai.dev
   ```

3. **SSL Certificate**:
   - Vercel automatically provisions SSL certificates
   - This may take a few minutes after DNS propagation

### Step 4: Configure Domain Redirects (Optional)

You can set up redirects to ensure all traffic goes to your preferred domain:

1. **In Vercel Dashboard**:
   - Go to your project settings
   - Navigate to "Domains"
   - Click on the domain you want to redirect FROM
   - Select "Redirect to" and choose your primary domain

**Recommended Setup:**
- Primary: `empowerai.dev` (main domain)
- Redirect: `www.empowerai.dev` → `empowerai.dev`

### DNS Configuration Summary

Here's what your Name.com DNS records should look like:

| Type  | Host | Value                | TTL  | Purpose                    |
|-------|------|----------------------|------|----------------------------|
| A     | @    | 76.76.19.19         | 3600 | Root domain to Vercel      |
| CNAME | www  | cname.vercel-dns.com | 3600 | WWW subdomain to Vercel    |

### Troubleshooting Domain Issues

1. **Domain Not Verifying**:
   - Double-check DNS records in Name.com
   - Wait for DNS propagation (up to 48 hours)
   - Use online DNS checkers: whatsmydns.net

2. **SSL Certificate Issues**:
   - Wait 10-15 minutes after DNS verification
   - SSL certificates are auto-provisioned by Vercel
   - Contact Vercel support if issues persist

3. **Redirect Issues**:
   - Clear browser cache
   - Test in incognito/private mode
   - Check redirect configuration in Vercel dashboard

### Expected Timeline
- **DNS Setup**: 5-10 minutes
- **DNS Propagation**: 1-2 hours (up to 48 hours)
- **SSL Certificate**: 5-15 minutes after DNS verification
- **Total Time**: Usually 1-3 hours for everything to work

## Support
If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables are set correctly
3. Test local build: `npm run build && npm run preview`
