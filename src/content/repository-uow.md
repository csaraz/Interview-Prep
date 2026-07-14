---
title: Repository & Unit of Work Patterns
level: Mid
category: Patterns & Architecture
tags: repository, unit-of-work, ef-core, testing
order: 80
---

## Repository pattern — why we use it

Abstracts data access behind an interface: business logic talks to `IOrderRepository`, not to EF Core / SQL directly.

```csharp
public interface IOrderRepository
{
    Task<Order?> GetByIdAsync(int id);
    Task AddAsync(Order order);
    Task<List<Order>> GetPendingAsync();
}

public class OrderRepository : IOrderRepository
{
    private readonly AppDbContext _db;
    public OrderRepository(AppDbContext db) => _db = db;

    public Task<Order?> GetByIdAsync(int id)
        => _db.Orders.FirstOrDefaultAsync(o => o.Id == id);

    public async Task AddAsync(Order order) => await _db.Orders.AddAsync(order);

    public Task<List<Order>> GetPendingAsync()
        => _db.Orders.Where(o => o.Status == OrderStatus.Pending).ToListAsync();
}
```

Benefits:

- **Testability** — mock `IOrderRepository` in unit tests, no DB needed
- **Decoupling** — domain doesn't depend on EF (Clean Architecture: interface in Application/Domain, implementation in Infrastructure)
- **Centralized query logic** — no LINQ duplicated across services

## Unit of Work

Coordinates several repository operations into **one transaction** — everything commits or nothing does.

```csharp
public interface IUnitOfWork
{
    IOrderRepository Orders { get; }
    ICustomerRepository Customers { get; }
    Task<int> SaveChangesAsync();
}
```

## The honest senior answer

**EF Core already implements both**: `DbContext` *is* a Unit of Work (change tracking + `SaveChanges` = one transaction) and `DbSet<T>` *is* a repository. So:

- Wrapping EF in repositories pays off when you need **domain-driven abstraction**, swappable persistence, or strict Clean Architecture layering
- For simple apps it can be **needless ceremony** — injecting `DbContext` directly is legitimate
- Anti-pattern warning: generic `IRepository<T>` with `IQueryable` leakage gives you the worst of both worlds

## Interview one-liners

- "Repository = persistence behind an interface → testable, swappable."
- "DbContext is already a Unit of Work and DbSet a repository — extra layers must earn their keep."
