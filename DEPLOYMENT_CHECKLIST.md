# 🚀 Render.com Deployment Checklist

Quick checklist for deploying your MERN stack e-commerce to Render.com

---

## ✅ **Pre-Deployment Checklist**

- [ ] Code pushed to GitHub repository
- [ ] MongoDB Atlas cluster created and connection string ready
- [ ] All environment variables documented
- [ ] Cloudinary account configured
- [ ] `index.js` serves React build in production (✅ Already fixed)
- [ ] Cookie settings updated for HTTPS (✅ Already fixed)

---

## 🔧 **Step-by-Step Deployment**

### **Step 1: Create Render Account & Connect GitHub**

1. Go to https://render.com
2. Sign up / Log in
3. Click **"New +"** → **"Web Service"**
4. Connect GitHub account
5. Authorize Render to access your repositories
6. Select your repository

---

### **Step 2: Configure Backend Service**

**Basic Settings:**
- **Name:** `mern-ecommerce-shopx` (or your preferred name)
- **Region:** Choose closest (Oregon, Frankfurt, etc.)
- **Branch:** `main` (or your default branch)
- **Root Directory:** (Leave empty)
- **Runtime:** `Node`
- **Build Command:** `npm install && cd client && npm install && npm run build`
- **Start Command:** `npm start`

**Environment Variables** (Click "Add Environment Variable" for each):

```
NODE_ENV = production
PORT = 5000
DB_URI = mongodb+srv://username:password@cluster.mongodb.net/shopx
JWT_SECRET = your_actual_jwt_secret_key
JWT_EXPIRES_TIME = 7d
COOKIE_EXPIRES_TIME = 7
STRIPE_SECRET_KEY = sk_test_yourStripeSecret
STRIPE_API_KEY = pk_test_yourStripePublishable
CLOUDINARY_CLOUD_NAME = your_cloudinary_cloud_name
CLOUDINARY_API_KEY = your_cloudinary_api_key
CLOUDINARY_API_SECRET = your_cloudinary_api_secret
SMTP_HOST = smtp.yourprovider.com
SMTP_PORT = 587
SMTP_EMAIL = yourlogin@yourprovider.com
SMTP_PASSWORD = your_email_password
SMTP_FROM_NAME = ShopX
SMTP_FROM_EMAIL = no-reply@shopx.local
```

**Important Notes:**
- Replace all placeholder values with your actual credentials
- Use your MongoDB Atlas connection string for `DB_URI`
- Keep your JWT secret secure (use a long random string)

---

### **Step 3: Deploy**

1. Click **"Create Web Service"**
2. Wait for deployment (~5-10 minutes)
3. Monitor build logs for any errors
4. Once deployed, copy your service URL (e.g., `https://mern-ecommerce-shopx.onrender.com`)

---

### **Step 4: Verify Deployment**

1. Visit your service URL: `https://your-service-name.onrender.com`
2. Test API endpoint: `https://your-service-name.onrender.com/api/v1/products`
3. Test frontend: Should load your React app
4. Test user registration/login
5. Test product browsing

---

## 🔍 **Common Issues & Fixes**

### ❌ **Issue: Build Fails**
- **Check:** Build logs in Render dashboard
- **Fix:** Ensure all dependencies are in `package.json`
- **Fix:** Check Node version compatibility

### ❌ **Issue: Cannot Connect to Database**
- **Check:** MongoDB Atlas Network Access → Add `0.0.0.0/0`
- **Fix:** Verify `DB_URI` environment variable is correct
- **Fix:** Check connection string includes database name

### ❌ **Issue: Cookies Not Working**
- **Check:** Cookie settings in `utils/jwtToken.js` (✅ Already fixed)
- **Fix:** Ensure `secure: true` and `sameSite: 'none'` for production

### ❌ **Issue: Service Sleeping**
- **Note:** Free tier services sleep after 15 min inactivity
- **First request:** Will take ~30 seconds to wake up
- **Solution:** Upgrade to paid plan for always-on service

### ❌ **Issue: Environment Variables Not Loading**
- **Check:** All variables added in Render dashboard
- **Fix:** Ensure no typos in variable names
- **Fix:** Redeploy after adding new variables

---

## 📝 **Post-Deployment**

### **Update Your README**

Add your live URLs:
- Backend API: `https://your-service.onrender.com/api/v1`
- Frontend: `https://your-service.onrender.com`

### **Monitor Logs**

- Go to Render Dashboard → Your Service → Logs
- Monitor for errors and performance

### **Set Up Auto-Deploy**

- Already enabled by default
- Every push to `main` branch triggers deployment

---

## 🎯 **Next Steps (Optional)**

1. **Custom Domain:** Add your domain in Render settings
2. **Upgrade Plan:** For always-on service (no sleeping)
3. **Set Up Monitoring:** Use Render's built-in monitoring
4. **Backup Strategy:** Set up MongoDB Atlas backups

---

## 📞 **Support Resources**

- Render Docs: https://render.com/docs
- Render Status: https://status.render.com
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com

---

**Good luck! 🚀**

