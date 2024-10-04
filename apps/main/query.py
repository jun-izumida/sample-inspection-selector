from typing import List, Union
from django.conf import settings
import strawberry
import strawberry_django
from strawberry import auto
from django.db.models import Prefetch, Q
import datetime
import random
import io
import requests
from .common import *
from .types import *

hosts = [
    {
        "address": "10.52.34.44",
        "netbios": "sjp300aa001",
        "username": "jun.izumida",
        "password": "RB20dettP!",
        "share_name": "data",
        "search_path": "/"
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
            print(host)
            host = host[0]
            c = SMBCtl(host["username"], host["password"], host["netbios"], host["address"], 139)
            print(c)
            files = c.file_list(host["share_name"], host["search_path"])
            return files
        else:
            return []

    @strawberry.field
    def search_lot(self, lot:str) -> SearchLotType:
        r = requests.get(f"{settings.EXTERNAL_API_ENDPOINT}{settings.EXTERNAL_API_URL_EPR}", params={"lot": lot})
        data = r.json()["data"]
        result = list(filter(lambda x: x["proccd"] == "CBF320500", data))
        if len(result) > 0:
            result = ResultType(
                product=result[0]["product"],
                proccd=result[0]["proccd"],
                procnm=result[0]["procnm"],
                lot=result[0]["lot"],
                ymd=datetime.datetime.strptime(result[0]["ymd"], "%Y-%m-%d %H:%M:%S"),
                userid=result[0]["userid"],
                usernm=result[0]["usernm"],
                resourcecd=result[0]["resourcecd"],
                resname=result[0]["resname"],
                prenum=result[0]["prenum"],
                num=result[0]["num"],
                ngnum=result[0]["ngnum"],
                coatlot=result[0]["coatlot"],
            )
        else:
            result = None
        if not result is None:
            #r = requests.get(f"{settings.EXTERNAL_API_ENDPOINT}{settings.EXTERNAL_API_URL_TRACE}", params={"coatlot":  result["coatlot"]})
            r = requests.get(f"{'http://127.0.0.1:8000'}{settings.EXTERNAL_API_URL_TRACE}", params={"coatlot":  result.coatlot})
            trace = list(map(lambda x: TraceType(
                dm_lot=x["lot"],
                dm_stage=x["dm_stage"],
                dm_code=x["dm_code"],
                dm_suffix=x["dm_suffix"],
                ring=x["ring"],
                sequence=x["sequence"],
            ), r.json()))
            stages = sorted(set(list(map(lambda x: x.dm_stage, trace))))
        else:
            trace = None

        return SearchLotType(
            result=result,
            trace=trace,
            stages=stages
        )