import sqlite3

DATABASE_NAME = "database.db"

def init_db():
    """Cria e popula as tabelas Metrics e Actions no banco de dados SQLite."""
    conn = sqlite3.connect(DATABASE_NAME)
    cursor = conn.cursor()

    # 1. Tabela Metrics (Métricas de Sustentabilidade)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS metrics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            value REAL NOT NULL,
            unit TEXT NOT NULL,
            change_percent REAL NOT NULL,
            change_period TEXT NOT NULL
        )
    """)

    # 2. Tabela Actions (Ações Sustentáveis)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS actions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            description TEXT NOT NULL,
            status TEXT NOT NULL,
            category TEXT NOT NULL
        )
    """)

    # 3. Tabela Users (Usuários)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL, -- Em um projeto real, a senha deve ser hasheada!
            name TEXT
        )
    """)

    # Limpar dados existentes antes de popular
    cursor.execute("DELETE FROM metrics")
    cursor.execute("DELETE FROM actions")
    cursor.execute("DELETE FROM users")



    # Dados Iniciais para Actions (Baseado no Dashboard)

    # Dados Iniciais para Users (Usuário de demonstração)
    users_data = [
        ("teste@4good.com", "123456", "Teste")
    ]
    cursor.executemany("""
        INSERT INTO users (email, password, name)
        VALUES (?, ?, ?)
    """, users_data)


    conn.commit()
    conn.close()
    print(f"Banco de dados '{DATABASE_NAME}' inicializado com sucesso.")

if __name__ == "__main__":
    init_db()
