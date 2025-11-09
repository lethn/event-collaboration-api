# Event Collaboration API

A backend system built with **NestJS**, **TypeORM**, and **PostgreSQL** that allows users to create events, detect scheduling conflicts, merge overlapping events, generate summarized merged results, perform efficient batch inserts, and keep a clear audit trail of merge operations.

---

## API Endpoints

### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/events` | Create an event |
| GET | `/events` | List all events |
| GET | `/events/:id` | Get a single event |
| PATCH | `/events/:id` | Update an event |
| DELETE | `/events/:id` | Delete an event |
| GET | `/events/conflicts/:userId` | Detect overlapping events for a user |
| POST | `/events/merge-all/:userId` | Merge overlapping events for that user |
| POST | `/events/batch` | Create up to 500 events in one request |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/users` | Create a user |
| GET | `/users` | List users |
| GET | `/users/:id` | Get a user and their events |

### Audit Logs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/audit-logs` | View merge history |
| DELETE | `/audit-logs/:id` | Delete a log entry |

---

## How to Run the Project

### 1. Install dependencies
```bash
npm install
```

### 2. Ensure PostgreSQL is installed and running locally
Create the main database:
```sql
CREATE DATABASE event_collaboration;
```

### 3. Create a `.env` file in the project root:
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=your_password_here
DB_NAME=event_collaboration
DB_SYNC=true

AI_PROVIDER=mock
AI_API_KEY=sk-demo
AI_CACHE=memory
```

### 4. Start the server
```bash
npm run start:dev
```

API will be available at:
```
http://localhost:3000
```

---

## How to Run Tests

### 1. Create a separate test database:
```sql
CREATE DATABASE event_collaboration_test;
```

### 2. Create `.env.test`:
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=your_password_here
DB_NAME=event_collaboration_test
DB_SYNC=true

AI_PROVIDER=mock
```

### 3. Run tests:
```bash
npm test
```

Additional:
```
npm run test:watch
npm run test:cov
```

---

## AI Layer (Mocked but Extendable)

The system currently uses a mock summarizer to generate short one-line summaries for merged events, and these summaries are automatically cached for efficiency. The AI layer is intentionally built around a clean and interchangeable interface, so the summarizer can be replaced with a real model such as OpenAI, Anthropic, or a self-hosted local model. Integrating a real AI service only requires implementing the same summarizer interface and updating the AI_PROVIDER environment value, without any changes to the rest of the application logic.

---

## AI Usage

I used AI to help accelerate repetitive development tasks, especially around generating boilerplate, organizing module structure, finding errors and resolving debugging issues in the AI summarization flow and the batch insertion path. However, the core event logic that defines scheduling conflict detection, merging behavior, and data consistency rules was implemented manually to ensure that the system operates in a fully explainable, predictable, and intentional way. The goal was to leverage AI as a development assistant while maintaining complete ownership of the core problem-solving and reasoning processes.

---

## Reasoning About the Merge Algorithm

The merge algorithm identifies overlapping events by comparing their time ranges using the rule that one event overlaps another when its start time occurs before the other event’s end time and its end time occurs after the other event’s start time. Events that overlap are grouped together and each group is replaced with a single merged event that combines the titles and descriptions, expands the time span to cover the earliest start and latest end, takes the status of the most recently ending event, and unifies invitees without duplicates. The system records the original event IDs in the `mergedFrom` field and creates an audit log entry that maps old events to the new merged one, ensuring that the merge process remains transparent and traceable.


