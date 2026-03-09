# Inventory Management Secure Deployment Guide

## Overview
This guide provides secure deployment of your Inventory Management application using Docker, Docker Compose, and GitHub Actions. All sensitive environment variables are protected using GitHub Secrets.

## Prerequisites
- AWS Account with EC2 access
- GitHub Repository
- Docker Hub Account
- Basic Linux/SSH knowledge

## Security First Approach
- Environment variables are NEVER committed to git
- Sensitive data is stored in GitHub Secrets
- .env files are created dynamically during deployment
- SSH access is secured with key pairs

## Step 1: Local Development Setup

### 1.1 Copy Environment Examples
```bash
# Copy example files for local development
cp server/auth-service/.env.example server/auth-service/.env
cp server/product-service/.env.example server/product-service/.env
cp server/api-gateway/.env.example server/api-gateway/.env
cp client/.env.example client/.env
cp client/.env.production.example client/.env.production
```

### 1.2 Configure Local Environment
Edit the copied `.env` files with your local values:
- Use `mongodb://localhost:27017/inventory` for MONGO_URI
- Generate JWT_SECRET: `openssl rand -hex 32`
- Use your local email credentials
- Keep CLIENT_URL as `http://localhost:5173`

### 1.3 Test Locally
```bash
# Start local MongoDB
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Start all services
docker-compose up --build
```

## Step 2: EC2 Instance Setup

### 2.1 Launch EC2 Instance
1. AWS EC2 Console → Launch Instance
2. Ubuntu Server 22.04 LTS (t2.micro for free tier)
3. Security Group:
   - SSH (22) - Your IP only
   - HTTP (80) - 0.0.0.0/0
   - Custom TCP (4000) - 0.0.0.0/0
4. Download key pair (.pem file)

### 2.2 Setup EC2 Environment
```bash
# Connect to EC2
chmod 400 your-key.pem
ssh -i your-key.pem ubuntu@your-ec2-public-ip

# Install Docker and Docker Compose
sudo apt update && sudo apt upgrade -y
sudo apt install docker.io docker-compose -y
sudo systemctl start docker && sudo systemctl enable docker
sudo usermod -aG docker ubuntu

# Create app directory
sudo mkdir -p /opt/inventory-app
cd /opt/inventory-app
```

## Step 3: Environment Variables Reference

### 3.1 Complete Environment Variables List

#### **GitHub Secrets (Sensitive Data)**
These go into GitHub Repository → Settings → Secrets and variables → Actions:

| Variable | Value | Purpose |
|----------|-------|---------|
| `DOCKER_USERNAME` | Your Docker Hub username | CI/CD authentication |
| `DOCKER_PASSWORD` | Docker Hub password/token | CI/CD authentication |
| `EC2_HOST` | Your EC2 public IP | EC2 deployment target |
| `EC2_USER` | ubuntu | EC2 SSH username |
| `EC2_SSH_KEY` | Private SSH key content | EC2 SSH authentication |
| `JWT_SECRET` | Random string (openssl rand -hex 32) | API authentication |
| `EMAIL_USER` | Your email@gmail.com | Email service sender |
| `EMAIL_PASS` | Gmail app password | Email service auth |
| `CLIENT_URL` | http://your-ec2-public-ip | Frontend CORS origin |

#### **Non-Sensitive Variables (Auto-Created by Workflow)**
These are hardcoded in the GitHub Actions workflow and created on EC2:

| Service | Variable | Value | Purpose |
|---------|----------|-------|---------|
| **Auth Service** | MONGO_URI | mongodb://mongo:27017/inventory | Database connection |
| **Auth Service** | PORT | 4001 | Service port |
| **Auth Service** | CLIENT_URL | From secret | CORS origin |
| **Auth Service** | JWT_SECRET | From secret | Token signing |
| **Auth Service** | EMAIL_USER | From secret | Email sender |
| **Auth Service** | EMAIL_PASS | From secret | Email password |
| **Product Service** | MONGO_URI | mongodb://mongo:27017/inventory | Database connection |
| **Product Service** | PORT | 4002 | Service port |
| **Product Service** | CLIENT_URL | From secret | CORS origin |
| **Product Service** | JWT_SECRET | From secret | Token verification |
| **API Gateway** | PORT | 4000 | Gateway port |
| **API Gateway** | JWT_SECRET | From secret | Token verification |
| **API Gateway** | AUTH_SERVICE_URL | http://auth-service:4001 | Internal service URL |
| **API Gateway** | PRODUCT_SERVICE_URL | http://product-service:4002 | Internal service URL |
| **API Gateway** | CLIENT_URL | From secret | CORS origin |
| **Client** | VITE_API_BASE_URL | http://your-ec2-public-ip:4000 | API endpoint |

### 3.2 Generate Required Secrets
```bash
# JWT Secret (run locally)
openssl rand -hex 32
# Example output: a3f8e9c2d1b4f6a9e5c8d2f1b4a7e9c2d5f8a1b3e6f9c2d5a8b1e4f7a0c3

# Gmail App Password:
# 1. Go to Google Account: https://myaccount.google.com
# 2. Security → 2-Step Verification → App passwords
# 3. Select Mail and Device (Windows/Mac/etc.)
# 4. Copy the generated password
```

### 3.3 Add Secrets to GitHub Repository
Repository → Settings → Secrets and variables → Actions → New repository secret:

**Docker & AWS Secrets:**
- `DOCKER_USERNAME` - Your Docker Hub username (e.g., johndoe)
- `DOCKER_PASSWORD` - Your Docker Hub password or personal access token
- `EC2_HOST` - Your EC2 instance public IP (e.g., 54.123.45.67)
- `EC2_USER` - ubuntu (default for Ubuntu AMI)
- `EC2_SSH_KEY` - Content of ~/.ssh/github_actions_key (see step 3.4)

**Application Secrets:**
- `JWT_SECRET` - Generated random string from above
- `EMAIL_USER` - Your email address (e.g., your_email@gmail.com)
- `EMAIL_PASS` - Gmail app password from above
- `CLIENT_URL` - http://your-ec2-public-ip (e.g., http://54.123.45.67)

### 3.4 Setup SSH Access for GitHub Actions
```bash
# On your local machine - Generate SSH key pair
ssh-keygen -t rsa -b 4096 -C "github-actions" -f ~/.ssh/github_actions_key
# Press Enter for no passphrase

# View and copy PUBLIC key
cat ~/.ssh/github_actions_key.pub
# Output: ssh-rsa AAAAB3NzaC1... github-actions

# On EC2 - Add the public key (run these commands on EC2)
ssh ubuntu@your-ec2-ip
mkdir -p ~/.ssh
echo "ssh-rsa AAAAB3NzaC1... github-actions" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
exit

# On your local machine - Copy PRIVATE key for GitHub
cat ~/.ssh/github_actions_key
# Copy the entire output including "-----BEGIN RSA PRIVATE KEY-----" and "-----END RSA PRIVATE KEY-----"

# Paste this entire private key into GitHub secret EC2_SSH_KEY
```

## Step 4: Update Docker Compose

### 4.1 Update docker-compose.yml
Replace `your-dockerhub-username` with your actual Docker Hub username in all image tags:

```yaml
# Change all image lines from:
image: your-dockerhub-username/inventory-client:latest

# To your actual username:
image: johndoe/inventory-client:latest
image: johndoe/inventory-api-gateway:latest
image: johndoe/inventory-auth-service:latest
image: johndoe/inventory-product-service:latest
```

### 4.2 Where Each Variable is Used

**During GitHub Actions Workflow:**
The workflow automatically creates all .env files on EC2 using:
- GitHub Secrets (sensitive values)
- Hardcoded values (non-sensitive, internal URLs)

**Location of Created Files on EC2:**
```
/opt/inventory-app/
├── server/
│   ├── auth-service/.env           (created from secrets)
│   ├── product-service/.env        (created from secrets)
│   └── api-gateway/.env            (created from secrets)
├── client/.env.production          (created from secrets)
└── docker-compose.yml
```

**Example: What Each .env File Contains**

**server/auth-service/.env:**
```
MONGO_URI=mongodb://mongo:27017/inventory
PORT=4001
JWT_SECRET=${{ secrets.JWT_SECRET }}
EMAIL_USER=${{ secrets.EMAIL_USER }}
EMAIL_PASS=${{ secrets.EMAIL_PASS }}
CLIENT_URL=${{ secrets.CLIENT_URL }}
```

**server/product-service/.env:**
```
MONGO_URI=mongodb://mongo:27017/inventory
PORT=4002
JWT_SECRET=${{ secrets.JWT_SECRET }}
CLIENT_URL=${{ secrets.CLIENT_URL }}
```

**server/api-gateway/.env:**
```
PORT=4000
JWT_SECRET=${{ secrets.JWT_SECRET }}
AUTH_SERVICE_URL=http://auth-service:4001
PRODUCT_SERVICE_URL=http://product-service:4002
CLIENT_URL=${{ secrets.CLIENT_URL }}
```

**client/.env.production:**
```
VITE_API_BASE_URL=${{ secrets.CLIENT_URL }}:4000
```

## Step 5: Deploy

### 5.1 Commit and Push
```bash
git add .
git commit -m "Setup secure deployment configuration"
git push origin main
```

### 5.2 Monitor GitHub Actions
1. Repository → Actions tab
2. Watch deployment workflow
3. Check for success/failures

## Step 6: Verify Deployment

### 6.1 Check EC2 Services
```bash
# SSH to EC2
ssh ubuntu@your-ec2-ip
cd /opt/inventory-app

# Check running containers
docker-compose ps

# View logs
docker-compose logs -f

# Test endpoints
curl http://localhost:4000  # API Gateway
curl http://localhost      # Frontend
```

### 6.2 Access Application
- Frontend: http://your-ec2-public-ip
- API Gateway: http://your-ec2-public-ip:4000

## Security Checklist

- ✅ .env files excluded from git
- ✅ Sensitive data in GitHub Secrets
- ✅ SSH keys properly configured
- ✅ No hardcoded credentials
- ✅ JWT secrets are random and strong
- ✅ Email uses app passwords
- ✅ CORS configured for production
- ✅ Security groups restrict access

## Troubleshooting

### Common Issues:
1. **SSH Permission Denied**: Check authorized_keys and key permissions
2. **Secrets Not Found**: Verify all GitHub secrets are set
3. **CORS Errors**: Ensure CLIENT_URL matches your domain
4. **Database Connection**: Check MongoDB container is running
5. **Port Conflicts**: Verify ports are available

### Useful Commands:
```bash
# Restart services
docker-compose restart

# Rebuild specific service
docker-compose build auth-service
docker-compose up -d auth-service

# View service logs
docker-compose logs -f service-name

# Clean up
docker system prune -a
docker-compose down -v
```

## Maintenance

### Updating Secrets:
1. Update GitHub secret value
2. Push any code change to trigger redeployment

### Scaling Considerations:
- Add load balancer for multiple EC2 instances
- Use AWS RDS for production database
- Implement health checks and monitoring
- Consider AWS Systems Manager for advanced secret management

This setup provides enterprise-grade security with automated deployment capabilities.