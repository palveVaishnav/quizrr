# Quizrr

## Stack Used

- Go
- Fiber
- Prisma
- PostgreSQL
- Docker
- React
- Auth0

## Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/palvevaishnav/quizrr.git
cd quizrr
```

#### 2. Setting Up the Database Using Docker
```bash
docker run --name postgres-quizrr \
   -e POSTGRES_USER=postgres \
   -e POSTGRES_PASSWORD=password \
   -e POSTGRES_DB=quizrr \
   -p 5432:5432 \
   -d postgres
```

#### 3. Set Up Environment Variables
```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/quizrr"
```

#### 4. Backend Setup
```bash
cd backend
```
Install the necessary Go dependencies:
```bash
go mod tidy
```

#### 5. Prisma Setup

Generate the Prisma client and set up migrations using the following commands:
```bash
# Generate Prisma client
go run github.com/steebchen/prisma-client-go generate

#  migration
go run github.com/steebchen/prisma-client-go migrate dev --whatever

# Push to database
go run github.com/steebchen/prisma-client-go db push
```

#### 6. Running the Backend

```bash
go run main.go
```
- nodemon type server,
```bash
air
```

#### 7. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

#### 8. Database terminal
```bash
docker exec -it postgres-quizrr psql -U postgres -d quizrr
```

#### 9. API Endpoints

The following endpoints are available in the backend:

(none protected, no auth in backend )
- `../api/tests`: Returns all available tests.
- `../api/test/:id`: Returns a specific test by ID.
- `../api/submit/:id`: Submit answers for a test .

#### 10. Seeding the Database
```bash
go run seed.go
```
