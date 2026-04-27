# Deployment Guide

## Prerequisites

- GitHub repository set up
- Accounts on hosting platforms (Heroku, Netlify, Vercel, or AWS)
- Environment variables ready
- MongoDB Atlas account for cloud database

## Backend Deployment

### Option 1: Heroku

**Steps:**

1. Install Heroku CLI and login:
```bash
npm install -g heroku
heroku login
```

2. Create a Heroku app:
```bash
cd backend
heroku create your-app-name
```

3. Set environment variables:
```bash
heroku config:set MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/career-mentorship
heroku config:set JWT_SECRET=your_jwt_secret_key
heroku config:set NODE_ENV=production
```

4. Add Procfile:
```
web: node src/index.js
```

5. Deploy:
```bash
git push heroku main
```

### Option 2: AWS EC2

**Steps:**

1. Launch EC2 instance (Node.js AMI)
2. Connect via SSH
3. Install Node.js and npm
4. Clone repository
5. Set up environment variables
6. Start application with PM2:
```bash
npm install -g pm2
pm2 start src/index.js --name "career-mentorship"
pm2 startup
pm2 save
```

7. Configure security groups to allow port 5000

### Option 3: DigitalOcean

**Steps:**

1. Create Droplet (Ubuntu)
2. SSH into droplet
3. Install Node.js:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

4. Install PM2 and Nginx
5. Clone and set up application
6. Configure Nginx as reverse proxy
7. Set up SSL with Let's Encrypt

## Frontend Deployment

### Option 1: Netlify

**Via Git:**

1. Build the project:
```bash
cd frontend
npm run build
```

2. Connect GitHub repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `build`
5. Add environment variables:
```
REACT_APP_API_URL=https://your-backend-url
```

6. Deploy

**Via CLI:**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

### Option 2: Vercel

**Steps:**

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
cd frontend
vercel
```

3. Set up environment variables in Vercel dashboard:
```
REACT_APP_API_URL=https://your-backend-url
```

### Option 3: AWS S3 + CloudFront

**Steps:**

1. Build frontend:
```bash
npm run build
```

2. Create S3 bucket
3. Upload build folder contents to S3
4. Set bucket policy for public access
5. Create CloudFront distribution
6. Point custom domain to CloudFront

### Option 4: GitHub Pages

**Steps:**

1. Add to package.json:
```json
"homepage": "https://your-username.github.io/repository-name"
```

2. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

3. Add scripts to package.json:
```json
"predeploy": "npm run build",
"deploy": "gh-pages -d build"
```

4. Deploy:
```bash
npm run deploy
```

## Database Deployment

### MongoDB Atlas

**Steps:**

1. Create MongoDB Atlas account
2. Create a cluster
3. Add IP whitelist
4. Create database user
5. Get connection string
6. Use in backend `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/career-mentorship
```

## Production Checklist

### Backend

- [ ] Change JWT_SECRET to a strong random string
- [ ] Set NODE_ENV to production
- [ ] Use MongoDB Atlas instead of local database
- [ ] Enable HTTPS
- [ ] Add CORS whitelist (only frontend URL)
- [ ] Implement rate limiting
- [ ] Set up logging
- [ ] Enable security headers
- [ ] Add input sanitization
- [ ] Set up backup strategy
- [ ] Monitor error logs
- [ ] Enable database indexing

### Frontend

- [ ] Build optimization with code splitting
- [ ] Set correct API_URL for production
- [ ] Enable PWA features
- [ ] Set up analytics
- [ ] Configure CDN
- [ ] Enable GZIP compression
- [ ] Set security headers
- [ ] Test performance
- [ ] Enable caching headers
- [ ] Set up monitoring

## Environment Variables

### Backend Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/career-mentorship
JWT_SECRET=long_random_secret_key_min_32_chars
```

### Frontend Production
```env
REACT_APP_API_URL=https://your-backend-domain.com/api
```

## SSL/HTTPS

### Let's Encrypt (Free)

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d your-domain.com
```

### Nginx Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    location / {
        proxy_pass http://localhost:5000;
    }
}
```

## Monitoring & Maintenance

### Application Monitoring

- Use PM2 Plus for process monitoring
- Set up error tracking (Sentry, Rollbar)
- Monitor API response times
- Track database performance

### Database Monitoring

- Use MongoDB Atlas dashboard
- Monitor connection pools
- Check query performance
- Review oplog size

### Security Monitoring

- Regular security audits
- Monitor error logs
- Track failed login attempts
- Review access logs

## Scaling Considerations

- Use load balancer (Nginx, HAProxy)
- Implement horizontal scaling
- Use caching (Redis)
- Implement CDN for static assets
- Database replication/sharding

## Continuous Integration/Deployment

### GitHub Actions Example

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to production
        run: |
          ssh user@server "cd /app && git pull && npm install && npm run build"
```

## Troubleshooting

### Backend won't start
- Check environment variables
- Verify MongoDB connection
- Check port availability
- Review error logs

### Frontend not connecting to backend
- Verify backend URL is correct
- Check CORS settings
- Verify API routes exist
- Check Network tab in DevTools

### HTTPS certificate errors
- Renew certificates with certbot
- Check certificate expiration
- Verify DNS records

## Support & Additional Resources

- [Heroku Documentation](https://devcenter.heroku.com/)
- [AWS EC2 Guide](https://docs.aws.amazon.com/ec2/)
- [Netlify Docs](https://docs.netlify.com/)
- [MongoDB Atlas Help](https://docs.atlas.mongodb.com/)
- [Let's Encrypt](https://letsencrypt.org/)

---

**Remember:** Always test in a staging environment before deploying to production!
