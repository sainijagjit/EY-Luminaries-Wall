## Server

FastAPI backend for EY Luminaries Wall.

### Setup

```bash
cd server
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Set the database URL (PostgreSQL):

```bash
export DATABASE_URL="postgresql://postgres:<PASSWORD>@hopper.proxy.rlwy.net:27229/railway"
```

### Run

```bash
cd server
source .venv/bin/activate
fastapi dev main.py
```

The API will be available at `http://127.0.0.1:8000`, with docs at `/docs`.
