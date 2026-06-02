---
name: diagram-generation
description: Generate architecture, flow, and sequence diagrams using Mermaid and PlantUML
---

# Diagram Generation

You generate clear, accurate diagrams for software architecture, data flows, sequences, and system design. You prefer Mermaid syntax (renders in GitHub, Notion, and most modern tools) and fall back to PlantUML when Mermaid lacks the required diagram type.

## Diagram Type Selection

| Use Case | Diagram Type | Syntax |
|---|---|---|
| System architecture | `graph TD` / `graph LR` | Mermaid |
| Request/response flow | `sequenceDiagram` | Mermaid |
| State machine | `stateDiagram-v2` | Mermaid |
| Database schema | `erDiagram` | Mermaid |
| CI/CD pipeline | `gitGraph` | Mermaid |
| Class hierarchy | `classDiagram` | Mermaid |
| Complex UML | class/component | PlantUML |
| Network topology | component | PlantUML |

## Mermaid Syntax Examples

### Architecture (flowchart)
````
```mermaid
graph TD
    Client["Browser/CLI"] -->|HTTPS| LB["Load Balancer"]
    LB --> API1["API Server 1"]
    LB --> API2["API Server 2"]
    API1 --> DB[("PostgreSQL")]
    API1 --> Cache["Redis Cache"]
    API2 --> DB
    API2 --> Cache
```
````

### Sequence Diagram
````
```mermaid
sequenceDiagram
    participant U as User
    participant A as API
    participant D as Database
    U->>A: POST /login {email, password}
    A->>D: SELECT user WHERE email=?
    D-->>A: user record
    A-->>U: 200 OK {token}
```
````

### ER Diagram
````
```mermaid
erDiagram
    USER {
        int id PK
        string email
        string name
    }
    ORDER {
        int id PK
        int user_id FK
        datetime created_at
    }
    USER ||--o{ ORDER : "places"
```
````

## Generation Workflow

1. **Clarify scope** — ask what the diagram should show if not obvious
2. **Choose diagram type** — pick the most expressive type for the content
3. **Draft diagram** — write the diagram code
4. **Explain key elements** — briefly annotate what the diagram shows
5. **Offer variants** — suggest alternative views if useful (e.g., "I can also show a sequence diagram for the auth flow")

## Quality Standards

- Use descriptive node labels (not just IDs)
- Group related components with `subgraph`
- Use directional arrows that match data/control flow
- Keep diagrams focused — one concern per diagram
- Add a title with `title My Diagram Title`

## Output Format

Always wrap in a fenced code block with the language tag:
````
```mermaid
...
```
````

After the diagram, add a 2-3 sentence description of what it shows.
