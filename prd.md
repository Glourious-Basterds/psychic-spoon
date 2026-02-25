# PRD — Hashi: Piattaforma di Collaborazione Creativa e Gestione IP

**Versione:** 1.0  
**Data:** Febbraio 2026  
**Stack Tecnologico:** Next.js · TailwindCSS · Neon DB (PostgreSQL)  
**Lingua:** Italiano  

---

## Indice

1. [Panoramica del Prodotto](#1-panoramica-del-prodotto)
2. [Stack Tecnologico](#2-stack-tecnologico)
3. [Architettura dell'Applicazione](#3-architettura-dellapplicazione)
4. [Modello dei Dati](#4-modello-dei-dati)
5. [Moduli Funzionali](#5-moduli-funzionali)
   - 5.1 [Autenticazione e Profili Utente](#51-autenticazione-e-profili-utente)
   - 5.2 [Workspace di Progetto](#52-workspace-di-progetto)
   - 5.3 [Sistema di Task e Milestone](#53-sistema-di-task-e-milestone)
   - 5.4 [Comunicazione Interna](#54-comunicazione-interna)
   - 5.5 [Deliverable e Revisioni](#55-deliverable-e-revisioni)
   - 5.6 [Sistema di Valutazione e Reputazione](#56-sistema-di-valutazione-e-reputazione)
   - 5.7 [Sistema di Annunci e Candidature](#57-sistema-di-annunci-e-candidature)
   - 5.8 [Pagine IP (Proprietà Intellettuale)](#58-pagine-ip-proprietà-intellettuale)
   - 5.9 [Assistente AI di Produzione](#59-assistente-ai-di-produzione)
6. [API Routes](#6-api-routes)
7. [Sicurezza e Permessi](#7-sicurezza-e-permessi)
8. [Requisiti Non Funzionali](#8-requisiti-non-funzionali)
9. [Roadmap di Sviluppo](#9-roadmap-di-sviluppo)

---

## 1. Panoramica del Prodotto

**Hashi** è una piattaforma di collaborazione strutturata pensata per team creativi che lavorano su produzioni di contenuti (film, animazione, fumetti, giochi, podcast, ecc.). Combina gestione di progetto, comunicazione, accountability tramite reputazione pubblica e gestione delle proprietà intellettuali (IP) in un unico workspace.

### Obiettivi Principali

- Fornire uno spazio di lavoro organizzato per la produzione creativa con tracciamento reale dei progressi.
- Costruire un sistema di reputazione pubblica basato sul comportamento effettivo nei progetti, non su autocertificazioni.
- Permettere ai titolari di IP di gestire la propria proprietà intellettuale e lanciare produzioni direttamente dalla piattaforma.
- Supportare la produzione con AI limitata al coordinamento, senza sostituire il nucleo creativo.

---

## 2. Stack Tecnologico

| Layer | Tecnologia | Note |
|---|---|---|
| Frontend | Next.js 14+ (App Router) | SSR/SSG per pagine pubbliche, RSC per componenti |
| Styling | TailwindCSS 3+ | Design system custom con variabili CSS |
| Database | Neon DB (PostgreSQL serverless) | Pool di connessioni tramite `@neondatabase/serverless` |
| ORM | Drizzle ORM | Type-safe, compatibile con Neon serverless |
| Autenticazione | NextAuth.js v5 | Supporto OAuth (Google, GitHub) + email/password |
| File Storage | Vercel Blob / AWS S3 | Upload di deliverable, avatar, materiali IP |
| Real-time | Pusher / Ably | Messaggi in tempo reale nel workspace |
| AI | Anthropic Claude API | Assistente di produzione |
| Deployment | Vercel | Edge runtime per API routes critiche |

---

## 3. Architettura dell'Applicazione

```
/app
  /(auth)
    /login
    /register
  /(dashboard)
    /dashboard                  → Homepage utente loggato
    /projects
      /[projectId]              → Workspace del progetto
        /overview               → Stato produzione, fasi, milestone
        /tasks                  → Gestione task per canale/ruolo
        /messages               → Chat del progetto
        /calls                  → Videochiamate + trascrizioni
        /deliverables           → Consegne e revisioni
        /team                   → Membri, ruoli, valutazioni
    /ip
      /[ipId]                   → Pagina IP pubblica/privata
      /create                   → Crea nuova IP
    /profile/[userId]           → Profilo pubblico + storico reputazione
    /jobs                       → Feed di annunci aperti
  /(public)
    /explore                    → Scopri IP e progetti pubblici
    /[username]                 → Profilo pubblico utente
/components
/lib
  /db                           → Schema Drizzle + query helpers
  /auth                         → Configurazione NextAuth
  /ai                           → Client Anthropic + prompt templates
/api
  /auth/[...nextauth]
  /projects/[projectId]/...
  /ip/[ipId]/...
  /jobs/...
  /reputation/...
  /ai/...
```

---

## 4. Modello dei Dati

Di seguito lo schema completo del database su Neon DB (PostgreSQL), definito tramite Drizzle ORM.

### 4.1 Utenti e Profili

```sql
-- Utenti
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255) UNIQUE NOT NULL,
  username      VARCHAR(50) UNIQUE NOT NULL,
  display_name  VARCHAR(100),
  avatar_url    TEXT,
  bio           TEXT,
  skills        TEXT[],                      -- es. ["editing", "motion graphics"]
  portfolio_url TEXT,
  is_verified   BOOLEAN DEFAULT false,
  reputation_score DECIMAL(5,2) DEFAULT 0,   -- score aggregato pubblico
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Account OAuth collegati
CREATE TABLE accounts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  provider        VARCHAR(50) NOT NULL,       -- "google", "github", "credentials"
  provider_id     VARCHAR(255) NOT NULL,
  access_token    TEXT,
  refresh_token   TEXT,
  expires_at      TIMESTAMPTZ,
  UNIQUE(provider, provider_id)
);
```

### 4.2 Proprietà Intellettuale (IP)

```sql
CREATE TABLE ip_pages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id        UUID REFERENCES users(id) ON DELETE CASCADE,
  title           VARCHAR(255) NOT NULL,
  slug            VARCHAR(255) UNIQUE NOT NULL,
  description     TEXT,
  genre           VARCHAR(100),
  format          VARCHAR(100),              -- "film", "anime", "fumetto", "gioco", ecc.
  visibility      VARCHAR(20) DEFAULT 'private', -- 'public', 'private', 'selected'
  contact_mode    VARCHAR(30) DEFAULT 'applications', -- 'open_pitch', 'applications', 'paid_only'
  safe_sample     TEXT,                      -- estratto condivisibile con candidati
  style_guide_url TEXT,
  cover_image_url TEXT,
  tags            TEXT[],
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Materiali allegati a una IP (reference visivi, scene di esempio, ecc.)
CREATE TABLE ip_materials (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_id       UUID REFERENCES ip_pages(id) ON DELETE CASCADE,
  type        VARCHAR(50),                   -- "image", "document", "video_link"
  label       VARCHAR(255),
  url         TEXT NOT NULL,
  is_public   BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Accessi selettivi a IP private
CREATE TABLE ip_access_grants (
  ip_id       UUID REFERENCES ip_pages(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  granted_at  TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (ip_id, user_id)
);
```

### 4.3 Progetti

```sql
CREATE TABLE projects (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_id           UUID REFERENCES ip_pages(id) ON DELETE SET NULL, -- opzionale
  leader_id       UUID REFERENCES users(id) ON DELETE RESTRICT,
  title           VARCHAR(255) NOT NULL,
  description     TEXT,
  status          VARCHAR(30) DEFAULT 'setup',
    -- 'setup', 'recruiting', 'in_production', 'post_production', 'completed', 'cancelled'
  current_phase   VARCHAR(100),              -- es. "Pre-produzione", "Montaggio"
  visibility      VARCHAR(20) DEFAULT 'private',
  cover_image_url TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Canali/sezioni del progetto (montaggio, audio, grafica, ecc.)
CREATE TABLE project_channels (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID REFERENCES projects(id) ON DELETE CASCADE,
  name        VARCHAR(100) NOT NULL,         -- "montaggio", "audio", "grafica"
  type        VARCHAR(30) DEFAULT 'work',    -- 'work', 'general', 'announcements'
  position    INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Membri del progetto
CREATE TABLE project_members (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  role        VARCHAR(100),                  -- es. "Editor", "Sound Designer"
  channel_id  UUID REFERENCES project_channels(id) ON DELETE SET NULL,
  status      VARCHAR(20) DEFAULT 'active',  -- 'active', 'left', 'removed'
  joined_at   TIMESTAMPTZ DEFAULT now(),
  left_at     TIMESTAMPTZ,
  leave_reason TEXT,                         -- motivo uscita (per eccezioni legittime)
  leave_approved BOOLEAN,                   -- approvato dal leader
  UNIQUE(project_id, user_id)
);
```

### 4.4 Milestone e Task

```sql
CREATE TABLE milestones (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID REFERENCES projects(id) ON DELETE CASCADE,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  due_date    DATE,
  status      VARCHAR(30) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed'
  position    INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE tasks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      UUID REFERENCES projects(id) ON DELETE CASCADE,
  milestone_id    UUID REFERENCES milestones(id) ON DELETE SET NULL,
  channel_id      UUID REFERENCES project_channels(id) ON DELETE SET NULL,
  assigned_to     UUID REFERENCES users(id) ON DELETE SET NULL,
  created_by      UUID REFERENCES users(id),
  title           VARCHAR(255) NOT NULL,
  description     TEXT,
  status          VARCHAR(30) DEFAULT 'todo',
    -- 'todo', 'in_progress', 'in_review', 'completed', 'blocked'
  priority        VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  due_date        TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Log dei cambi di stato di un task
CREATE TABLE task_activity (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id     UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES users(id),
  action      VARCHAR(50),                   -- "status_change", "comment", "assignment"
  old_value   TEXT,
  new_value   TEXT,
  note        TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

### 4.5 Messaggi e Comunicazione

```sql
CREATE TABLE messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID REFERENCES projects(id) ON DELETE CASCADE,
  channel_id  UUID REFERENCES project_channels(id) ON DELETE CASCADE,
  sender_id   UUID REFERENCES users(id),
  content     TEXT NOT NULL,
  type        VARCHAR(30) DEFAULT 'text',    -- 'text', 'file', 'system'
  file_url    TEXT,
  reply_to_id UUID REFERENCES messages(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT now(),
  edited_at   TIMESTAMPTZ,
  is_deleted  BOOLEAN DEFAULT false
);

-- Riunioni con trascrizioni
CREATE TABLE meetings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      UUID REFERENCES projects(id) ON DELETE CASCADE,
  title           VARCHAR(255),
  scheduled_at    TIMESTAMPTZ,
  started_at      TIMESTAMPTZ,
  ended_at        TIMESTAMPTZ,
  transcript_text TEXT,                      -- testo grezzo trascrizione
  summary_text    TEXT,                      -- riassunto AI delle decisioni
  recording_url   TEXT,
  created_by      UUID REFERENCES users(id),
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- Partecipanti riunione
CREATE TABLE meeting_participants (
  meeting_id  UUID REFERENCES meetings(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  joined_at   TIMESTAMPTZ,
  left_at     TIMESTAMPTZ,
  PRIMARY KEY (meeting_id, user_id)
);
```

### 4.6 Deliverable

```sql
CREATE TABLE deliverables (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      UUID REFERENCES projects(id) ON DELETE CASCADE,
  task_id         UUID REFERENCES tasks(id) ON DELETE SET NULL,
  channel_id      UUID REFERENCES project_channels(id) ON DELETE SET NULL,
  submitted_by    UUID REFERENCES users(id),
  title           VARCHAR(255) NOT NULL,
  description     TEXT,
  file_url        TEXT NOT NULL,
  file_type       VARCHAR(50),
  version         INTEGER DEFAULT 1,
  status          VARCHAR(30) DEFAULT 'submitted',
    -- 'submitted', 'in_review', 'approved', 'revision_requested'
  submitted_at    TIMESTAMPTZ DEFAULT now()
);

-- Feedback sui deliverable
CREATE TABLE deliverable_feedback (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deliverable_id  UUID REFERENCES deliverables(id) ON DELETE CASCADE,
  reviewer_id     UUID REFERENCES users(id),
  comment         TEXT NOT NULL,
  status          VARCHAR(30),               -- 'approve', 'request_revision'
  created_at      TIMESTAMPTZ DEFAULT now()
);
```

### 4.7 Valutazioni e Reputazione

```sql
-- Valutazioni post-milestone o post-progetto
CREATE TABLE peer_reviews (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      UUID REFERENCES projects(id) ON DELETE CASCADE,
  milestone_id    UUID REFERENCES milestones(id) ON DELETE SET NULL, -- se per milestone
  reviewer_id     UUID REFERENCES users(id),
  reviewed_id     UUID REFERENCES users(id),
  -- Score 1-5 per ogni categoria
  reliability     SMALLINT CHECK (reliability BETWEEN 1 AND 5),
  communication   SMALLINT CHECK (communication BETWEEN 1 AND 5),
  punctuality     SMALLINT CHECK (punctuality BETWEEN 1 AND 5),
  quality         SMALLINT CHECK (quality BETWEEN 1 AND 5),
  tone_fit        SMALLINT CHECK (tone_fit BETWEEN 1 AND 5),
  creativity      SMALLINT CHECK (creativity BETWEEN 1 AND 5),
  collaboration   SMALLINT CHECK (collaboration BETWEEN 1 AND 5),
  written_note    TEXT,                      -- nota pubblica scritta
  is_public       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE(project_id, reviewer_id, reviewed_id, milestone_id)
);

-- Log penalità per abbandono senza motivazione legittima
CREATE TABLE reputation_penalties (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id  UUID REFERENCES projects(id) ON DELETE SET NULL,
  reason      VARCHAR(100),                  -- 'abandoned_project', 'missed_deadlines'
  points      DECIMAL(5,2),                  -- punti sottratti (negativo)
  applied_at  TIMESTAMPTZ DEFAULT now(),
  applied_by  UUID REFERENCES users(id)
);
```

### 4.8 Annunci e Candidature

```sql
CREATE TABLE job_postings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      UUID REFERENCES projects(id) ON DELETE CASCADE,
  channel_id      UUID REFERENCES project_channels(id) ON DELETE SET NULL,
  posted_by       UUID REFERENCES users(id),
  title           VARCHAR(255) NOT NULL,
  description     TEXT,
  role            VARCHAR(100),
  type            VARCHAR(30) NOT NULL,
    -- 'standard'       → candidatura con portfolio
    -- 'competition'    → submission di un sample/mockup
    -- 'creative_brief' → proposta di direzione creativa
  safe_sample     TEXT,                      -- materiale condivisibile con candidati
  requirements    TEXT[],
  is_paid         BOOLEAN DEFAULT false,
  deadline        DATE,
  status          VARCHAR(20) DEFAULT 'open', -- 'open', 'closed', 'filled'
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE job_applications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  posting_id      UUID REFERENCES job_postings(id) ON DELETE CASCADE,
  applicant_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  cover_note      TEXT,
  portfolio_url   TEXT,
  submission_url  TEXT,                      -- per competition / creative_brief
  creative_direction TEXT,                   -- per tipo creative_brief
  status          VARCHAR(30) DEFAULT 'pending',
    -- 'pending', 'viewed', 'shortlisted', 'accepted', 'rejected'
  submitted_at    TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE(posting_id, applicant_id)
);
```

### 4.9 Crediti di Produzione

```sql
-- Crediti pubblici associati a IP o progetti completati
CREATE TABLE production_credits (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id  UUID REFERENCES projects(id) ON DELETE CASCADE,
  ip_id       UUID REFERENCES ip_pages(id) ON DELETE SET NULL,
  role        VARCHAR(100),
  contribution TEXT,
  is_public   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

---

## 5. Moduli Funzionali

### 5.1 Autenticazione e Profili Utente

#### Funzionalità

- Registrazione con email/password e OAuth (Google, GitHub).
- Profilo pubblico con: nome, bio, skills, portfolio, storico di produzione e score di reputazione aggregato.
- Lo score di reputazione è calcolato come media pesata delle valutazioni ricevute, con decurtazioni per abbandoni non giustificati.
- Il profilo mostra: progetti completati, crediti di produzione, valutazioni ricevute (pubbliche), penalità ricevute (visibili con motivazione).

#### Implementazione

```typescript
// lib/db/schema/users.ts — Drizzle schema
// lib/auth/config.ts — NextAuth config con Drizzle adapter
// app/(auth)/login/page.tsx — Pagina login
// app/(auth)/register/page.tsx — Pagina registrazione
// app/(dashboard)/profile/[userId]/page.tsx — Profilo pubblico
```

La reputazione viene ricalcolata tramite una funzione PostgreSQL aggioranta a ogni nuova peer review o penalità:

```sql
CREATE OR REPLACE FUNCTION recalculate_reputation(target_user_id UUID)
RETURNS void AS $$
DECLARE
  avg_score DECIMAL;
  total_penalties DECIMAL;
BEGIN
  SELECT AVG(
    (reliability + communication + punctuality + quality + tone_fit + collaboration) / 6.0
  ) INTO avg_score
  FROM peer_reviews WHERE reviewed_id = target_user_id AND is_public = true;

  SELECT COALESCE(SUM(ABS(points)), 0) INTO total_penalties
  FROM reputation_penalties WHERE user_id = target_user_id;

  UPDATE users
  SET reputation_score = GREATEST(0, COALESCE(avg_score, 0) * 20 - total_penalties)
  WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql;
```

---

### 5.2 Workspace di Progetto

#### Funzionalità

- Il project leader crea un progetto, opzionalmente collegato a una pagina IP.
- Il workspace è diviso in: **Overview**, **Canali di lavoro** (uno per disciplina), **Messaggi**, **Chiamate**, **Deliverable**, **Team**.
- La pagina Overview mostra: fase corrente, milestone attive, percentuale di completamento task, attività recente.
- I canali di lavoro sono configurabili (montaggio, audio, grafica, animazione, scrittura, marketing, ecc.).
- Solo i membri del progetto accedono al workspace (visibilità `private` di default).

#### Implementazione

- La pagina `overview` usa React Server Components per caricare dati aggregati lato server.
- I canali sono caricati dinamicamente in base ai `project_channels` del progetto.
- L'avanzamento è calcolato con:

```sql
SELECT
  COUNT(*) FILTER (WHERE status = 'completed')::FLOAT / COUNT(*) * 100 AS completion_pct
FROM tasks
WHERE project_id = $1;
```

---

### 5.3 Sistema di Task e Milestone

#### Funzionalità

- Il leader e i membri (con permesso) creano task assegnabili a un membro specifico, con scadenza, priorità e canale di riferimento.
- Le milestone raggruppano task correlati e segnano punti chiave della produzione.
- Ogni task ha uno stato: `todo → in_progress → in_review → completed`.
- I cambi di stato generano `task_activity` per mantenere uno storico.
- Le scadenze scadute senza completamento inviano notifiche al membro e al leader.

#### Implementazione

```typescript
// app/(dashboard)/projects/[projectId]/tasks/page.tsx
// Vista kanban per canale, filtrabile per membro/stato/priorità

// API Route: PATCH /api/projects/[projectId]/tasks/[taskId]
// → Aggiorna status, inserisce task_activity, invia notifica se scadenza superata
```

Le milestone scatenano la finestra di peer review alla loro chiusura (status → `completed`).

---

### 5.4 Comunicazione Interna

#### Funzionalità

- Chat per canale con messaggi in tempo reale tramite WebSocket (Pusher/Ably).
- Possibilità di rispondere a messaggi specifici (thread leggero).
- Allegati file ai messaggi.
- Chiamate video/audio integrate (iframe embed di Whereby o Jitsi auto-hosted).
- Le riunioni generano trascrizioni (tramite Whisper API o provider terzo); il testo viene poi sintetizzato dall'AI in un riassunto delle decisioni chiave, salvato in `meetings.summary_text`.

#### Implementazione

```typescript
// app/(dashboard)/projects/[projectId]/messages/page.tsx
// Componente client con Pusher subscriber

// API Route: POST /api/projects/[projectId]/messages
// → Salva messaggio su DB → pubblica evento Pusher sul canale `project-{id}-channel-{channelId}`

// API Route: POST /api/projects/[projectId]/meetings/[meetingId]/summarize
// → Legge transcript → chiama Claude API → salva summary
```

---

### 5.5 Deliverable e Revisioni

#### Funzionalità

- I membri caricano file di consegna (video, immagini, documenti, audio) collegati a un task o canale.
- Il leader (o revisore designato) lascia feedback: approvazione o richiesta di revisione.
- Ogni revisione crea una nuova versione del deliverable (campo `version`).
- Lo storico di tutte le consegne e revisioni è visibile nel workspace, con data, autore e commenti.

#### Implementazione

```typescript
// Upload: API Route POST /api/projects/[projectId]/deliverables
// → Upload file su Vercel Blob / S3 → salva record deliverable su DB

// Feedback: POST /api/projects/[projectId]/deliverables/[delivId]/feedback
// → Salva deliverable_feedback → se 'revision_requested', incrementa version, aggiorna status
```

---

### 5.6 Sistema di Valutazione e Reputazione

#### Funzionalità

- Alla chiusura di una milestone o del progetto, si apre una finestra di valutazione tra pari.
- Ogni membro valuta gli altri su 7 categorie (scala 1–5): affidabilità, comunicazione, puntualità, qualità, aderenza al tono/atmosfera, creatività, collaborazione.
- Aggiunge una nota scritta pubblica opzionale.
- Le valutazioni sono visibili sul profilo pubblico del valutato.
- Un membro che abbandona un progetto senza giustificazione riceve una penalità automatica (–10 punti di default, configurabile dal leader).
- Per un abbandono con motivazione legittima, il leader approva la richiesta e la penalità non viene applicata; è richiesto un passaggio di consegne formale (campo `leave_reason` + task riassegnazione).

#### Implementazione

```typescript
// Trigger valutazione: webhook interno al completamento milestone/progetto

// app/(dashboard)/projects/[projectId]/team/review/page.tsx
// → Form di valutazione con 7 slider + textarea

// API Route: POST /api/reputation/peer-review
// → Salva peer_reviews → chiama recalculate_reputation()

// API Route: POST /api/reputation/penalty
// → Salva reputation_penalties → chiama recalculate_reputation()
```

**Protezione anti-abuso per eccezioni di abbandono:**

- La richiesta di uscita con eccezione deve essere inviata almeno 48 ore prima della scadenza del task più vicino (salvo emergenze).
- In caso di emergenza dichiarata, il leader ha 72 ore per approvare o rifiutare.
- Se approvata, il membro mantiene lo score ma deve riassegnare i task aperti.
- Massimo 2 eccezioni approvate per utente in un anno solare (dopo la seconda, le successive sono soggette a revisione manuale).

---

### 5.7 Sistema di Annunci e Candidature

#### Funzionalità

Il leader può pubblicare 3 tipi di annunci:

**1. Standard** — Candidatura classica con portfolio ed esperienza.

**2. Competition** — I candidati inviano un sample/mockup basato su materiale del progetto (safe sample). Il leader seleziona in base al lavoro consegnato.

**3. Creative Brief** — Il leader condivide un safe sample e chiede ai candidati di proporre una direzione creativa o soluzione. Seleziona chi pensa meglio al progetto.

- Il leader gestisce le candidature (visualizza, shortlista, accetta/rifiuta).
- Le candidature accettate convertono automaticamente in `project_members`.
- Feed pubblico degli annunci aperti, filtrabile per ruolo, tipo di progetto, formato IP.

#### Implementazione

```typescript
// app/(dashboard)/jobs/page.tsx — Feed annunci
// app/(dashboard)/projects/[projectId]/jobs/new/page.tsx — Crea annuncio

// API Route: GET /api/jobs — Lista annunci aperti con filtri
// API Route: POST /api/jobs/[postingId]/apply — Invia candidatura
// API Route: PATCH /api/jobs/[postingId]/applications/[appId] — Aggiorna status
// Accettazione: se status → 'accepted', crea project_members record
```

---

### 5.8 Pagine IP (Proprietà Intellettuale)

#### Funzionalità

- Il titolare crea una pagina IP con titolo, descrizione, genere, formato, tag, materiali allegati e impostazioni di visibilità.
- Visibilità: `public` (tutti), `private` (solo il titolare), `selected` (lista whitelist tramite `ip_access_grants`).
- Modalità di contatto: `open_pitch` (chiunque può inviare una proposta), `applications` (solo candidature formali), `paid_only` (solo per lavori retribuiti o licensing).
- Il titolare può caricare: descrizione breve (safe), riferimenti visivi, style guide, scene di esempio.
- Dalla pagina IP si possono lanciare direttamente nuovi progetti, collegati all'IP.
- I progetti completati e i crediti vengono associati all'IP, costruendo uno storico di produzione verificabile.

#### Implementazione

```typescript
// app/(dashboard)/ip/[ipId]/page.tsx — Pagina IP (rendering condizionale per visibilità)
// app/(dashboard)/ip/create/page.tsx — Creazione nuova IP

// API Route: GET /api/ip/[ipId] — Restituisce IP (verifica accesso)
// API Route: POST /api/ip — Crea nuova IP
// API Route: PATCH /api/ip/[ipId] — Aggiorna IP
// API Route: POST /api/ip/[ipId]/grant — Aggiunge utente a ip_access_grants
// API Route: POST /api/ip/[ipId]/launch-project — Crea progetto collegato all'IP
```

Middleware di accesso:

```typescript
// lib/ip/checkAccess.ts
export async function checkIpAccess(ipId: string, userId: string | null) {
  const ip = await db.query.ipPages.findFirst({ where: eq(ipPages.id, ipId) });
  if (!ip) return { allowed: false, reason: 'not_found' };
  if (ip.visibility === 'public') return { allowed: true };
  if (!userId) return { allowed: false, reason: 'unauthenticated' };
  if (ip.ownerId === userId) return { allowed: true };
  if (ip.visibility === 'selected') {
    const grant = await db.query.ipAccessGrants.findFirst({
      where: and(eq(ipAccessGrants.ipId, ipId), eq(ipAccessGrants.userId, userId))
    });
    return { allowed: !!grant };
  }
  return { allowed: false };
}
```

---

### 5.9 Assistente AI di Produzione

#### Funzionalità

L'AI è **limitata al supporto della produzione** e non genera contenuto creativo della storia a meno che l'utente non lo abiliti esplicitamente. Le funzionalità AI disponibili sono:

- **Organizzazione fasi di produzione:** suggerisce una struttura di workflow per un nuovo progetto basandosi su formato e obiettivi.
- **Sintesi feedback:** converte i commenti sui deliverable in una review scritta strutturata.
- **Riassunto riunioni:** sintetizza le trascrizioni delle chiamate in un elenco di decisioni e action items.
- **Supporto a planning e timeline:** stima durate di fasi e scadenze sulla base della storia del workspace.
- **Report di chiusura progetto:** genera un documento di riepilogo delle attività completate, chi ha contribuito e note di produzione.

#### Implementazione

```typescript
// lib/ai/client.ts — Wrapper Claude API
// lib/ai/prompts/ — Template di prompt per ogni funzionalità

// API Route: POST /api/ai/summarize-meeting
// → Input: meeting transcript → Output: summary con decisioni e action items

// API Route: POST /api/ai/review-feedback
// → Input: array di deliverable_feedback → Output: review strutturata

// API Route: POST /api/ai/suggest-workflow
// → Input: project data (format, description, team size) → Output: fasi suggerite con durate

// API Route: POST /api/ai/project-report
// → Input: project_id → Query dati da DB → Output: report markdown
```

Ogni prompt include un system prompt che vincola l'AI:

```
Sei un assistente di produzione per il progetto [TITOLO].
Il tuo compito è supportare il coordinamento e l'organizzazione del lavoro.
Non generare contenuto narrativo, creativo o di storia a meno che
il project leader non lo abbia esplicitamente richiesto in questa sessione.
Rispondi sempre in italiano.
```

---

## 6. API Routes

| Metodo | Path | Descrizione |
|---|---|---|
| POST | `/api/auth/[...nextauth]` | Autenticazione NextAuth |
| GET | `/api/projects` | Lista progetti dell'utente |
| POST | `/api/projects` | Crea nuovo progetto |
| GET | `/api/projects/[id]` | Dati progetto |
| PATCH | `/api/projects/[id]` | Aggiorna progetto |
| GET | `/api/projects/[id]/tasks` | Task del progetto |
| POST | `/api/projects/[id]/tasks` | Crea task |
| PATCH | `/api/projects/[id]/tasks/[tid]` | Aggiorna task |
| GET | `/api/projects/[id]/messages` | Messaggi per canale |
| POST | `/api/projects/[id]/messages` | Invia messaggio |
| POST | `/api/projects/[id]/deliverables` | Carica deliverable |
| POST | `/api/projects/[id]/deliverables/[did]/feedback` | Lascia feedback |
| GET | `/api/projects/[id]/milestones` | Milestone del progetto |
| POST | `/api/projects/[id]/milestones` | Crea milestone |
| PATCH | `/api/projects/[id]/milestones/[mid]` | Aggiorna milestone (trigger review) |
| GET | `/api/jobs` | Feed annunci pubblici |
| POST | `/api/jobs` | Crea annuncio |
| POST | `/api/jobs/[jid]/apply` | Candidatura |
| PATCH | `/api/jobs/[jid]/applications/[aid]` | Gestisci candidatura |
| GET | `/api/ip` | Lista IP dell'utente |
| POST | `/api/ip` | Crea pagina IP |
| GET | `/api/ip/[id]` | Dettaglio IP (con check accesso) |
| PATCH | `/api/ip/[id]` | Aggiorna IP |
| POST | `/api/ip/[id]/launch-project` | Lancia progetto da IP |
| POST | `/api/reputation/peer-review` | Invia valutazione tra pari |
| POST | `/api/reputation/penalty` | Applica penalità |
| GET | `/api/profile/[username]` | Profilo pubblico utente |
| POST | `/api/ai/summarize-meeting` | Sintesi riunione |
| POST | `/api/ai/review-feedback` | Sintesi feedback deliverable |
| POST | `/api/ai/suggest-workflow` | Suggerimento workflow |
| POST | `/api/ai/project-report` | Report di chiusura |

---

## 7. Sicurezza e Permessi

### Ruoli nel Workspace

| Ruolo | Permessi |
|---|---|
| **Project Leader** | Tutti i permessi: modifica progetto, gestisce task/milestone, approva uscite, applica penalità, accetta candidature |
| **Membro** | Crea e aggiorna propri task, carica deliverable, invia messaggi, valuta colleghi |
| **Viewer** (opzionale) | Solo lettura su parti pubbliche del workspace |

### Regole di Accesso

- Tutti gli endpoint `/api/projects/[id]/*` verificano che l'utente sia membro attivo del progetto.
- Gli endpoint `/api/ip/[id]` usano `checkIpAccess()` prima di restituire dati.
- Le peer review sono anonimizzate verso i valutati (il valutato vede i punteggi aggregati, non chi ha dato quale voto, ma la nota scritta è pubblica e attribuita).
- I file caricati su storage usano URL firmati con scadenza (signed URLs).

### Validazione

- Tutti gli input sono validati con **Zod** prima di essere scritti sul database.
- Le query SQL usano **parametri preparati** (Drizzle ORM previene SQL injection by design).

---

## 8. Requisiti Non Funzionali

- **Performance:** le pagine pubbliche (profili, IP pubbliche, feed annunci) sono staticamente generate o cache-validate con ISR (Incremental Static Regeneration) di Next.js.
- **Real-time:** la latenza dei messaggi deve essere ≤ 500ms per il 95° percentile.
- **Scalabilità database:** Neon DB usa connessioni serverless pooled (`@neondatabase/serverless`); le query pesanti (aggregazioni reputazione, feed jobs) usano indici appropriati.
- **Upload:** dimensione massima per deliverable: 2GB. File storage separato dal DB.
- **Accessibilità:** componenti conformi WCAG 2.1 AA.
- **Mobile:** layout responsive con TailwindCSS; il workspace è usabile da mobile per la consultazione, le operazioni pesanti (upload, task management) sono ottimizzate per desktop.

### Indici Database Critici

```sql
CREATE INDEX idx_tasks_project_status ON tasks(project_id, status);
CREATE INDEX idx_tasks_assigned_due ON tasks(assigned_to, due_date);
CREATE INDEX idx_messages_channel_created ON messages(channel_id, created_at DESC);
CREATE INDEX idx_peer_reviews_reviewed ON peer_reviews(reviewed_id);
CREATE INDEX idx_job_postings_status ON job_postings(status, created_at DESC);
CREATE INDEX idx_ip_pages_visibility ON ip_pages(visibility, created_at DESC);
CREATE INDEX idx_deliverables_project ON deliverables(project_id, submitted_at DESC);
```

---

## 9. Roadmap di Sviluppo

### Fase 1 — MVP Core (Sprint 1–4)

- Autenticazione e profili utente
- Creazione workspace di progetto con canali
- Sistema task e milestone (senza AI)
- Chat base per canale (polling, poi WebSocket)
- Pagine IP con visibilità base

### Fase 2 — Collaborazione Completa (Sprint 5–8)

- Upload deliverable e sistema di feedback/revisioni
- Sistema di valutazione peer e calcolo reputazione
- Feed annunci e sistema candidature (tutti e 3 i tipi)
- Notifiche in-app per scadenze, candidature, feedback

### Fase 3 — AI e Funzionalità Avanzate (Sprint 9–12)

- Integrazione Claude API per sintesi riunioni e report
- Trascrizione automatica delle chiamate
- Assistente workflow e planning
- Storico di produzione su pagine IP
- Dashboard analytics per project leader (burndown chart, attività team)

### Fase 4 — Ottimizzazione e Scala (Sprint 13+)

- Search globale (progetti, IP, profili, annunci)
- Sistema di notifiche email/push
- API pubblica per integrazioni esterne
- Mobile app (React Native / Expo)

---

*Documento preparato per il team di sviluppo Hashi — v1.0*