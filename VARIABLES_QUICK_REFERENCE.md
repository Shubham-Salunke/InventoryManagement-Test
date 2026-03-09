# Quick Reference: Environment Variables Usage

## 📊 All Variables at a Glance

| Variable | Source | Where Used | Created On | Value Example |
|----------|--------|-----------|----------|---|
| DOCKER_USERNAME | GitHub Secret | CI/CD build push | Local | johndoe |
| DOCKER_PASSWORD | GitHub Secret | CI/CD build push | Local | dckr_pat_xxxxx |
| EC2_HOST | GitHub Secret | SSH deployment | Local | 54.123.45.67 |
| EC2_USER | GitHub Secret | SSH deployment | Local | ubuntu |
| EC2_SSH_KEY | GitHub Secret | SSH authentication | Local | -----BEGIN RSA KEY----- |
| JWT_SECRET | GitHub Secret | .env files | EC2 | a3f8e9c2d1b4f6a9e5c8... |
| EMAIL_USER | GitHub Secret | auth-service/.env | EC2 | your@gmail.com |
| EMAIL_PASS | GitHub Secret | auth-service/.env | EC2 | abcd efgh ijkl mnop |
| CLIENT_URL | GitHub Secret | All .env files | EC2 | http://54.123.45.67 |
| MONGO_URI | Hardcoded | auth+product/.env | EC2 | mongodb://mongo:27017/inventory |
| PORT | Hardcoded | Each service/.env | EC2 | 4001, 4002, 4000 |
| AUTH_SERVICE_URL | Hardcoded | api-gateway/.env | EC2 | http://auth-service:4001 |
| PRODUCT_SERVICE_URL | Hardcoded | api-gateway/.env | EC2 | http://product-service:4002 |
| VITE_API_BASE_URL | Computed | client/.env.production | EC2 | http://54.123.45.67:4000 |

---

## 🔍 Where Each Variable Gets Used

### **GitHub Secrets (Set Once in GitHub)**

#### **Docker Hub Authentication**
- `DOCKER_USERNAME` → `.github/workflows/deploy.yml` (line: docker login)
- `DOCKER_PASSWORD` → `.github/workflows/deploy.yml` (line: docker login)

#### **EC2 SSH Access**
- `EC2_HOST` → `.github/workflows/deploy.yml` (line: ssh host)
- `EC2_USER` → `.github/workflows/deploy.yml` (line: ssh user)
- `EC2_SSH_KEY` → `.github/workflows/deploy.yml` (line: ssh key)

#### **Application Secrets**
- `JWT_SECRET` → `.github/workflows/deploy.yml` (created in all 3 .env files)
- `EMAIL_USER` → `.github/workflows/deploy.yml` (created in auth-service/.env)
- `EMAIL_PASS` → `.github/workflows/deploy.yml` (created in auth-service/.env)
- `CLIENT_URL` → `.github/workflows/deploy.yml` (created in all .env files)

---

### **Workflow-Created .env Files on EC2**

#### **server/auth-service/.env** (Created by workflow)
```bash
# Command in workflow:
cat > server/auth-service/.env << EOF
MONGO_URI=mongodb://mongo:27017/inventory
PORT=4001
JWT_SECRET=${{ secrets.JWT_SECRET }}
EMAIL_USER=${{ secrets.EMAIL_USER }}
EMAIL_PASS=${{ secrets.EMAIL_PASS }}
CLIENT_URL=${{ secrets.CLIENT_URL }}
EOF
```

**Used By:**
- Node.js process in auth-service container
- Picked up by server.js via require('dotenv').config()
- CORS origin set to CLIENT_URL
- MongoDB connected via MONGO_URI
- Email sender credentials for auth emails
- JWT secrets for token generation

#### **server/product-service/.env** (Created by workflow)
```bash
cat > server/product-service/.env << EOF
MONGO_URI=mongodb://mongo:27017/inventory
PORT=4002
JWT_SECRET=${{ secrets.JWT_SECRET }}
CLIENT_URL=${{ secrets.CLIENT_URL }}
EOF
```

**Used By:**
- Node.js process in product-service container
- CORS origin set to CLIENT_URL
- MongoDB connected via MONGO_URI
- JWT secrets for token verification

#### **server/api-gateway/.env** (Created by workflow)
```bash
cat > server/api-gateway/.env << EOF
PORT=4000
JWT_SECRET=${{ secrets.JWT_SECRET }}
AUTH_SERVICE_URL=http://auth-service:4001
PRODUCT_SERVICE_URL=http://product-service:4002
CLIENT_URL=${{ secrets.CLIENT_URL }}
EOF
```

**Used By:**
- Node.js process in api-gateway container
- CORS origin set to CLIENT_URL
- Service proxy targets (internal Docker network)
- JWT secrets for proxy middleware

#### **client/.env.production** (Created by workflow)
```bash
cat > client/.env.production << EOF
VITE_API_BASE_URL=${{ secrets.CLIENT_URL }}:4000
EOF
```

**Used By:**
- Built into React app during docker build
- Vite reads as VITE_API_BASE_URL during build time
- axios baseURL in src/services/api.js uses this:
  ```javascript
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000"
  ```

---

## 🔄 Data Flow

### **1. Local Development**
```
Developer
  ↓
Copies .env.example → .env
  ↓
Fills values manually
  ↓
docker-compose up --build
  ↓
Services read from .env files
  ↓
Runs on http://localhost
```

### **2. GitHub Push**
```
Developer: git push origin main
  ↓
GitHub Webhook triggered
  ↓
.github/workflows/deploy.yml starts
```

### **3. GitHub Actions**
```
Build Phase:
  ├─ Read GitHub Secrets
  └─ Build 4 Docker images

Push Phase:
  ├─ Docker Hub login (DOCKER_USERNAME, DOCKER_PASSWORD)
  ├─ Push client:latest
  ├─ Push api-gateway:latest
  ├─ Push auth-service:latest
  └─ Push product-service:latest

Deploy Phase:
  ├─ SSH to EC2 (EC2_HOST, EC2_USER, EC2_SSH_KEY)
  ├─ Create server/auth-service/.env (using secrets)
  ├─ Create server/product-service/.env (using secrets)
  ├─ Create server/api-gateway/.env (using secrets)
  ├─ Create client/.env.production (using secrets)
  ├─ docker-compose pull
  └─ docker-compose up -d
```

### **4. EC2 Running**
```
Docker Compose starts
  ├─ MongoDB container (port 27017)
  ├─ Auth Service (port 4001, reads .env)
  ├─ Product Service (port 4002, reads .env)
  ├─ API Gateway (port 4000, reads .env)
  └─ Client/Nginx (port 80, uses .env.production)

User Accesses
  ├─ http://your-ec2-ip → Nginx serves React
  └─ http://your-ec2-ip:4000 → API Gateway for backend
```

---

## 📝 Step-by-Step Setup Checklist

### **Before Pushing Code**

- [ ] Update docker-compose.yml with your Docker Hub username
- [ ] Update client/.env for local development
- [ ] Test locally: `docker-compose up --build`

### **GitHub Configuration**

- [ ] Add GitHub Secret: DOCKER_USERNAME
- [ ] Add GitHub Secret: DOCKER_PASSWORD
- [ ] Add GitHub Secret: EC2_HOST
- [ ] Add GitHub Secret: EC2_USER
- [ ] Add GitHub Secret: EC2_SSH_KEY
- [ ] Add GitHub Secret: JWT_SECRET
- [ ] Add GitHub Secret: EMAIL_USER
- [ ] Add GitHub Secret: EMAIL_PASS
- [ ] Add GitHub Secret: CLIENT_URL

### **EC2 Setup**

- [ ] Launch EC2 instance
- [ ] Install Docker and Docker Compose
- [ ] Generate SSH key pair
- [ ] Add public key to authorized_keys
- [ ] Create /opt/inventory-app directory

### **Deployment**

- [ ] Commit all changes
- [ ] Push to main branch
- [ ] Monitor GitHub Actions workflow
- [ ] Check EC2: `docker-compose ps`
- [ ] Test: `curl http://your-ec2-ip`

---

## 🚨 Common Mistakes to Avoid

| Mistake | Impact | Solution |
|---------|--------|----------|
| Commit .env files | Secrets exposed | Already in .gitignore ✅ |
| Wrong CLIENT_URL format | CORS fails | Use http://ip-address (no trailing slash) |
| Missing GitHub secrets | Workflow fails | Add all 9 secrets before pushing |
| Wrong Docker Hub username | Images not pushed | Use exact username from Docker Hub |
| SSH key permissions | SSH fails | chmod 600 authorized_keys on EC2 |
| Port conflicts | Services won't start | Check ports 80, 4000-4002 available |

---

## ✅ Verification Commands

### **Check EC2 Deployment**
```bash
# SSH to EC2
ssh ubuntu@your-ec2-ip

# Check containers
docker-compose ps

# Check logs
docker-compose logs -f

# Check .env files exist
ls -la server/*/。env

# Test services
curl http://localhost:4000  # API Gateway
curl http://localhost      # Frontend
```

### **Check GitHub Actions**
```bash
# View workflow
GitHub → Actions → Deploy to EC2

# Check for errors in logs
Click on workflow run → Check job output
```

---

## 📚 Quick Links

- **Deployment Guide:** README_DEPLOY.md
- **All Files Summary:** DEPLOYMENT_SETUP_SUMMARY.md
- **Directory Structure:** DIRECTORY_STRUCTURE.md
- **GitHub Actions:** .github/workflows/deploy.yml
- **Docker Compose:** docker-compose.yml