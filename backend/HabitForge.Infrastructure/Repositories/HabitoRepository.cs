using Microsoft.EntityFrameworkCore;
using HabitForge.Application.Interfaces;
using HabitForge.Domain.Entities;
using HabitForge.Infrastructure.Data;
using Npgsql;

namespace HabitForge.Infrastructure.Repositories;

public class HabitoRepository : IHabitoRepository
{
    private readonly HabitForgeDbContext _context;

    public HabitoRepository(HabitForgeDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<HabitoGlobal>> GetAllAsync()
    {
        return await _context.HabitosGlobales.ToListAsync();
    }

    public async Task<HabitoGlobal> AddAsync(HabitoGlobal habito)
    {
        await _context.HabitosGlobales.AddAsync(habito);

        await _context.SaveChangesAsync();

        return habito;
    }

    public async Task<HabitoGlobal?> GetByIdAsync(int id)
    {
    return await _context.HabitosGlobales.FindAsync(id);
    }

    public async Task UpdateAsync(HabitoGlobal habito)
    {
        _context.HabitosGlobales.Update(habito);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> IntentarEliminarAsync(HabitoGlobal habito)
    {
        _context.HabitosGlobales.Remove(habito);
        try
        {
            await _context.SaveChangesAsync();
            return true;
        }
        catch (DbUpdateException error) when (error.InnerException is PostgresException
            { SqlState: PostgresErrorCodes.ForeignKeyViolation, ConstraintName: CumplimientoDiarioConfiguration.ClaveHabito })
        {
            _context.Entry(habito).State = EntityState.Detached;
            return false;
        }
    }
}
