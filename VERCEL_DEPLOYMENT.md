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

2. **Custom Domain** (Optional):
   - In Vercel dashboard, go to your project settings
   - Add your custom domain under "Domains"

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

## Support
If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables are set correctly
3. Test local build: `npm run build && npm run preview`
