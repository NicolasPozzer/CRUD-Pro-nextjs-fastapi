from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Departamento as DepartamentoModel
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()


# Dependencia para obtener la sesión de la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Schema de entrada/salida
class DepartamentoSchema(BaseModel):
    id: Optional[int] = None
    nombre: str
    descripcion: str
    activo: bool = True

    class Config:
        from_attributes = True  # Permite convertir SQLAlchemy a Pydantic


# 📌 Obtener todos los departamentos
@app.get("/departamentos", response_model=List[DepartamentoSchema])
def listar_departamentos(db: Session = Depends(get_db)):
    return db.query(DepartamentoModel).all()


# 📌 Crear un departamento
@app.post("/departamentos", response_model=DepartamentoSchema, status_code=201)
def crear_departamento(departamento: DepartamentoSchema, db: Session = Depends(get_db)):
    nuevo_departamento = DepartamentoModel(**departamento.model_dump(exclude={"id"}))
    db.add(nuevo_departamento)
    db.commit()
    db.refresh(nuevo_departamento)
    return nuevo_departamento


# 📌 Obtener un departamento por ID
@app.get("/departamentos/{id}", response_model=DepartamentoSchema)
def obtener_departamento(id: int, db: Session = Depends(get_db)):
    departamento = db.query(DepartamentoModel).filter(DepartamentoModel.id == id).first()
    if not departamento:
        raise HTTPException(status_code=404, detail="Departamento no encontrado")
    return departamento


# 📌 Actualizar un departamento
@app.put("/departamentos/{id}", response_model=DepartamentoSchema)
def actualizar_departamento(id: int, departamento: DepartamentoSchema, db: Session = Depends(get_db)):
    dep_actual = db.query(DepartamentoModel).filter(DepartamentoModel.id == id).first()
    if not dep_actual:
        raise HTTPException(status_code=404, detail="Departamento no encontrado")

    for key, value in departamento.model_dump(exclude={"id"}).items():
        setattr(dep_actual, key, value)

    db.commit()
    return dep_actual


# 📌 Eliminar un departamento
@app.delete("/departamentos/{id}", status_code=204)
def eliminar_departamento(id: int, db: Session = Depends(get_db)):
    departamento = db.query(DepartamentoModel).filter(DepartamentoModel.id == id).first()
    if not departamento:
        raise HTTPException(status_code=404, detail="Departamento no encontrado")

    db.delete(departamento)
    db.commit()
