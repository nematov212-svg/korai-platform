# Ko'rAI — Production Deployment Guide

Ushbu qo‘llanma Ko'rAI platformasini serverda (Linux / Ubuntu / Debian VPS yoki Bulutli hostinglarda) xavfsiz va samarali deploy qilish bo‘yicha ko‘rsatmalarni o‘z ichiga oladi.

---

## 1. Minimal Server Talablari
- **OS**: Ubuntu 22.04 LTS yoki 24.04 LTS
- **CPU**: 2 vCPU
- **RAM**: 4 GB (Sharp image rendering va multimodal bufferlar uchun)
- **Disk**: 25 GB SSD / NVMe
- **Dasturlar**: Node.js v20+ / v22+, PostgreSQL 15+, Nginx, PM2, Certbot (SSL)

---

## 2. Docker va Docker Compose orqali Deploy (Tavsiya etiladi)

Loyiha uchun `docker-compose.yml` tayyorlangan:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_USER: korai_admin
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: koraidb
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    restart: always
    ports:
      - "5001:5001"
    environment:
      NODE_ENV: production
      PORT: 5001
      DATABASE_URL: postgresql://korai_admin:${DB_PASSWORD}@postgres:5432/koraidb?schema=public
      JWT_ACCESS_SECRET: ${JWT_ACCESS_SECRET}
      JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET}
      GEMINI_API_KEY: ${GEMINI_API_KEY}
    depends_on:
      - postgres
    volumes:
      - uploads_volume:/app/uploads

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    restart: always
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  pgdata:
  uploads_volume:
```

Ishga tushirish:
```bash
docker compose up -d --build
```

---

## 3. Ubuntu VPS-da Nginx va PM2 orqali Deploy

### 1-qadam: Node.js va PostgreSQL o‘rnatish
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs postgresql postgresql-contrib nginx
```

### 2-qadam: Loyihani klonlash va build qilish
```bash
git clone https://github.com/your-org/korai.git /var/www/korai
cd /var/www/korai
npm install
npm run build
```

### 3-qadam: Prisma migratsiyasini bajarish
```bash
cd backend
npx prisma migrate deploy
```

### 4-qadam: PM2 orqali backendni ishga tushirish
```bash
sudo npm install -g pm2
pm2 start dist/index.js --name "korai-backend"
pm2 save
pm2 startup
```

### 5-qadam: Nginx konfiguratsiyasi
`/etc/nginx/sites-available/korai.uz`:
```nginx
server {
    listen 80;
    server_name korai.uz www.korai.uz;

    # Frontend Static SPA
    location / {
        root /var/www/korai/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API Proxy
    location /api/ {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Uploads Static Serving
    location /uploads/ {
        proxy_pass http://localhost:5001/uploads/;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```

### 6-qadam: SSL Sertifikatini faollashtirish (Let's Encrypt)
```bash
sudo certbot --nginx -d korai.uz -d www.korai.uz
```
