from fastapi import APIRouter, FastAPI
from . import context, journal, generate, search

router = APIRouter()

router.include_router(context.router)
router.include_router(generate.router)
router.include_router(journal.router)
router.include_router(search.router)

apps_api = FastAPI()
apps_api.include_router(router)