# pitch deck bullshit detector

_turn any pitch deck into hard numbers and mild shame._

---

## 🧐 why this exists

startup pitches overflow with jargon. this ai‑powered toy uses NLP to quantify buzzword density and hype, giving you a quick reality check. this is for fun and is not a real due diligence tool.

## ✨ features

- **tech / business / marketing buzzword counter**
- **red‑flag scanner** for promises like “guaranteed success”
- **sentiment check** to catch cult‑level optimism
- spits out a single **bullshit %** (0–100)

---

## 🛠️ under the hood

**backend**

- **flask** REST api, single endpoint `POST /analyze`
- **textblob** polarity → converts sugary prose into a numeric optimism penalty
- regex tokeniser + curated dictionaries (`BUZZWORDS`, `FILLERS`, `RED_FLAGS`)
- scoring: `buzz*15 + filler*5 + flag*10 + sentimentPenalty`, capped at 100
- stateless, <50 ms per request on a laptop

**frontend**

- **react 18** with **vite** dev server
- **tailwindcss** for the minimal‑ish ui
- **axios** posts text → renders percentage with a red/green gradient
- live‑updates; no page reloads

---

## 🚀 quick start

```bash
git clone https://github.com/yourname/pitch-deck-bullshit-detector.git
cd pitch-deck-bullshit-detector
```

### backend (python ≥ 3.9)

```bash
cd backend
python -m venv venv && source venv/bin/activate  # windows? use venv\Scripts\activate
pip install -r requirements.txt
python -m textblob.download_corpora              # first‑run only
flask run --port 5001                            # api → http://localhost:5001
```

### frontend (node ≥ 18)

```bash
cd ../frontend
npm ci
npm run dev                                      # ui → http://localhost:3000
```

---

## 🕹️ use it

1. open [http://localhost:3000](http://localhost:3000)
2. paste your deck text
3. click **detect**
4. accept the verdict

---

## 🔧 customize

edit `backend/app.py` and extend the `BUZZWORDS`, `FILLERS`, or `RED_FLAGS` lists. restart the backend to apply.

---

## 📂 project layout

```text
backend/
  app.py              # core logic
  requirements.txt
frontend/
  public/index.html
  src/
    components/Detector.jsx
    App.jsx
    index.jsx
    index.css
  package.json
  vite.config.js
README.md
```

---

## 📝 license

MIT licensed. feel free to use it as you like.
