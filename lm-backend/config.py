from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Use 127.0.0.1 instead of localhost to avoid the ECONNREFUSED issues we saw
    DATABASE_URL: str = "mongodb://127.0.0.1:27017"
    DATABASE_NAME: str = "loadmate_db"
    SECRET_KEY: str = "YOUR_SUPER_SECRET_KEY_2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080

# YOU MUST HAVE THIS LINE:
settings = Settings()