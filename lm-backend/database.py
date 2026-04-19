from motor.motor_asyncio import AsyncIOMotorClient
import config

# This looks for 'settings' inside the 'config' module
client = AsyncIOMotorClient(config.settings.DATABASE_URL)
db = client[config.settings.DATABASE_NAME]

users_collection = db.get_collection("users")
loads_collection = db.get_collection("loads")