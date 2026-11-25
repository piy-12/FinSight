from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    APP_NAME: str = "FinSight AI Service"

    APP_VERSION: str = "1.0.0"

    ENVIRONMENT: str = "development"

    BACKEND_BASE_URL: str = "http://localhost:5000"

    GOOGLE_API_KEY: str | None = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()