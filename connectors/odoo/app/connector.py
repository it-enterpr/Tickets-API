from fastapi import FastAPI, HTTPException
import odoorpc
from .schemas import OdooCredentials

app = FastAPI(title="Task-Man Odoo Connector")

@app.post("/fetch-tasks")
def fetch_odoo_tasks(creds: OdooCredentials):
    """
    Připojí se k Odoo a vrátí seznam úkolů.
    """
    # Blok TRY pro připojení
    try:
        # Předpokládáme standardní Odoo.com hosting s SSL na portu 443
        odoo = odoorpc.ODOO(creds.url, protocol='jsonrpc+ssl', port=443)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Odoo Connection Error: {e}")

    # Blok TRY pro přihlášení
    try:
        odoo.login(creds.db, creds.username, creds.password)
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Odoo Login Error: {e}")

    # Pokud přihlášení proběhlo, získáme úkoly
    if 'project.task' in odoo.env:
        Task = odoo.env['project.task']
        # Hledáme všechny úkoly a načítáme jen potřebná pole
        tasks_data = Task.search_read([], ['name', 'date_deadline', 'stage_id'])

        # Přeformátujeme data pro čistší odpověď
        formatted_tasks = [
            {
                "id": task['id'],
                "name": task['name'],
                "deadline": task['date_deadline'],
                "stage": task['stage_id'][1] if task['stage_id'] else "No Stage"
            }
            for task in tasks_data
        ]
        return formatted_tasks
    else:
        # Pokud model 'project.task' v Odoo neexistuje
        return []