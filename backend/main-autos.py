# main-autos.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

# Base de datos en memoria (para ejemplo)
db = {
    "autos": [
        {"id": 1, "nombre": "Ventas", "descripcion": "Equipo de ventas", "activo": True},
        {"id": 2, "nombre": "TI", "descripcion": "Tecnologías de la información", "activo": True},
    ],
    "eliminados": []
}

class Auto(BaseModel):
    id: Optional[int] = None
    nombre: str
    descripcion: str
    activo: bool = True

@app.get("/autos", response_model=List[Auto])
def listar_autos():
    return db["autos"]

@app.post("/autos", response_model=Auto, status_code=201)
def crear_auto(auto: Auto):
    nuevo_id = max(dep["id"] for dep in db["autos"]) + 1 if db["autos"] else 1
    auto.id = nuevo_id
    db["autos"].append(auto.dict())
    return auto


@app.get("/autos/{id}", response_model=Auto)
def obtener_auto(id: int):
    for dep in db["autos"]:
        if dep["id"] == id:
            return dep
    raise HTTPException(status_code=404, detail="auto no encontrado")

@app.put("/autos/{id}", response_model=Auto)
def actualizar_auto(id: int, auto: Auto):
    for idx, dep in enumerate(db["autos"]):
        if dep["id"] == id:
            auto.id = id
            db["autos"][idx] = auto.dict()
            return auto
    raise HTTPException(status_code=404, detail="auto no encontrado")

@app.delete("/autos/{id}", status_code=204)
def eliminar_auto(id: int):
    for idx, dep in enumerate(db["autos"]):
        if dep["id"] == id:
            db["eliminados"].append(db["autos"].pop(idx))
            return
    raise HTTPException(status_code=404, detail="auto no encontrado")

@app.patch("/autos/{id}/restaurar", response_model=Auto)
def restaurar_auto(id: int):
    for idx, dep in enumerate(db["eliminados"]):
        if dep["id"] == id:
            db["autos"].append(db["eliminados"].pop(idx))
            return dep
    raise HTTPException(status_code=404, detail="auto eliminado no encontrado")

@app.get("/autos/{id}/eliminadas", response_model=List[Auto])
def listar_eliminadas(id: int):
    # En un caso real, filtrarías por el id del auto
    return db["eliminados"]