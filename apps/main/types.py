from typing import List, Optional
import datetime
import strawberry
import strawberry_django
from strawberry import auto
from django.conf import settings
from .models import *
from strawberry.scalars import JSON
from strawberry.types import Info

@strawberry.type
class DebugType:
    debug_mode: bool

    @strawberry.field
    def debug_mode(self) -> bool:
        return settings.DEBUG


@strawberry.type
class ResultType:
    product: str
    proccd: str
    procnm: str
    lot: str
    ymd: datetime.datetime
    userid: str
    resourcecd: str
    prenum: int
    num: int
    ngnum: int
    usernm: str
    resname: str
    coatlot: str

@strawberry.type
class TraceType:
    dm_lot: str
    dm_stage: str
    dm_code: str
    dm_suffix: str
    ring: str
    sequence: str

@strawberry.type
class SearchLotType:
    result: Optional["ResultType"]
    trace: Optional[List["TraceType"]]
    stages: Optional[List[int]]