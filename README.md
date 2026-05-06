# TrailTales

A travel-themed full-stack blog platform. MERN stack, single-container deploy.

- **Frontend:** React 18 + Vite + React Router
- **Backend:** Node.js + Express + Mongoose
- **Database:** MongoDB Atlas
- **Auth:** JWT (signup, login — no email/forgot-password as requested)
- **CRUD:** Posts (title, content, cover image URL, location, tags). Author-only edit/delete.
- **Single container:** Express serves both `/api/*` and the built React app from one process. No internal CORS needed. All runtime config lives in **one** `.env` file.

---

## 1. MongoDB Atlas — what to do

1. Go to https://www.mongodb.com/cloud/atlas and sign in (or create a free account).
2. **Create a project** (e.g. "TrailTales").
3. **Build a cluster** → pick **Free / M0** → choose any region close to your EC2 instance (e.g. `ap-south-1` if your EC2 is in Mumbai).
4. After the cluster is created, go to **Database Access** in the left sidebar:
   - Click **Add new database user**.
   - Auth method: **Password**.
   - Username: e.g. `trailtales_app`.
   - Password: pick a strong one (or click *Autogenerate*). **Copy it now.**
   - Built-in role: **Read and write to any database** (or scope to the `trailtales` DB only).
5. Go to **Network Access** → **Add IP Address**:
   - For a stable EC2 with a fixed Elastic IP: add **only** that IP for safety.
   - **Easiest while your EC2 IP changes:** click **Allow access from anywhere** (`0.0.0.0/0`). The DB user/password is what protects you. You can tighten this later.
6. Go to **Database** → click **Connect** on your cluster → **Drivers** → **Node.js**.
   - Copy the connection string. It looks like:
     ```
     mongodb+srv://trailtales_app:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - Replace `<password>` with the password you set, and add the database name `trailtales` before the `?`:
     ```
     mongodb+srv://trailtales_app:YOURPASS@cluster0.xxxxx.mongodb.net/trailtales?retryWrites=true&w=majority
     ```
   - If your password has special characters (`@`, `:`, `/`, `?`, `#`), URL-encode them.
7. Paste this string into your `.env` as `MONGODB_URI`.

> The `trailtales` database will be auto-created on first write — you don't need to create collections manually.

---

## 2. Configure `.env`

Copy the example and edit:

```bash
cp .env.example .env
```

Then fill in:

| Variable        | What it's for                                                                 |
|-----------------|-------------------------------------------------------------------------------|
| `NODE_ENV`      | `production` on EC2, `development` locally                                    |
| `PORT`          | Port the container listens on (default `5000`)                                |
| `MONGODB_URI`   | Atlas connection string from step 1                                           |
| `JWT_SECRET`    | Long random string. Generate one: `openssl rand -base64 48`                   |
| `JWT_EXPIRES_IN`| Token lifetime (`7d`, `1h`, …)                                                |
| `CORS_ORIGIN`   | `*` while testing, or comma-separated list of allowed origins                 |
| `PUBLIC_URL`    | Public URL of the deployment (e.g. `http://<ec2-ip>:5000`)                    |

**This is the single file that needs to change when your EC2 IP changes.** Nothing in the codebase references the IP — both the React app and the API live on the same origin, and CORS for *external* clients is read from `CORS_ORIGIN` only.

---

## 3. Run locally (without Docker)

```bash
npm run install:all          # installs root, server, client deps
npm run build:client         # builds React into client/dist
npm start                    # starts Express on PORT (serves API + React)
```

Or run dev mode with hot reload:

```bash
npm run dev                  # server :5000 + Vite client :5173 with /api proxy
```

Open http://localhost:5000 (prod build) or http://localhost:5173 (dev).us

---

## 4. Build & push to Docker Hub

Do this on your **local machine** every time you have new code to ship.

### Step 1 — build the image

```bash
# From the project root (where the Dockerfile lives)
docker build -t <your-dockerhub-username>/trailtales:latest .
```

### Step 2 — log in to Docker Hub (first time only)

```bash
docker login
# enter your Docker Hub username + password / access token
```

### Step 3 — push to Docker Hub

```bash
docker push <your-dockerhub-username>/trailtales:latest
```

The image is now on Docker Hub, ready to pull from anywhere.

### Useful local commands

| Command | What it does |
|---|---|
| `docker build -t <user>/trailtales:latest .` | Build the image |
| `docker push <user>/trailtales:latest` | Push to Docker Hub |
| `docker images` | List local images |
| `docker logs -f trailtales` | Tail running container logs |
| `docker stop trailtales` | Stop the container |
| `docker rm trailtales` | Remove the container |

---

## 5. Deploy on AWS EC2

### First-time EC2 setup (do once)

1. Launch an EC2 instance — Ubuntu 22.04, `t3.small` or larger.
2. **Security Group inbound rules:**
   - SSH (22) from your IP
   - Custom TCP **5000** from `0.0.0.0/0` (or 80/443 if you put Nginx in front later)
3. SSH in and install Docker:
   ```bash
   sudo apt update && sudo apt install -y docker.io
   sudo systemctl enable --now docker
   sudo usermod -aG docker ubuntu   # log out and back in after this
   ```
4. Create the app directory and set up your `.env`:
   ```bash
   mkdir ~/trailtales && cd ~/trailtales
   nano .env   # paste MONGODB_URI, JWT_SECRET, CORS_ORIGIN, PUBLIC_URL, PORT
   ```
5. Copy `run.sh` to the instance (from your local machine):
   ```bash
   scp trailtales/run.sh ubuntu@<ec2-ip>:~/trailtales/
   ```
   Then on EC2 make it executable:
   ```bash
   chmod +x ~/trailtales/run.sh
   ```

### Every deploy after that (the normal flow)

**On your local machine** — build and push new code:
```bash
docker build -t <your-dockerhub-username>/trailtales:latest .
docker push  <your-dockerhub-username>/trailtales:latest
```

**On your EC2 instance** — pull and run:
```bash
cd ~/trailtales
./run.sh <your-dockerhub-username>/trailtales:latest
```

`run.sh` handles everything automatically: pulls the latest image, stops the old container, and starts the new one with the right flags (`--restart unless-stopped`, `--env-file .env`, log rotation). Visit `http://<ec2-public-ip>:5000` — done.

### When the EC2 public IP changes

The React app uses a **relative** API base URL (`/api`), so the IP is never baked into the image. Only `.env` needs updating:

```bash
nano ~/trailtales/.env   # update CORS_ORIGIN and/or PUBLIC_URL
./run.sh <your-dockerhub-username>/trailtales:latest
```

No rebuild or re-push needed — the image stays the same, only the env changes.

> Tip: attach an **Elastic IP** to your EC2 instance (free while attached) so the IP never changes at all.

---

## 6. API quick reference

| Method | Path                | Auth     | Purpose                       |
|--------|---------------------|----------|-------------------------------|
| POST   | `/api/auth/signup`  | —        | Create account, returns JWT   |
| POST   | `/api/auth/login`   | —        | Login, returns JWT            |
| GET    | `/api/auth/me`      | Bearer   | Current user                  |
| GET    | `/api/posts`        | —        | List posts (`?q=&author=&page=&limit=`) |
| GET    | `/api/posts/:id`    | —        | Get one post                  |
| POST   | `/api/posts`        | Bearer   | Create post                   |
| PUT    | `/api/posts/:id`    | Bearer + author | Update                 |
| DELETE | `/api/posts/:id`    | Bearer + author | Delete                 |
| GET    | `/api/health`       | —        | Health check                  |

---

## 7. Project structure

```
trailtales/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── api/client.js    # axios instance (baseURL = /api)
│   │   ├── components/
│   │   ├── context/AuthContext.jsx
│   │   ├── pages/
│   │   └── styles/global.css
│   ├── index.html
│   └── vite.config.js
├── server/                  # Express backend
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/auth.js
│   ├── models/{User,Post}.js
│   ├── routes/{auth,posts}.js
│   └── server.js
├── .env.example             # COPY this to .env and fill in
├── Dockerfile               # single-container build (build → push → pull → run)
├── run.sh                   # EC2 helper: pulls image from Docker Hub and runs it
├── .dockerignore
└── package.json             # root scripts (install:all, dev, start)
```

---

## 8. Things you might want to add later

These were **out of scope** per your request, but easy to extend:
- Email + forgot password (the `User` schema can take an `email` field).
- File upload (the `coverImage` field is a URL today; swap for S3/CloudFront).
- Comments / likes.
- Admin role (already commented in spirit — add a `role` field on User and check in `requireAuth`).
- Reverse proxy (nginx/Caddy) on EC2 for HTTPS + port 80/443.

Happy travels. ✈️
