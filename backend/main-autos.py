from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

# Simulación de la base de datos en memoria
class DB: # esta clase no se debe instanciar ya que forma parte de la memoria al correr
    autos: List["Auto"] = []
    eliminados: List["Auto"] = []
    id_counter: int = 1

# Modelo Auto
class Auto(BaseModel): # esta clase si se van instanciando y creando ya q son serializables
    id: Optional[int] = None
    nombre: str
    descripcion: str
    activo: bool = True


### crear objetos iniciales de prueba si se desean
"""
auto = Auto(id=1,nombre="Nuevo Auto", descripcion="Descripción del auto", activo=True)
auto2 = Auto(nombre="Nuevo Auto", descripcion="Descripción del auto", activo=True)
DB.autos.append(auto)
DB.autos.append(auto2)
"""

# Listar autos activos
@app.get("/autos", response_model=List[Auto])
def listar_autos():
    return DB.autos

# Crear nuevo auto
@app.post("/autos", response_model=Auto, status_code=201)
def crear_auto(auto: Auto):
    auto.id = DB.id_counter
    DB.id_counter += 1
    DB.autos.append(auto)
    return auto

# Listar autos eliminados
@app.get("/autos/eliminadas", response_model=List[Auto])
def listar_eliminadas():
    return DB.eliminados

# Obtener auto por ID
@app.get("/autos/{id}", response_model=Auto)
def obtener_auto(id: int):
    for auto in DB.autos:
        if auto.id == id:
            return auto
    raise HTTPException(status_code=404, detail="Auto no encontrado")

# Actualizar auto por ID
@app.put("/autos/{id}", response_model=Auto)
def actualizar_auto(id: int, auto: Auto):
    for auto_existente in DB.autos:
        if auto_existente.id == id:
            auto.id = id
            DB.autos[DB.autos.index(auto_existente)] = auto
            return auto
    raise HTTPException(status_code=404, detail="Auto no encontrado")

# Eliminar auto (mover a lista de eliminados)
@app.delete("/autos/{id}", status_code=204)
def eliminar_auto(id: int):
    for auto in DB.autos:
        if auto.id == id:
            DB.eliminados.append(auto)
            DB.autos.remove(auto)
            return
    raise HTTPException(status_code=404, detail="Auto no encontrado")

# Restaurar auto eliminado
@app.patch("/autos/{id}/restaurar", response_model=Auto)
def restaurar_auto(id: int):
    for auto in DB.eliminados:
        if auto.id == id:
            DB.autos.append(auto)
            DB.eliminados.remove(auto)
            return auto
    raise HTTPException(status_code=404, detail="Auto eliminado no encontrado")