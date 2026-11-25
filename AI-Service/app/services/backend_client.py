import httpx

from app.core.config import settings


class BackendClient:

    def __init__(self):
        self.base_url = settings.BACKEND_BASE_URL

    async def get(
        self,
        endpoint: str,
        access_token: str
    ):

        headers = {
            "Authorization": access_token
        }

        async with httpx.AsyncClient(
            timeout=15.0
        ) as client:

            response = await client.get(
                f"{self.base_url}{endpoint}",
                headers=headers
            )

            response.raise_for_status()

            return response.json()


backend_client = BackendClient()