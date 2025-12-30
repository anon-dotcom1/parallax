# Family Hub - Comprehensive Management System

A full-stack web application for managing health, sports, budget, and escape planning with country comparison tools.

## Features

### 🏥 Health Module
- Body metrics tracking (weight, body fat %, muscle mass)
- Workout logging (strength, cardio, sports)
- Meal tracking with macros
- Habit tracking with streaks
- Progress photos (encrypted)

### 🏃 Sports Module
- Training calendar
- Performance metrics
- Competition tracking
- Recovery logging (sleep, soreness, energy)

### 🌍 Escape Plan Module
- Country comparison (195 countries)
- Cost of living data
- Pet relocation planner (3 cats + 1 dog)
- Visa requirements
- Savings calculator with timeline
- Detailed breakdown per destination

### 💰 Budget Module
- Comprehensive expense tracking
- Shared expenses between users
- Budget limits by category
- Savings goals with progress
- Monthly summaries and reports
- Receipt uploads

## Tech Stack

**Backend:**
- Node.js + Express
- PostgreSQL database
- JWT authentication
- bcrypt password hashing

**Frontend:**
- React 18 + Vite
- TailwindCSS
- Recharts for visualizations
- React Router

**Deployment:**
- Railway (cloud hosting)
- Docker containerization
- Raspberry Pi ready

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd family-hub
```

2. **Install dependencies**
```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your database credentials and JWT secret
```

4. **Set up database**
```bash
npm run db:setup
```

5. **Start development servers**
```bash
# Terminal 1: Start backend
npm run dev

# Terminal 2: Start frontend
cd client
npm run dev
```

6. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

### Default Login
- Email: `admin@familyhub.local`
- Password: `changeme123`

**⚠️ Change these credentials immediately!**

## Deployment to Railway

### Step 1: Prepare Your Repository
1. Push all code to GitHub (public or private repo)
2. Make sure `.env` is in `.gitignore` (it already is)

### Step 2: Railway Setup
1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your `family-hub` repository
6. Railway will auto-detect the configuration

### Step 3: Add Database
1. In your Railway project, click "New"
2. Select "Database" → "PostgreSQL"
3. Railway will create a database and provide `DATABASE_URL`

### Step 4: Set Environment Variables
In Railway project settings, add:
```
DATABASE_URL=(auto-filled by Railway)
JWT_SECRET=your-super-secret-key-min-32-characters
NODE_ENV=production
PORT=3000
```

### Step 5: Deploy
1. Railway will automatically deploy
2. Wait 3-5 minutes for build
3. Get your URL: `https://family-hub-production-xxxx.up.railway.app`

### Step 6: Initialize Database
After first deployment, run setup:
1. Go to Railway project → "Deployments"
2. Click on your deployment → "View Logs"
3. Or use Railway CLI to run: `npm run db:setup`

## Migration to Raspberry Pi

### Hardware Requirements
- Raspberry Pi 4 (4GB+ RAM recommended)
- MicroSD card (32GB+)
- Power supply
- Ethernet cable (recommended) or WiFi

### Migration Steps

1. **Export data from Railway**
```bash
# Add export endpoint or use pg_dump
pg_dump $DATABASE_URL > backup.sql
```

2. **Set up Raspberry Pi**
```bash
# Install Docker
curl -sSL https://get.docker.com | sh
sudo usermod -aG docker pi

# Install Docker Compose
sudo apt-get install docker-compose
```

3. **Transfer and Deploy**
```bash
# Copy files to Pi
scp -r family-hub pi@raspberrypi.local:~/

# On Pi
cd ~/family-hub
docker-compose up -d
```

4. **Import data**
```bash
# Restore database
docker exec -i family-hub-db psql -U postgres < backup.sql
```

5. **Access locally**
- On home network: `http://raspberrypi.local:3000`
- Or use Pi's IP address: `http://192.168.1.x:3000`

## API Documentation

### Authentication
```
POST /api/auth/register
POST /api/auth/login
```

### Health
```
GET    /api/health/metrics
POST   /api/health/metrics
GET    /api/health/workouts
POST   /api/health/workouts
GET    /api/health/meals
POST   /api/health/meals
GET    /api/health/habits
POST   /api/health/habits
PATCH  /api/health/habits/:id/complete
```

### Sports
```
GET    /api/sports/training
POST   /api/sports/training
GET    /api/sports/competitions
POST   /api/sports/competitions
GET    /api/sports/recovery
POST   /api/sports/recovery
```

### Budget
```
GET    /api/budget/transactions
POST   /api/budget/transactions
DELETE /api/budget/transactions/:id
GET    /api/budget/budgets
POST   /api/budget/budgets
PUT    /api/budget/budgets/:id
GET    /api/budget/savings-goals
POST   /api/budget/savings-goals
PATCH  /api/budget/savings-goals/:id
GET    /api/budget/summary?month=12&year=2024
```

### Escape Plan
```
GET    /api/escape-plan/countries
GET    /api/escape-plan/countries/:id
GET    /api/escape-plan/countries/:id/pets
GET    /api/escape-plan/comparisons
POST   /api/escape-plan/comparisons
DELETE /api/escape-plan/comparisons/:id
GET    /api/escape-plan/relocation-plans
POST   /api/escape-plan/relocation-plans
PUT    /api/escape-plan/relocation-plans/:id
GET    /api/escape-plan/pets
POST   /api/escape-plan/pets
```

## User Management

### Creating Additional Users
```javascript
// Use the registration endpoint
POST /api/auth/register
{
  "email": "sister@example.com",
  "password": "secure-password",
  "name": "Sister"
}
```

### Password Reset
Currently manual - connect to database:
```sql
-- Generate new hash
UPDATE users SET password_hash = crypt('new-password', gen_salt('bf')) 
WHERE email = 'user@example.com';
```

## Data Export/Import

### Export All Data
```bash
# Export database
pg_dump $DATABASE_URL > family_hub_backup.sql

# Export uploaded files (if any)
tar -czf uploads_backup.tar.gz uploads/
```

### Import Data
```bash
# Import database
psql $DATABASE_URL < family_hub_backup.sql

# Import files
tar -xzf uploads_backup.tar.gz
```

## Troubleshooting

### Database Connection Issues
```bash
# Check DATABASE_URL format
postgresql://username:password@host:port/database

# Test connection
psql $DATABASE_URL
```

### Port Already in Use
```bash
# Change PORT in .env
PORT=3001

# Or kill process using port
lsof -ti:3000 | xargs kill -9
```

### Railway Deployment Failed
1. Check logs in Railway dashboard
2. Verify all environment variables are set
3. Ensure DATABASE_URL is correct
4. Check build logs for errors

## Security Notes

- All passwords are hashed with bcrypt
- JWT tokens expire after 7 days
- Database connections use SSL in production
- CORS configured for security
- Helmet.js for HTTP headers
- Input validation on all endpoints

## Contributing

This is a private family project, but improvements welcome:
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

Private use only.

## Support

For issues or questions:
- Check the troubleshooting section
- Review API documentation
- Check Railway logs

## Roadmap

### Phase 1 (Current)
- ✅ Core modules (Health, Sports, Budget, Escape Plan)
- ✅ Authentication
- ✅ Database schema
- ✅ Railway deployment ready

### Phase 2 (Future)
- [ ] Populate 195 countries data
- [ ] Real-time cost of living API integration
- [ ] Mobile app (React Native)
- [ ] Automated backups
- [ ] Email notifications
- [ ] Calendar integration
- [ ] Data visualization dashboard

### Phase 3 (Optional)
- [ ] Raspberry Pi auto-setup script
- [ ] Offline mode
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] Export to PDF reports

## Credits

Built with:
- React
- Node.js
- PostgreSQL
- TailwindCSS
- Railway
