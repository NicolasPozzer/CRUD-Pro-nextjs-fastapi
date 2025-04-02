# main-autos.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

# Base de datos en memoria (para ejemplo)
db = {
    "departamentos": [
        {"id": 1, "nombre": "Ventas", "descripcion": "Equipo de ventas", "activo": True},
        {"id": 2, "nombre": "TI", "descripcion": "Tecnologías de la información", "activo": True},
    ],
    "eliminados": []
}

class Departamento(BaseModel):
    id: Optional[int] = None
    nombre: str
    descripcion: str
    activo: bool = True

@app.get("/departamentos", response_model=List[Departamento])
def listar_departamentos():
    return db["departamentos"]

@app.post("/departamentos", response_model=Departamento, status_code=201)
def crear_departamento(departamento: Departamento):
    nuevo_id = max(dep["id"] for dep in db["departamentos"]) + 1 if db["departamentos"] else 1
    departamento.id = nuevo_id
    db["departamentos"].append(departamento.dict())
    return departamento


@app.get("/departamentos/{id}", response_model=Departamento)
def obtener_departamento(id: int):
    for dep in db["departamentos"]:
        if dep["id"] == id:
            return dep
    raise HTTPException(status_code=404, detail="Departamento no encontrado")

@app.put("/departamentos/{id}", response_model=Departamento)
def actualizar_departamento(id: int, departamento: Departamento):
    for idx, dep in enumerate(db["departamentos"]):
        if dep["id"] == id:
            departamento.id = id
            db["departamentos"][idx] = departamento.dict()
            return departamento
    raise HTTPException(status_code=404, detail="Departamento no encontrado")

@app.delete("/departamentos/{id}", status_code=204)
def eliminar_departamento(id: int):
    for idx, dep in enumerate(db["departamentos"]):
        if dep["id"] == id:
            db["eliminados"].append(db["departamentos"].pop(idx))
            return
    raise HTTPException(status_code=404, detail="Departamento no encontrado")

@app.patch("/departamentos/{id}/restaurar", response_model=Departamento)
def restaurar_departamento(id: int):
    for idx, dep in enumerate(db["eliminados"]):
        if dep["id"] == id:
            db["departamentos"].append(db["eliminados"].pop(idx))
            return dep
    raise HTTPException(status_code=404, detail="Departamento eliminado no encontrado")

@app.get("/departamentos/{id}/eliminadas", response_model=List[Departamento])
def listar_eliminadas(id: int):
    # En un caso real, filtrarías por el id del departamento
    return db["eliminados"]