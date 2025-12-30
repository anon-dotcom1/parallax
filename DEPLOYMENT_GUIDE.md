# 🚀 DEPLOYMENT GUIDE - FAMILY HUB TO RAILWAY

## What You'll Get
- Live website accessible from anywhere
- Your own URL like: `https://family-hub-production-abc123.up.railway.app`
- Free PostgreSQL database
- Automatic HTTPS/SSL
- Auto-restarts if anything crashes

## Total Time: 15 minutes

---

## STEP 1: Get the Code (2 minutes)

### Option A: I Give You a ZIP File
1. Download the `family-hub.zip` I'll provide
2. Extract it
3. Go to [github.com/new](https://github.com/new)
4. Create new repository:
   - Name: `family-hub`
   - Private: ✅ Yes
   - Don't initialize with README
5. Follow GitHub's instructions to upload code:
```bash
cd family-hub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/family-hub.git
git push -u origin main
```

### Option B: Fork My Public Repo
1. I'll give you link to public repo
2. Click "Fork" on GitHub
3. Change to Private if desired (Settings → Danger Zone → Change visibility)

---

## STEP 2: Deploy to Railway (5 minutes)

### 2.1: Create New Project
1. Go to [railway.app](https://railway.app)
2. You should already be logged in with GitHub
3. Click **"New Project"** (big button in center)
4. Select **"Deploy from GitHub repo"**
5. You'll see list of your repositories
6. Click **"family-hub"**

### 2.2: Railway Auto-Detection
Railway will automatically:
- Detect it's a Node.js app ✅
- Find the Dockerfile ✅
- Set up build process ✅

You'll see: "Configuring deployment..."

### 2.3: Add Database
While deployment is running:
1. Click **"+ New"** (in your project)
2. Select **"Database"**
3. Click **"Add PostgreSQL"**
4. Railway creates database (takes 30 seconds)

### 2.4: Configure Environment Variables
1. Click on your **"family-hub"** service (main app)
2. Go to **"Variables"** tab
3. Click **"+ New Variable"** and add these:

```
JWT_SECRET=super-secret-key-change-this-to-something-random-min-32-chars
NODE_ENV=production
PORT=3000
```

**Note:** `DATABASE_URL` is automatically added by Railway when you added PostgreSQL

4. Click **"Deploy"** (Railway will restart with new variables)

---

## STEP 3: Initialize Database (3 minutes)

### 3.1: Get Database URL
1. In Railway, click on your **"postgres"** database
2. Click **"Connect"** tab
3. Copy the **"DATABASE_URL"** (looks like: `postgresql://postgres:...`)

### 3.2: Run Setup Script

**Option A: Using Railway CLI (easiest)**
1. Install Railway CLI:
```bash
# Mac/Linux
curl -fsSL https://railway.app/install.sh | sh

# Or with npm
npm install -g @railway/cli
```

2. Login and link to project:
```bash
railway login
railway link
```

3. Run database setup:
```bash
railway run npm run db:setup
```

**Option B: Using psql directly**
1. Install psql if you don't have it
2. Connect to database:
```bash
psql "your-database-url-from-railway"
```

3. Run setup manually:
```sql
-- Copy contents from server/database/schema.js
-- Paste and execute all CREATE TABLE statements
```

**Option C: Wait for automatic setup**
- The app will try to create tables on first run
- Check logs to verify

---

## STEP 4: Get Your URL (1 minute)

1. In Railway, click on your **"family-hub"** service
2. Go to **"Settings"** tab
3. Under **"Domains"**, click **"Generate Domain"**
4. Railway creates: `family-hub-production-abc123.up.railway.app`
5. Click the URL to open your app!

---

## STEP 5: Create Your Accounts (3 minutes)

### 5.1: First Login
1. Open your Railway URL
2. You'll see login page
3. Default credentials:
   - Email: `admin@familyhub.local`
   - Password: `changeme123`

### 5.2: Create Your Account
1. After logging in, go to Settings (if available)
2. Or use the register API directly:

```bash
curl -X POST https://your-railway-url.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@gmail.com",
    "password": "your-secure-password",
    "name": "Your Name"
  }'
```

### 5.3: Create Sister's Account
Same as above but with her email:
```bash
curl -X POST https://your-railway-url.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sister-email@gmail.com",
    "password": "her-secure-password",
    "name": "Sister Name"
  }'
```

### 5.4: Delete Default Admin (Optional but Recommended)
1. After creating your accounts, connect to database
2. Delete default admin:
```sql
DELETE FROM users WHERE email = 'admin@familyhub.local';
```

---

## STEP 6: Set Up Your Pets (2 minutes)

### Via API:
```bash
# Get your token first (login returns it)
# Then add each pet:

curl -X POST https://your-url.railway.app/api/escape-plan/pets \
  -H "Authorization: Bearer YOUR-TOKEN-HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cat1",
    "type": "cat",
    "breed": "Domestic",
    "age": 3,
    "weight": 10
  }'

# Repeat for all 3 cats and 1 dog
```

---

## TROUBLESHOOTING

### "Application Error" on Railway URL
**Problem:** App crashed
**Solution:**
1. Go to Railway → your service → "Deployments"
2. Click latest deployment
3. Click "View Logs"
4. Look for errors (usually database connection)
5. Check that `DATABASE_URL` variable exists

### "Cannot connect to database"
**Problem:** Database URL not set
**Solution:**
1. Go to Railway → "postgres" service
2. Click "Variables" tab
3. Copy `DATABASE_URL`
4. Go to "family-hub" service
5. Click "Variables" tab
6. Verify `DATABASE_URL` is there
7. If not, add it manually

### "Build failed"
**Problem:** Missing dependencies or wrong Node version
**Solution:**
1. Check Railway build logs
2. Verify package.json exists
3. Try redeploying (click "Redeploy" in Railway)

### Can't login
**Problem:** Database not initialized
**Solution:**
1. Run database setup script (Step 3)
2. Or manually create tables
3. Verify in database: `SELECT * FROM users;`

### "Invalid token" errors
**Problem:** JWT_SECRET not set or changed
**Solution:**
1. Check Railway → Variables
2. Verify `JWT_SECRET` is set
3. If you changed it, all users must login again

---

## ACCESSING YOUR APP

### From Computer
- Go to your Railway URL
- Bookmark it
- Works on any computer, anywhere

### From Phone
- Same URL works on mobile
- Add to home screen:
  - **iOS:** Safari → Share → "Add to Home Screen"
  - **Android:** Chrome → Menu → "Add to Home Screen"
- Now it looks like a native app!

### Sharing with Sister
- Send her the URL
- Give her login credentials
- She can access from her devices

---

## NEXT STEPS

### Immediate
- [ ] Change default admin password
- [ ] Create your accounts
- [ ] Add your 4 pets
- [ ] Start using!

### Within First Week
- [ ] Add initial budget data
- [ ] Log first health metrics
- [ ] Set up savings goals
- [ ] Compare countries

### When Raspberry Pi Arrives
- [ ] Export data from Railway
- [ ] Set up Pi with Docker
- [ ] Import data to Pi
- [ ] Keep Railway as backup

---

## COSTS

### Railway Free Tier Includes:
- $5 credit per month (renews monthly)
- 500 hours execution time
- 100GB outbound network
- PostgreSQL database

### Your Usage:
- **App:** ~$3/month (always running)
- **Database:** ~$1/month (small database)
- **Total:** ~$4/month (within free tier ✅)

**You pay:** $0/month

### If You Exceed Free Tier:
- Upgrade to $5/month plan
- Gets you $5 credit (covers your usage)
- Still basically free

---

## BACKUP STRATEGY

### Automatic (Railway)
- Railway keeps automatic backups
- Can restore from any deployment

### Manual (Recommended)
Once per month, export data:
```bash
# Install Railway CLI
railway login
railway link

# Export database
railway run pg_dump $DATABASE_URL > backup-2024-01.sql

# Store somewhere safe (Google Drive, Dropbox, etc.)
```

---

## SECURITY NOTES

### ✅ Already Secured:
- HTTPS/SSL (automatic from Railway)
- Password hashing (bcrypt)
- JWT authentication
- SQL injection protection
- CORS configured

### ⚠️ You Should Do:
- Use strong passwords (12+ characters)
- Don't share credentials
- Change JWT_SECRET from default
- Delete admin account after creating yours
- Regularly export backups

### 🔒 Optional Extra Security:
- Set up 2FA (future feature)
- Limit to specific IP addresses
- Add rate limiting
- Set up monitoring

---

## MONITORING

### Check if App is Running:
```bash
curl https://your-url.railway.app/api/health-check
```

Should return:
```json
{"status":"ok","timestamp":"2024-12-30T..."}
```

### View Logs:
1. Railway → Your service
2. Click "Deployments"
3. Click latest deployment
4. Click "View Logs"
5. See real-time logs

### Set Up Alerts (Optional):
1. Railway → Project Settings
2. Notifications
3. Add email/Slack/Discord webhook
4. Get notified if app crashes

---

## DONE! 🎉

You now have:
- ✅ Live web app on Railway
- ✅ PostgreSQL database
- ✅ HTTPS security
- ✅ Accessible from anywhere
- ✅ Free hosting (under usage limits)
- ✅ Two user accounts
- ✅ Ready to use!

**Your URL:** `https://family-hub-production-xxx.up.railway.app`

**Next:** Start using the app! Log health data, track budget, compare countries!

**Questions?** Check troubleshooting section above or Railway documentation.
