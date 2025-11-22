# Render.com Deployment Guide - MERN Stack E-commerce

Complete step-by-step guide to deploy your MERN stack application on Render.com.

---

## 📋 **Prerequisites**

✅ MongoDB Atlas cluster set up  
✅ GitHub repository pushed with your code  
✅ All environment variables documented  
✅ Cloudinary account configured  

---

## 🗄️ **Step 1: MongoDB Atlas Setup (If Not Done)**

### 1.1 Configure Network Access
- Go to MongoDB Atlas → Network Access
- Add IP: `0.0.0.0/0` (allows all IPs - for Render deployment)

### 1.2 Get Connection String
- Go to Atlas → Database → Connect
- Choose "Connect your application"
- Copy connection string: `mongodb+srv://username:password@cluster.mongodb.net/dbname`
- **Save this - you'll need it for backend env vars**

---

## 🔧 **Step 2: Prepare Backend for Render**

### 2.1 Update `package.json` Scripts

Your root `package.json` needs a build script for Render. Update it:

```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "heroku-postbuild": "cd client && npm install && npm run build"
  }
}
```

### 2.2 Ensure Backend Serves React Build

Check your `index.js` - it should serve the React build in production:

```javascript
// Serve static files from React app
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client/build')));
    
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}
```

---

## 🚀 **Step 3: Deploy Backend to Render**

### 3.1 Create Backend Service

1. **Go to Render Dashboard** → https://dashboard.render.com
2. Click **"New +"** → Select **"Web Service"**
3. Connect your GitHub repository
4. Select your repository

### 3.2 Configure Backend Service

**Basic Settings:**
- **Name:** `mern-ecommerce-backend` (or your preferred name)
- **Region:** Choose closest to your users
- **Branch:** `main` (or your default branch)
- **Root Directory:** Leave empty (root of repo)
- **Runtime:** `Node`
- **Build Command:** `npm install && cd client && npm install && npm run build`
- **Start Command:** `npm start`

**Advanced Settings → Add Environment Variables:**

```env
NODE_ENV=production
PORT=5000
DB_URI=mongodb+srv://username:password@cluster.mongodb.net/shopx
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_TIME=7d
COOKIE_EXPIRES_TIME=7
STRIPE_SECRET_KEY=sk_test_yourStripeSecret
STRIPE_API_KEY=pk_test_yourStripePublishable
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_EMAIL=yourlogin@yourprovider.com
SMTP_PASSWORD=your_email_password
SMTP_FROM_NAME=ShopX
SMTP_FROM_EMAIL=no-reply@shopx.local
```

**Important Notes:**
- Replace all placeholder values with your actual credentials
- For `DB_URI`, use your MongoDB Atlas connection string
- Render will auto-assign a port, but `PORT` env var will be used
- Save the service URL (e.g., `https://mern-ecommerce-backend.onrender.com`)

### 3.3 Deploy Backend

1. Click **"Create Web Service"**
2. Wait for deployment to complete (~5-10 minutes)
3. Note the service URL (e.g., `https://mern-ecommerce-backend.onrender.com`)

---

## ⚛️ **Step 4: Deploy Frontend to Render**

### 4.1 Update Frontend Environment Variables

Create/update `client/.env` or `client/.env.production`:

```env
REACT_APP_API_BASE_URL=https://mern-ecommerce-backend.onrender.com/api/v1
```

**Important:** Use your actual backend URL from Step 3.3!

### 4.2 Update `client/src/config.js`

Ensure it uses the environment variable:

```javascript
export const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || "",
    withCredentials: true,
});
```

### 4.3 Push Changes to GitHub

```bash
git add .
git commit -m "Add production environment configuration"
git push origin main
```

### 4.4 Create Frontend Service (Optional - Separate Deployment)

**Option A: Separate Frontend Service (Recommended for larger apps)**

1. **Go to Render Dashboard** → **"New +"** → **"Static Site"**
2. Connect your GitHub repository
3. **Configuration:**
   - **Name:** `mern-ecommerce-frontend`
   - **Branch:** `main`
   - **Root Directory:** `client`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `build`
4. **Add Environment Variables:**
   ```env
   REACT_APP_API_BASE_URL=https://mern-ecommerce-backend.onrender.com/api/v1
   ```
5. Click **"Create Static Site"**

**Option B: Backend Serves Frontend (Simpler)**

If your backend already serves the React build (check `index.js`), you only need the backend service from Step 3. The frontend will be served automatically.

---

## 🔐 **Step 5: Configure CORS & Cookies**

### 5.1 Update Backend CORS (if needed)

In your `index.js`, ensure CORS allows your frontend domain:

```javascript
const cors = require('cors');

app.use(cors({
    origin: process.env.FRONTEND_URL || 'https://your-frontend.onrender.com',
    credentials: true
}));
```

### 5.2 Cookie Settings

Ensure cookies work with HTTPS (Render uses HTTPS):

In `utils/jwtToken.js` or where you set cookies:

```javascript
res.cookie('token', token, {
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'none' // Required for cross-origin cookies
});
```

---

## 📝 **Step 6: Environment Variables Checklist**

### Backend (Render Web Service):

```env
✅ NODE_ENV=production
✅ PORT=5000 (Render auto-assigns, but set it)
✅ DB_URI=mongodb+srv://...
✅ JWT_SECRET=...
✅ JWT_EXPIRES_TIME=7d
✅ COOKIE_EXPIRES_TIME=7
✅ STRIPE_SECRET_KEY=...
✅ STRIPE_API_KEY=...
✅ CLOUDINARY_CLOUD_NAME=...
✅ CLOUDINARY_API_KEY=...
✅ CLOUDINARY_API_SECRET=...
✅ SMTP_HOST=...
✅ SMTP_PORT=587
✅ SMTP_EMAIL=...
✅ SMTP_PASSWORD=...
✅ SMTP_FROM_NAME=ShopX
✅ SMTP_FROM_EMAIL=...
```

### Frontend (If Separate Static Site):

```env
✅ REACT_APP_API_BASE_URL=https://your-backend.onrender.com/api/v1
```

---

## ✅ **Step 7: Test Deployment**

### 7.1 Test Backend

1. Visit: `https://your-backend.onrender.com/api/v1/health/db` (if you have this endpoint)
2. Or test: `https://your-backend.onrender.com/api/v1/products`

### 7.2 Test Frontend

1. Visit your frontend URL
2. Test user registration/login
3. Test product browsing
4. Test order placement

---

## 🐛 **Common Issues & Solutions**

### Issue 1: "Service keeps sleeping"
- **Cause:** Free tier services sleep after 15 minutes of inactivity
- **Solution:** First request will take ~30 seconds to wake up, or upgrade to paid plan

### Issue 2: "CORS errors"
- **Cause:** Backend not allowing frontend origin
- **Solution:** Update CORS settings in backend to include frontend URL

### Issue 3: "Cookies not working"
- **Cause:** `secure` and `sameSite` cookie settings
- **Solution:** Set `secure: true` and `sameSite: 'none'` in production

### Issue 4: "Build fails"
- **Cause:** Missing dependencies or build errors
- **Solution:** Check build logs in Render dashboard, ensure all dependencies are in `package.json`

### Issue 5: "Database connection fails"
- **Cause:** MongoDB Atlas IP whitelist or connection string
- **Solution:** Add `0.0.0.0/0` to MongoDB Atlas Network Access

### Issue 6: "Environment variables not found"
- **Cause:** Variables not set in Render dashboard
- **Solution:** Double-check all env vars are added in Render service settings

---

## 🎯 **Step 8: Custom Domain (Optional)**

1. Go to your Render service → Settings → Custom Domain
2. Add your domain
3. Update DNS records as instructed by Render
4. Update `FRONTEND_URL` env var in backend to match

---

## 📊 **Render Dashboard Links**

After deployment:
- **Backend Service:** https://dashboard.render.com/web/[your-backend-service]
- **Frontend Service:** https://dashboard.render.com/static/[your-frontend-service] (if separate)

---

## 🔄 **Updating Deployment**

1. Push changes to GitHub: `git push origin main`
2. Render automatically redeploys on push (if auto-deploy enabled)
3. Check deployment logs in Render dashboard

---

## 💡 **Pro Tips**

1. **Use Environment Groups** in Render for shared env vars across services
2. **Enable Auto-Deploy** for automatic deployments on git push
3. **Set up Health Checks** to monitor service status
4. **Monitor Logs** regularly for errors
5. **Use Render's PostgreSQL** if you want a managed database (or stick with MongoDB Atlas)

---

## 📞 **Support**

- Render Docs: https://render.com/docs
- Render Status: https://status.render.com
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com

---

**Good luck with your deployment! 🚀**

