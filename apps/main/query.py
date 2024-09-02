from typing import List, Union
import strawberry
import strawberry_django
from strawberry import auto
from django.db.models import Prefetch, Q
import datetime
import random
import io
from .common import *

hosts = [
    {
        "address": "192.168.3.19",
        "netbios": "RYZEN",
        "username": "luvibook@live.jp",
        "password": "RB20dett"
    }
]

@strawberry.type
class Query:
    @strawberry.field
    def msg(self) -> str:
        c = SMBCtl('luvibook@live.jp', 'RB20dett', 'RYZEN', '192.168.3.19', 139)
        l = c.file_list("share", "/")
        return ".".join(l)


    @strawberry.field
    def search_files(self, address:str) -> List[str]:
        host  = list(filter(lambda x: x["address"] == address, hosts))
        if (len(host) > 0):
            host = host[0]
            c = SMBCtl(host["username"], host["password"], host["netbios"], host["address"], 139)
            files = c.file_list("share", "/")
            return files
        else:
            return []