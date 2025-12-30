# 🚀 PARALLAX - 15-MINUTE DEPLOYMENT

**Retro-futuristic command center. Let's get you online.**

---

## ⏱️ TOTAL TIME: 15 MINUTES

### What You'll Have:
- Live web app at: `parallax-production-xxx.up.railway.app`
- Secure PostgreSQL database
- Multi-user access (you + sister)
- $0/month cost
- Access from any device, anywhere

---

## 📋 STEP 1: UPLOAD TO GITHUB (5 minutes)

### 1.1 Create Repository
1. Go to **[github.com/new](https://github.com/new)**
2. Repository name: **`parallax`**
3. Description: *"Personal command center"*
4. Make it **Private** ✅
5. **DO NOT** check "Initialize with README"
6. Click **"Create repository"**

### 1.2 Push Your Code
Open terminal/command prompt in the `parallax` folder:

```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Parallax command center"

# Set main branch
git branch -M main

# Add your GitHub repo (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/parallax.git

# Push
git push -u origin main
```

**Stuck on git?** 
- Make sure Git is installed: `git --version`
- If not: Download from [git-scm.com](https://git-scm.com)

**✅ Done when:** You see your code on GitHub at `github.com/YOUR-USERNAME/parallax`

---

## 🚂 STEP 2: DEPLOY TO RAILWAY (5 minutes)

### 2.1 Create Project
1. Go to **[railway.app](https://railway.app)** (you're already logged in)
2. Click **"New Project"** (purple button, center of screen)
3. Select **"Deploy from GitHub repo"**
4. You'll see your repositories - click **"parallax"**
5. Railway starts deploying automatically

**You'll see:**
- "Deploying..." (takes 2-3 minutes)
- Build logs scrolling
- Eventually: "Deployed successfully ✅"

### 2.2 Add Database
**While deployment is running:**
1. In your Railway project (same screen), click **"+ New"** (top right)
2. Select **"Database"**
3. Click **"Add PostgreSQL"**
4. Done! Railway auto-creates `DATABASE_URL` variable

**✅ Done when:** You see two services: "parallax" and "postgres"

### 2.3 Set Environment Variables
1. Click on your **"parallax"** service (the main app, not postgres)
2. Click **"Variables"** tab at top
3. Click **"+ New Variable"**
4. Add these TWO variables:

```
Variable 1:
Name: JWT_SECRET
Value: parallax-retro-future-secure-key-2077-synthwave-neon-grid

Variable 2:
Name: NODE_ENV
Value: production
```

**Important:** 
- `DATABASE_URL` should ALREADY be there (auto-added from postgres)
- `PORT` will be auto-set by Railway
- Just add the 2 above

5. After adding both, Railway will automatically redeploy (takes 1-2 minutes)

**✅ Done when:** Deployment finishes with green checkmark

---

## 🌐 STEP 3: GET YOUR URL (1 minute)

1. Click on your **"parallax"** service
2. Go to **"Settings"** tab
3. Scroll to **"Networking"** section
4. Click **"Generate Domain"**
5. Railway creates: `parallax-production-abc123.up.railway.app`

**Copy this URL** - this is your permanent app address!

**✅ Done when:** You have a URL you can click

---

## 🔐 STEP 4: FIRST LOGIN (2 minutes)

### 4.1 Open Your App
1. Click your Railway URL (or paste in browser)
2. You should see the **PARALLAX** login screen

**If you see "Application Error":**
- Wait 30 more seconds (app might still be starting)
- Check Railway logs (click service → "Deployments" → latest → "View Logs")
- Most common issue: DATABASE_URL not set (check Variables tab)

### 4.2 Login
```
Email: admin@parallax.local
Password: changeme123
```

**You're in!** 🎉

You should see the dashboard with:
- Health
- Sports  
- Escape Plan
- Budget

**✅ Done when:** You're looking at the Parallax dashboard

---

## 👥 STEP 5: CREATE YOUR ACCOUNTS (2 minutes)

**You need to create real accounts for you and your sister.**

### Method 1: Using Browser Console (Easiest)

1. In your Parallax app (while logged in), press **F12** (opens dev tools)
2. Click **"Console"** tab
3. Paste this code (replace with YOUR email/password/name):

```javascript
fetch('/api/auth/register', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    email: 'your-real-email@gmail.com',
    password: 'your-secure-password-123',
    name: 'Your Name'
  })
}).then(r => r.json()).then(d => console.log('Account created!', d))
```

4. Press **Enter**
5. You should see: `Account created! {token: "...", user: {...}}`

6. Repeat for sister's account (change email/password/name)

### Method 2: Using Command Line

```bash
# Your account (replace URL and details)
curl -X POST https://parallax-production-xxx.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"secure123","name":"Your Name"}'

# Sister's account
curl -X POST https://parallax-production-xxx.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"sister@email.com","password":"secure123","name":"Sister"}'
```

### 4.3 Test New Login
1. Logout (click logout in Parallax)
2. Login with YOUR new account
3. It works? Perfect!

### 4.4 Delete Default Admin (Optional but Recommended)
The `admin@parallax.local` account is insecure. Delete it.

**Option A: Using Railway Database**
1. Railway → click "postgres" database
2. Click "Data" tab
3. Click "Query" 
4. Run:
```sql
DELETE FROM users WHERE email = 'admin@parallax.local';
```

**Option B: Keep it** (just don't use it)

**✅ Done when:** You and sister both have accounts

---

## 🐱 STEP 6: ADD YOUR PETS (2 minutes)

You have 3 cats + 1 dog. Let's add them.

**In browser console (F12 → Console):**

```javascript
// Get your token first
const token = localStorage.getItem('token');

// Add Cat 1 (change name/details)
fetch('/api/escape-plan/pets', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Fluffy',
    type: 'cat',
    breed: 'Domestic Shorthair',
    age: 3,
    weight: 10
  })
}).then(r => r.json()).then(d => console.log('Cat added!', d))
```

**Repeat 3 times for your 3 cats, then once for your dog:**

```javascript
// Dog
fetch('/api/escape-plan/pets', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Max',
    type: 'dog',
    breed: 'Mixed',
    age: 5,
    weight: 50
  })
}).then(r => r.json()).then(d => console.log('Dog added!', d))
```

**✅ Done when:** All 4 pets are added

---

## ✅ YOU'RE DONE!

### What You Now Have:

✅ **Live app:** `https://parallax-production-xxx.up.railway.app`  
✅ **Your account:** Can login from any device  
✅ **Sister's account:** She can access with her login  
✅ **Database:** PostgreSQL with all your data  
✅ **Pets added:** 3 cats + 1 dog tracked  
✅ **Cost:** $0/month on Railway free tier

---

## 🎯 WHAT'S NEXT

### Start Using Parallax:

**Health Module:**
- Log your weight
- Track workouts
- Monitor meals
- Build habits

**Sports Module:**
- Training sessions
- Competition prep
- Recovery tracking

**Escape Plan Module:**
- Compare countries
- Track savings
- Plan pet relocation
- Set target dates

**Budget Module:**
- Track expenses
- Set category budgets
- Monitor savings goals
- Generate reports

### Share with Sister:
1. Send her the URL
2. Give her login credentials
3. She can access from any device
4. Data syncs automatically

---

## 📱 ACCESS FROM ANYWHERE

### Desktop:
- Bookmark your Railway URL
- Works in Chrome, Firefox, Safari, Edge

### Mobile:
- Open URL in phone browser
- **Add to home screen:**
  - **iPhone:** Safari → Share → "Add to Home Screen"
  - **Android:** Chrome → Menu (⋮) → "Add to Home Screen"
- Now it looks like a native app!

### Multiple Devices:
- Login from phone, tablet, laptop
- Data syncs across all devices
- Real-time updates

---

## 🔧 TROUBLESHOOTING

### "Application Error" when opening URL
**Solution:**
1. Go to Railway → "parallax" service → "Deployments"
2. Click latest deployment
3. Click "View Logs"
4. Look for error messages
5. Common fixes:
   - Wait 30 seconds (app starting up)
   - Check `DATABASE_URL` exists in Variables
   - Redeploy (Settings → "Redeploy")

### "Invalid credentials" when logging in
**Solution:**
- Make sure you're using correct email/password
- Email is case-sensitive
- Try default: `admin@parallax.local` / `changeme123`

### Can't create accounts
**Solution:**
- Make sure you're logged in first
- Check browser console for errors (F12)
- Verify Railway app is running (not crashed)

### Database errors
**Solution:**
- Check postgres service is running in Railway
- Verify `DATABASE_URL` variable exists
- Try restarting postgres (click service → restart)

### Build failed on Railway
**Solution:**
1. Check all files uploaded to GitHub
2. Verify package.json exists in root
3. Check Railway build logs for specific error
4. Try redeploying

---

## 💾 BACKUP YOUR DATA

**Set a reminder to backup monthly:**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Export database
railway run pg_dump $DATABASE_URL > parallax-backup-2024-12.sql

# Store somewhere safe (Google Drive, Dropbox, etc.)
```

---

## 🎊 CONGRATULATIONS!

You now have **PARALLAX** running in the cloud!

**Your retro-futuristic command center is live.**

- Track health and fitness
- Monitor budget and savings
- Plan your escape to another country
- Coordinate with your sister
- All from one sleek dashboard

**Time to deployment:** ~15 minutes  
**Monthly cost:** $0  
**Coolness factor:** 🔥🔥🔥

---

## 📞 NEED HELP?

Check these files in your project:
- **README.md** - Full technical docs
- **DEPLOYMENT_GUIDE.md** - Detailed deployment steps
- **PROJECT_SUMMARY.md** - What everything does

---

**Welcome to PARALLAX. Your perspective shift begins now.** 🌆✨
