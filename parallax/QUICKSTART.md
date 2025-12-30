# 🚀 QUICK START - Family Hub

## You Have Railway Account ✅

Now let's get this deployed!

---

## STEP 1: Get the Code (5 minutes)

### Download the Project
I'll give you access to the complete `family-hub` folder.

### Upload to GitHub
1. Go to [github.com/new](https://github.com/new)
2. Repository name: `family-hub`
3. Make it **Private** ✅
4. Click "Create repository"

5. On your computer, in the `family-hub` folder:
```bash
git init
git add .
git commit -m "Initial commit - Family Hub"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/family-hub.git
git push -u origin main
```

---

## STEP 2: Deploy to Railway (3 minutes)

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose "family-hub"
5. Railway starts building...

---

## STEP 3: Add Database (1 minute)

1. In your Railway project, click "+ New"
2. Select "Database"
3. Click "PostgreSQL"
4. Done! DATABASE_URL is auto-configured

---

## STEP 4: Set Environment Variables (2 minutes)

1. Click on your "family-hub" service
2. Go to "Variables" tab
3. Add these variables:

```
JWT_SECRET=your-super-secret-random-key-min-32-characters-long
NODE_ENV=production
```

4. Click "Redeploy"

---

## STEP 5: Get Your URL (1 minute)

1. Click "family-hub" service
2. Go to "Settings"
3. Under "Networking", click "Generate Domain"
4. Copy your URL: `https://family-hub-production-xxx.up.railway.app`

---

## STEP 6: First Login (2 minutes)

1. Open your Railway URL in browser
2. Login with:
   - Email: `admin@familyhub.local`
   - Password: `changeme123`

3. You're in! 🎉

---

## STEP 7: Create Your Accounts

### Via UI (if available):
- Look for "Register" or "Settings"
- Create your account
- Create sister's account

### Via API:
```bash
# Your account
curl -X POST https://YOUR-URL.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"secure123","name":"Your Name"}'

# Sister's account
curl -X POST https://YOUR-URL.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"sister@email.com","password":"secure123","name":"Sister Name"}'
```

---

## DONE! ✅

You now have:
- ✅ Live web app
- ✅ Secure database
- ✅ Two user accounts
- ✅ Access from anywhere

**Next Steps:**
- Add your 4 pets (3 cats, 1 dog)
- Start tracking health data
- Add budget categories
- Compare countries for escape plan

---

## Troubleshooting

### "Application Error"
- Check Railway logs
- Verify DATABASE_URL exists
- Check JWT_SECRET is set

### Can't Login
- Database might not be initialized
- Check logs for errors
- Try redeploying

### Build Failed
- Check all files uploaded to GitHub
- Verify package.json exists
- Check Railway build logs

---

## Support

Check these files:
- `README.md` - Full documentation
- `DEPLOYMENT_GUIDE.md` - Detailed deployment steps

---

**Total Time:** 15 minutes  
**Cost:** $0/month (free tier)  
**Status:** Production-ready

**Your URL:** (get from Railway after deployment)

🎉 Congratulations! Your Family Hub is live!
