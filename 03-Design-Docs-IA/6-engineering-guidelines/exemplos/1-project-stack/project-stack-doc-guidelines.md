# Exemplo de Software Development Guidelines

# Go Development Guidelines

## Project Stack

The following libraries were specified for reference in this project:

**User-Specified Libraries:**

- **ORM**: sqlc (v1.30.0) - Generate type-safe code from SQL - [https://sqlc.dev](https://sqlc.dev/)
- **Web Framework**: chi (v5) - Lightweight, idiomatic HTTP router - https://github.com/go-chi/chi
- **Testing**: testify (v1) - Assertions and mocks toolkit - https://github.com/stretchr/testify
- **Database Driver**: pgx (v5) - High-performance PostgreSQL driver - https://github.com/jackc/pgx

**Auto-Populated Essential Tools:**

- **Formatting**: gofmt, goimports - Standard Go formatters
- **Linting**: golangci-lint - Meta-linter combining 100+ analyzers - [https://golangci-lint.run](https://golangci-lint.run/)
- **Logging**: log/slog - Structured logging (Go 1.21+)
- **Build Tool**: go build, make

> Note: All code examples use standard library features only.

---

## 1. Core Principles

### 1.1 Philosophy and Style

- Use `gofmt` for all formatting - no exceptions
- Follow [Effective Go](https://go.dev/doc/effective_go) conventions
- Clear and simple code beats clever abstractions
- Run `go vet` and `staticcheck` before commits

### 1.2 Clarity over Brevity

- Names should communicate intent: `userCount` not `uc`
- Self-explanatory code reduces need for comments
- Avoid premature optimization: clarity first

### 1.3 Core Tools

| Tool          | Purpose                   | Command             |
| ------------- | ------------------------- | ------------------- |
| gofmt         | Format code               | `gofmt -w .`        |
| goimports     | Format + organize imports | `goimports -w .`    |
| go vet        | Static analysis           | `go vet ./...`      |
| golangci-lint | Meta-linter               | `golangci-lint run` |

---

## 2. Project Initialization

### 2.1 Creating New Project

```bash
mkdir myproject && cd myproject
go mod init github.com/username/myproject

```

### 2.2 Dependency Management

```bash
# Add dependency
go get github.com/some/package@latest

# Add specific version
go get github.com/some/package@v1.2.3

# Update all dependencies
go get -u ./...

# Clean unused dependencies
go mod tidy

# Verify dependencies
go mod verify

```

---

## 3. Project Structure

### 3.1 Basic Layout (Small Projects)

```
myproject/
  go.mod
  go.sum
  main.go
  handler.go
  handler_test.go

```

### 3.2 Standard Layout (Medium/Large Projects)

```
myproject/
  cmd/
    api/
      main.go
    worker/
      main.go
  internal/
    handler/
      user.go
      user_test.go
    repository/
      user.go
    service/
      user.go
  pkg/
    validator/
      validator.go
  migrations/
    001_create_users.sql
  configs/
    config.yaml
  scripts/
    setup.sh
  Dockerfile
  docker-compose.yaml
  Makefile
  go.mod
  go.sum

```

### 3.3 Key Directories

| Directory     | Purpose                             |
| ------------- | ----------------------------------- |
| `cmd/`        | Main applications                   |
| `internal/`   | Private code (enforced by compiler) |
| `pkg/`        | Public reusable packages            |
| `migrations/` | Database migrations                 |

---

## 4. Container Development (Docker)

### 4.1 Dockerfile for Development

```docker
FROM golang:1.25-alpine

WORKDIR /app

# Install development tools
RUN apk add --no-cache git make

# Keep container running for development
CMD ["sleep", "infinity"]

```

### 4.2 Docker Compose

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    volumes:
      - .:/app
      - go-mod-cache:/go/pkg/mod
    working_dir: /app
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - backend

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev
      POSTGRES_DB: myapp
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U dev"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - backend

volumes:
  go-mod-cache:
  postgres-data:

networks:
  backend:
```

### 4.3 .dockerignore

```
.git
.gitignore
*.md
Dockerfile*
docker-compose*
.env*
tmp/
vendor/

```

### 4.4 Essential Commands

| Command                                    | Description       |
| ------------------------------------------ | ----------------- |
| `docker compose up -d`                     | Start environment |
| `docker compose logs -f app`               | View logs         |
| `docker compose exec app go run ./cmd/api` | Run application   |
| `docker compose exec app go test ./...`    | Run tests         |
| `docker compose exec app sh`               | Interactive shell |
| `docker compose down`                      | Stop environment  |

### 4.5 Makefile

```makefile
.PHONY: up down shell run test lint

up:
	docker compose up -d

down:
	docker compose down

shell:
	docker compose exec app sh

run:
	docker compose exec app go run ./cmd/api

test:
	docker compose exec app go test -v ./...

lint:
	docker compose exec app golangci-lint run

build:
	docker compose exec app go build -o bin/api ./cmd/api

```

---

## 5. Naming Conventions

### 5.1 Packages

- Lowercase, single word: `user`, `auth`, `config`
- Avoid: `utils`, `helpers`, `common`, `models`

### 5.2 Types and Structs

```go
// Exported: PascalCase
type UserService struct {}
type HTTPClient struct {}  // Acronyms capitalized

// Unexported: camelCase
type userRepository struct {}

```

### 5.3 Functions and Methods

```go
// Exported
func CreateUser(name string) error {}
func (s *UserService) FindByID(id int64) (*User, error) {}

// Unexported
func validateEmail(email string) bool {}

```

### 5.4 Variables and Constants

```go
// Variables: camelCase
var userCount int
var dbConnection *sql.DB

// Constants: PascalCase for exported, camelCase for unexported
const MaxRetries = 3
const defaultTimeout = 30 * time.Second

```

### 5.5 Files

- Lowercase with underscores: `user_handler.go`, `user_handler_test.go`
- Test files: `_test.go`

---

## 6. Types and Type System

### 6.1 Type Declaration

```go
// Struct
type User struct {
    ID        int64     `json:"id"`
    Email     string    `json:"email"`
    CreatedAt time.Time `json:"created_at"`
}

// Custom type
type UserID int64
type Email string

// Enum pattern
type Status int

const (
    StatusPending Status = iota + 1
    StatusActive
    StatusInactive
)

```

### 6.2 Type Safety

```go
// Good: Use custom types for domain concepts
type Money int64  // cents
type UserID int64

func Transfer(from, to UserID, amount Money) error {
    // Type system prevents mixing IDs with money
    return nil
}

// Bad: Using primitives everywhere
func Transfer(fromID, toID int64, amount int64) error {
    // Easy to mix up parameters
    return nil
}

```

### 6.3 Allocation and Initialization

```go
// Zero value initialization
var user User

// Literal initialization
user := User{
    ID:    1,
    Email: "user@example.com",
}

// Pointer with new
userPtr := new(User)

// Slice allocation
users := make([]User, 0, 100)  // len=0, cap=100

// Map allocation
cache := make(map[string]User)

```

---

## 7. Functions and Methods

### 7.1 Signatures

```go
// Function with multiple returns
func FindUser(ctx context.Context, id int64) (*User, error) {
    if id <= 0 {
        return nil, fmt.Errorf("invalid user id: %d", id)
    }
    // ...
    return &user, nil
}

// Method with receiver
func (s *UserService) Create(ctx context.Context, req CreateUserRequest) (*User, error) {
    // ...
}

// Variadic function
func Log(level string, args ...interface{}) {
    // ...
}

```

### 7.2 Returns and Errors

**Good:**

```go
func GetUser(id int64) (*User, error) {
    user, err := db.FindByID(id)
    if err != nil {
        return nil, fmt.Errorf("find user %d: %w", id, err)
    }
    return user, nil
}

```

**Bad:**

```go
func GetUser(id int64) *User {
    user, err := db.FindByID(id)
    if err != nil {
        log.Println(err)  // Error swallowed!
        return nil        // Caller doesn't know why
    }
    return user
}

```

### 7.3 Best Practices

- Single responsibility per function
- Maximum 3-4 parameters; use struct for more
- Return early for error cases
- Named returns only for documentation

---

## 8. Error Handling

### 8.1 Philosophy

Go uses explicit error values. Errors are values to be handled, not exceptions to be caught.

```go
// Creating errors
err := errors.New("user not found")
err := fmt.Errorf("find user %d: %w", id, cause)

// Custom error types
type NotFoundError struct {
    Resource string
    ID       int64
}

func (e *NotFoundError) Error() string {
    return fmt.Sprintf("%s with id %d not found", e.Resource, e.ID)
}

```

### 8.2 Conventions

**Good:**

```go
func ProcessOrder(ctx context.Context, orderID int64) error {
    order, err := repo.FindOrder(ctx, orderID)
    if err != nil {
        return fmt.Errorf("find order %d: %w", orderID, err)
    }

    if err := validator.Validate(order); err != nil {
        return fmt.Errorf("validate order %d: %w", orderID, err)
    }

    return nil
}

```

**Bad:**

```go
func ProcessOrder(ctx context.Context, orderID int64) error {
    order, err := repo.FindOrder(ctx, orderID)
    if err != nil {
        log.Println(err)  // Logged but not returned!
    }

    validator.Validate(order)  // Error ignored!

    return nil
}

```

### 8.3 Error Checking

```go
// Check specific error types
if errors.Is(err, sql.ErrNoRows) {
    return nil, &NotFoundError{Resource: "user", ID: id}
}

// Unwrap to underlying error
var notFound *NotFoundError
if errors.As(err, &notFound) {
    // Handle not found case
}

```

### 8.4 Best Practices

- Never ignore errors: `_ = doSomething()` is forbidden
- Add context when wrapping: include IDs, operation names
- Use `%w` to preserve error chain
- Log errors at boundaries, not in every function

---

## 9. Concurrency and Parallelism

### 9.1 Concurrency Model

Go uses goroutines (lightweight threads) and channels for communication.

```go
// Start a goroutine
go func() {
    processItem(item)
}()

// Channel for communication
results := make(chan Result, 10)  // buffered channel

// Send and receive
results <- result  // send
result := <-results  // receive

```

### 9.2 Synchronization

```go
// WaitGroup for waiting on goroutines
var wg sync.WaitGroup
for _, item := range items {
    wg.Add(1)
    go func(i Item) {
        defer wg.Done()
        process(i)
    }(item)
}
wg.Wait()

// Mutex for shared state
type SafeCounter struct {
    mu    sync.Mutex
    count int
}

func (c *SafeCounter) Increment() {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.count++
}

```

### 9.3 Context and Cancellation

```go
func Worker(ctx context.Context) error {
    for {
        select {
        case <-ctx.Done():
            return ctx.Err()
        case item := <-work:
            if err := process(item); err != nil {
                return err
            }
        }
    }
}

// With timeout
ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()

```

### 9.4 Common Pitfalls

```go
// Bad: Loop variable capture (Go < 1.22)
for _, item := range items {
    go func() {
        process(item)  // All goroutines see same item!
    }()
}

// Good: Pass as parameter (works in all versions)
for _, item := range items {
    go func(i Item) {
        process(i)
    }(item)
}

```

---

## 10. Interfaces and Abstractions

### 10.1 Interface Design

Keep interfaces small and focused. Go interfaces are satisfied implicitly.

```go
// Good: Small, focused interface
type Reader interface {
    Read(p []byte) (n int, err error)
}

type Writer interface {
    Write(p []byte) (n int, err error)
}

// Compose when needed
type ReadWriter interface {
    Reader
    Writer
}

```

### 10.2 Implementation

```go
// Interface
type UserRepository interface {
    FindByID(ctx context.Context, id int64) (*User, error)
    Save(ctx context.Context, user *User) error
}

// Implementation
type postgresUserRepo struct {
    db *sql.DB
}

func (r *postgresUserRepo) FindByID(ctx context.Context, id int64) (*User, error) {
    // Implementation
}

func (r *postgresUserRepo) Save(ctx context.Context, user *User) error {
    // Implementation
}

// Constructor returns interface
func NewUserRepository(db *sql.DB) UserRepository {
    return &postgresUserRepo{db: db}
}

```

### 10.3 Best Practices

- Define interfaces where they're used, not where implemented
- Accept interfaces, return concrete types
- Avoid empty interface `interface{}` when possible (use `any` in Go 1.18+)

---

## 11. Unit Tests

### 11.1 Structure

```go
// user_test.go
package user

import "testing"

func TestCreateUser(t *testing.T) {
    // Arrange
    svc := NewService()

    // Act
    user, err := svc.Create("test@example.com")

    // Assert
    if err != nil {
        t.Fatalf("unexpected error: %v", err)
    }
    if user.Email != "test@example.com" {
        t.Errorf("got email %q, want %q", user.Email, "test@example.com")
    }
}

```

### 11.2 Table-Driven Tests

```go
func TestValidateEmail(t *testing.T) {
    tests := []struct {
        name    string
        email   string
        wantErr bool
    }{
        {"valid email", "user@example.com", false},
        {"missing @", "userexample.com", true},
        {"empty string", "", true},
        {"valid with plus", "user+tag@example.com", false},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            err := ValidateEmail(tt.email)
            if (err != nil) != tt.wantErr {
                t.Errorf("ValidateEmail(%q) error = %v, wantErr %v",
                    tt.email, err, tt.wantErr)
            }
        })
    }
}

```

### 11.3 Assertions

```go
// Standard library assertions
if got != want {
    t.Errorf("got %v, want %v", got, want)
}

// Fatal stops test immediately
if err != nil {
    t.Fatalf("setup failed: %v", err)
}

// Helper for cleaner errors
t.Helper()  // Call in helper functions

```

### 11.4 Commands

```bash
# Run all tests
go test ./...

# Run specific package
go test ./internal/user

# Run specific test
go test -run TestCreateUser ./internal/user

# With coverage
go test -cover ./...

# Generate coverage report
go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out

# Verbose output
go test -v ./...

# Race detector
go test -race ./...

```

---

## 12. Mocks and Testability

### 12.1 Mock Strategies

```go
// Interface for dependency
type EmailSender interface {
    Send(to, subject, body string) error
}

// Manual mock
type mockEmailSender struct {
    sendFunc func(to, subject, body string) error
    calls    [][]string
}

func (m *mockEmailSender) Send(to, subject, body string) error {
    m.calls = append(m.calls, []string{to, subject, body})
    if m.sendFunc != nil {
        return m.sendFunc(to, subject, body)
    }
    return nil
}

```

### 12.2 Dependency Injection

```go
type UserService struct {
    repo   UserRepository
    mailer EmailSender
}

func NewUserService(repo UserRepository, mailer EmailSender) *UserService {
    return &UserService{repo: repo, mailer: mailer}
}

// Test: svc := NewUserService(&mockRepo{}, &mockMailer{})

```

### 12.3 Test Doubles

| Type | Purpose                               |
| ---- | ------------------------------------- |
| Stub | Returns fixed values                  |
| Mock | Verifies interactions                 |
| Fake | Working implementation (in-memory DB) |
| Spy  | Records calls for later verification  |

---

## 13. Integration Tests

### 13.1 Structure and Organization

Use build tags to separate integration tests:

```go
//go:build integration

package user_test

import (
    "testing"
)

func TestUserRepository_Integration(t *testing.T) {
    if testing.Short() {
        t.Skip("skipping integration test")
    }
    // Test with real database
}

```

### 13.2 Selective Execution

```bash
# Unit tests only (skip integration)
go test -short ./...

# Integration tests only
go test -tags=integration ./...

# All tests
go test -tags=integration ./...

```

### 13.3 Test with Real Dependencies

```go
func setupTestDB(t *testing.T) *sql.DB {
    t.Helper()
    db, err := sql.Open("postgres", os.Getenv("TEST_DATABASE_URL"))
    if err != nil {
        t.Fatalf("failed to connect: %v", err)
    }
    t.Cleanup(func() { db.Close() })
    return db
}

func TestUserRepo_FindByID(t *testing.T) {
    db := setupTestDB(t)
    repo := NewUserRepository(db)
    // Test with real database
}

```

---

## 14. Profiling and Diagnostics

### 14.1 CPU and Memory Profiling

```go
import _ "net/http/pprof"

func main() {
    // Expose pprof endpoints
    go func() {
        log.Println(http.ListenAndServe("localhost:6060", nil))
    }()

    // Your application
}

```

### 14.2 Collecting and Analyzing Profiles

```bash
# CPU profile
go tool pprof <http://localhost:6060/debug/pprof/profile?seconds=30>

# Memory profile
go tool pprof <http://localhost:6060/debug/pprof/heap>

# Interactive analysis
go tool pprof cpu.prof
# Commands: top10, list funcName, web

# Flame graph
go tool pprof -http=:8080 cpu.prof

```

---

## 15. Benchmarks

### 15.1 Writing Benchmarks

```go
func BenchmarkProcessOrder(b *testing.B) {
    svc := NewOrderService()
    order := createTestOrder()

    b.ResetTimer()  // Exclude setup time

    for i := 0; i < b.N; i++ {
        svc.Process(order)
    }
}

// Report allocations
func BenchmarkProcessOrder(b *testing.B) {
    b.ReportAllocs()
    // ...
}

```

### 15.2 Sub-benchmarks

```go
func BenchmarkHash(b *testing.B) {
    for _, size := range []int{64, 1024, 4096} {
        b.Run(fmt.Sprintf("size-%d", size), func(b *testing.B) {
            data := make([]byte, size)
            for i := 0; i < b.N; i++ {
                sha256.Sum256(data)
            }
        })
    }
}

```

### 15.3 Execution and Analysis

```bash
go test -bench=. ./...              # Run all benchmarks
go test -bench=. -benchmem ./...    # With memory stats
go test -bench=. -count=10 > old.txt && benchstat old.txt  # Compare

```

---

## 16. Optimization

### 16.1 Principles

1. **Measure first** - Don't optimize without profiling
2. **Low-hanging fruit** - Fix obvious issues first
3. **Document trade-offs** - Complexity vs performance

### 16.2 Common Optimizations

```go
// Pre-allocate slices when size is known
users := make([]User, 0, len(ids))
for _, id := range ids {
    users = append(users, fetchUser(id))
}

// Use sync.Pool for frequently allocated objects
var bufPool = sync.Pool{
    New: func() interface{} {
        return new(bytes.Buffer)
    },
}

func process(data []byte) {
    buf := bufPool.Get().(*bytes.Buffer)
    defer func() {
        buf.Reset()
        bufPool.Put(buf)
    }()
    // Use buf
}

```

### 16.3 String Optimization

```go
// Bad: String concatenation in loop
var result string
for _, s := range items {
    result += s  // Creates new string each iteration
}

// Good: Use strings.Builder
var builder strings.Builder
for _, s := range items {
    builder.WriteString(s)
}
result := builder.String()

```

### 16.4 Memory Optimization

```go
// Avoid keeping large slices alive
func getFirst(data []byte) []byte {
    // Bad: Keeps entire backing array alive
    return data[:10]

    // Good: Copy to new slice
    result := make([]byte, 10)
    copy(result, data[:10])
    return result
}

```

---

## 17. Security

### 17.1 Essential Practices

- Never hardcode secrets; use environment variables
- Validate all external input
- Use HTTPS for all communications
- Implement rate limiting
- Keep dependencies updated
- Apply principle of least privilege

### 17.2 Input Validation

```go
// Validate at API boundaries
func (h *Handler) CreateUser(w http.ResponseWriter, r *http.Request) {
    var req CreateUserRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, "invalid JSON", http.StatusBadRequest)
        return
    }

    // Validate input
    if len(req.Email) > 255 {
        http.Error(w, "email too long", http.StatusBadRequest)
        return
    }

    if !isValidEmail(req.Email) {
        http.Error(w, "invalid email format", http.StatusBadRequest)
        return
    }

    // Process valid request
}

```

### 17.3 Security Tools

```bash
# Check for vulnerabilities
go install golang.org/x/vuln/cmd/govulncheck@latest
govulncheck ./...

# Static analysis for security
go install github.com/securego/gosec/v2/cmd/gosec@latest
gosec ./...

```

---

## 18. Code Patterns

### 18.1 Early Return

```go
// Good: Early return reduces nesting
func ProcessUser(user *User) error {
    if user == nil {
        return errors.New("user is nil")
    }
    if !user.IsActive {
        return errors.New("user is inactive")
    }
    return sendWelcomeEmail(user)
}

```

### 18.2 Separation of Concerns

```go
// Logic separated from I/O
func CalculateDiscount(price, qty int) int {
    if qty >= 10 {
        return price * qty * 90 / 100
    }
    return price * qty
}

```

### 18.3 Functional Options

```go
type Option func(*Server)

func WithHost(host string) Option {
    return func(s *Server) { s.host = host }
}

func NewServer(opts ...Option) *Server {
    s := &Server{host: "localhost", port: 8080}
    for _, opt := range opts {
        opt(s)
    }
    return s
}

// Usage: server := NewServer(WithHost("0.0.0.0"))

```

---

## 19. Dependency Management

### 19.1 Principles

- Prefer standard library when adequate
- Choose well-maintained dependencies
- Minimize external dependencies
- Use explicit versioning

### 19.2 Commands

```bash
govulncheck ./...                    # Check vulnerabilities
go get -u ./...                      # Update all dependencies
go mod tidy                          # Clean unused
go mod download                      # Download dependencies

```

### 19.3 go.mod Best Practices

```go
module github.com/username/myproject
go 1.25
require github.com/some/package v1.2.3

```

---

## 20. Comments and Documentation

### 20.1 Code Comments

Comment "why", not "what":

```go
// Good: Explains why
// Retry 3 times because the external API has occasional transient failures
for i := 0; i < 3; i++ {
    if err := callAPI(); err == nil {
        break
    }
}

// Bad: Explains what (obvious from code)
// Loop 3 times
for i := 0; i < 3; i++ {
    callAPI()
}

```

### 20.2 API Documentation (GoDoc)

```go
// Package user provides user management functionality.
package user

// User represents a registered user in the system.
type User struct {
    ID    int64
    Email string
}

// FindByID retrieves a user by their unique identifier.
func FindByID(ctx context.Context, id int64) (*User, error)

```

### 20.3 Example Tests

```go
func ExampleFindByID() {
    user, _ := FindByID(context.Background(), 123)
    fmt.Println(user.Email)
    // Output: user@example.com
}

```

---

## 21. Database

### 21.1 Approach

Go provides `database/sql` as the standard interface for SQL databases. Approaches:

| Approach      | Pros                           | Cons                        |
| ------------- | ------------------------------ | --------------------------- |
| Raw SQL       | Full control, performance      | Verbose, manual mapping     |
| Query Builder | Type safety, flexibility       | Learning curve              |
| ORM           | Productivity, less boilerplate | Magic, performance overhead |

### 21.2 Connection and Driver

```go
import (
    "context"
    "database/sql"
    "time"

    _ "github.com/lib/pq"  // PostgreSQL driver
)

func NewDB(dsn string) (*sql.DB, error) {
    db, err := sql.Open("postgres", dsn)
    if err != nil {
        return nil, fmt.Errorf("open database: %w", err)
    }

    // Configure connection pool
    db.SetMaxOpenConns(25)
    db.SetMaxIdleConns(5)
    db.SetConnMaxLifetime(5 * time.Minute)
    db.SetConnMaxIdleTime(1 * time.Minute)

    // Verify connection
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    if err := db.PingContext(ctx); err != nil {
        return nil, fmt.Errorf("ping database: %w", err)
    }

    return db, nil
}

```

### 21.3 Queries with Prepared Statements

```go
// Query single row
func (r *UserRepo) FindByID(ctx context.Context, id int64) (*User, error) {
    query := `SELECT id, email, created_at FROM users WHERE id = $1`

    var user User
    err := r.db.QueryRowContext(ctx, query, id).Scan(
        &user.ID,
        &user.Email,
        &user.CreatedAt,
    )
    if err == sql.ErrNoRows {
        return nil, ErrNotFound
    }
    if err != nil {
        return nil, fmt.Errorf("query user %d: %w", id, err)
    }

    return &user, nil
}

// Query multiple rows
func (r *UserRepo) FindAll(ctx context.Context) ([]User, error) {
    rows, err := r.db.QueryContext(ctx, `SELECT id, email FROM users`)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var users []User
    for rows.Next() {
        var u User
        if err := rows.Scan(&u.ID, &u.Email); err != nil {
            return nil, err
        }
        users = append(users, u)
    }
    return users, rows.Err()
}

```

### 21.4 Transactions

```go
func (r *UserRepo) CreateWithProfile(ctx context.Context, user *User) error {
    tx, err := r.db.BeginTx(ctx, nil)
    if err != nil {
        return fmt.Errorf("begin: %w", err)
    }
    defer tx.Rollback()

    if err := tx.QueryRowContext(ctx,
        `INSERT INTO users (email) VALUES ($1) RETURNING id`,
        user.Email).Scan(&user.ID); err != nil {
        return fmt.Errorf("insert: %w", err)
    }

    return tx.Commit()
}

```

### 21.5 Best Practices

- Always use parameterized queries (prevent SQL injection)
- Use context for timeouts and cancellation
- Close rows after iteration
- Configure connection pool appropriately
- Handle `sql.ErrNoRows` explicitly

---

## 22. Logs and Observability

### 22.1 Log Levels

| Level | Usage                          |
| ----- | ------------------------------ |
| DEBUG | Detailed debugging info        |
| INFO  | Normal operations              |
| WARN  | Potentially harmful situations |
| ERROR | Errors that need attention     |

### 22.2 Structured Logging with slog

```go
import (
    "log/slog"
    "os"
)

func setupLogger() *slog.Logger {
    // JSON handler for production
    handler := slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
        Level: slog.LevelInfo,
    })

    logger := slog.New(handler)
    slog.SetDefault(logger)

    return logger
}

// Text handler for development
func setupDevLogger() *slog.Logger {
    handler := slog.NewTextHandler(os.Stdout, &slog.HandlerOptions{
        Level: slog.LevelDebug,
    })
    return slog.New(handler)
}

```

### 22.3 Logging with Context

```go
func (s *UserService) CreateUser(ctx context.Context, email string) (*User, error) {
    logger := slog.With(
        "operation", "CreateUser",
        "email", email,
    )

    logger.Info("creating user")

    user, err := s.repo.Create(ctx, email)
    if err != nil {
        logger.Error("failed to create user",
            "error", err,
        )
        return nil, err
    }

    logger.Info("user created",
        "user_id", user.ID,
    )

    return user, nil
}

```

### 22.4 Request Logging Middleware

```go
func LoggingMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()
        next.ServeHTTP(w, r)
        slog.Info("request",
            "method", r.Method,
            "path", r.URL.Path,
            "duration_ms", time.Since(start).Milliseconds(),
        )
    })
}

```

### 22.5 Health Endpoints

```go
func (h *Handler) Health(w http.ResponseWriter, r *http.Request) {
    json.NewEncoder(w).Encode(map[string]string{"status": "healthy"})
}

func (h *Handler) Ready(w http.ResponseWriter, r *http.Request) {
    if err := h.db.PingContext(r.Context()); err != nil {
        w.WriteHeader(http.StatusServiceUnavailable)
        return
    }
    json.NewEncoder(w).Encode(map[string]string{"status": "ready"})
}

```

---

## 23. Golden Rules

1. **Simplicity** - Write clear, straightforward code. Clever is the enemy of maintainable.
2. **Explicit Errors** - Always handle errors explicitly. Never use `_` to ignore errors.
3. **Tests** - Write tests for critical paths. Use table-driven tests for comprehensive coverage.
4. **Documentation** - Document public APIs with GoDoc. Comment "why", not "what".
5. **Measured Performance** - Profile before optimizing. Benchmarks prove improvements.
6. **Small Interfaces** - Accept interfaces, return concrete types. Keep interfaces minimal.
7. **Context Propagation** - Pass context through all I/O operations for cancellation and timeouts.

---

## 24. Pre-Commit Checklist

### Code

- [ ] `gofmt` applied
- [ ] `go vet` passes
- [ ] `golangci-lint` passes
- [ ] Code compiles: `go build ./...`

### Tests

- [ ] All tests pass: `go test ./...`
- [ ] Coverage >= 70% on critical code
- [ ] Race detector passes: `go test -race ./...`
- [ ] Integration tests pass (if applicable)

### Quality

- [ ] Errors handled explicitly
- [ ] Resources properly closed (defer)
- [ ] No hardcoded secrets
- [ ] No vulnerable dependencies: `govulncheck ./...`

### Documentation

- [ ] Public functions documented
- [ ] Package documentation complete
- [ ] README updated (if applicable)

### Docker (if applicable)

- [ ] Dockerfile valid
- [ ] docker-compose.yaml functional
- [ ] Application starts in container

---

## 25. References

### Official Documentation

- [Go Documentation](https://go.dev/doc/)
- [Effective Go](https://go.dev/doc/effective_go)
- [Go Code Review Comments](https://go.dev/wiki/CodeReviewComments)
- [Go Modules](https://go.dev/doc/modules/layout)

### Style Guides

- [Google Go Style Guide](https://google.github.io/styleguide/go/)
- [Uber Go Style Guide](https://github.com/uber-go/guide)

### Tools

- [golangci-lint](https://golangci-lint.run/)
- [govulncheck](https://pkg.go.dev/golang.org/x/vuln/cmd/govulncheck)
- [staticcheck](https://staticcheck.dev/)

### Testing

- [Go Testing](https://go.dev/doc/tutorial/add-a-test)
- [testify](https://github.com/stretchr/testify)
- [testcontainers-go](https://golang.testcontainers.org/)

### Performance

- [pprof](https://pkg.go.dev/net/http/pprof)
- [benchstat](https://pkg.go.dev/golang.org/x/perf/cmd/benchstat)

### Logging

- [log/slog](https://go.dev/blog/slog)

### Database

- [database/sql](https://pkg.go.dev/database/sql)
- [pgx](https://github.com/jackc/pgx)
- [sqlc](https://sqlc.dev/)
