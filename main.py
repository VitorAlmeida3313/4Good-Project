from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
from pydantic import BaseModel

app = FastAPI()

# Modelo de dados para a requisição de login
class LoginRequest(BaseModel):
    email: str
    password: str

# Modelo de dados para a criação de uma nova ação
class ActionCreate(BaseModel):
    description: str
    status: str
    category: str
class LoginRequest(BaseModel):
    email: str
    password: str

# Configuração do CORS para permitir que o frontend (rodando em localhost) acesse a API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite todas as origens para facilitar o desenvolvimento local
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_NAME = "database.db"

def get_db_connection():
    """Cria e retorna a conexão com o banco de dados."""
    conn = sqlite3.connect(DATABASE_NAME)
    conn.row_factory = sqlite3.Row  # Permite acessar colunas por nome
    return conn

@app.get("/api/metrics")
def get_metrics():
    """Retorna todas as métricas de sustentabilidade."""
    conn = get_db_connection()
    metrics = conn.execute("SELECT * FROM metrics").fetchall()
    conn.close()
    # Converte as linhas do SQLite para uma lista de dicionários
    return [dict(row) for row in metrics]

@app.get("/api/actions")
def get_actions():
    """Retorna todas as ações sustentáveis."""
    conn = get_db_connection()
    actions = conn.execute("SELECT * FROM actions").fetchall()
    conn.close()
    return [dict(row) for row in actions]

@app.post("/api/actions")
def create_action(action: ActionCreate):
    """Cria uma nova ação sustentável."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO actions (description, status, category) VALUES (?, ?, ?)",
        (action.description, action.status, action.category)
    )
    conn.commit()
    action_id = cursor.lastrowid
    conn.close()
    return {"success": True, "id": action_id, "message": "Ação criada com sucesso!"}

@app.get("/api/summary")
def get_summary():
    """Retorna um resumo das ações concluídas e em progresso."""
    conn = get_db_connection()
    
    completed = conn.execute("SELECT COUNT(*) FROM actions WHERE status = 'Concluída'").fetchone()[0]
    in_progress = conn.execute("SELECT COUNT(*) FROM actions WHERE status = 'Em Progresso'").fetchone()[0]
    
    conn.close()
    return {
        "completed": completed,
        "in_progress": in_progress
    }

@app.post("/api/login")
def login(request: LoginRequest):
    """Autentica o usuário."""
    conn = get_db_connection()
    user = conn.execute(
        "SELECT email, name FROM users WHERE email = ? AND password = ?",
        (request.email, request.password)
    ).fetchone()
    conn.close()

    if user:
        # Em um projeto real, você retornaria um token JWT
        return {"success": True, "message": "Login bem-sucedido!", "user": dict(user)}
    else:
        return {"success": False, "message": "E-mail ou senha inválidos."}

@app.get("/")
def read_root():
    return {"message": "API 4Good rodando! Acesse /api/metrics, /api/actions, /api/summary ou /api/login (POST)"}
