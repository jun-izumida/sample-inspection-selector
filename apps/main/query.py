from typing import List, Union, Optional
from django.conf import settings
import strawberry
import strawberry_django
from strawberry import auto
from django.db.models import Prefetch, Q
import datetime
import random
import io
import requests
import yaml
import re
import smb
from smbclient import register_session
from smbprotocol.connection import Connection,Dialects
from smbprotocol.session import Session
from smbprotocol.tree import TreeConnect
from smbprotocol.open import (
    CreateDisposition,
    CreateOptions,
    DirectoryAccessMask,
    FileAttributes,
    FileInformationClass,
    FilePipePrinterAccessMask,
    ImpersonationLevel,
    Open,
    ShareAccess,
)
from smbprotocol.file_info import FileInformationClass
import uuid
from pymongo import MongoClient
from .common import *
from .types import *

@strawberry.type
class Query:
    @strawberry.field
    def search_files(self, machine_code:str, prefix:str) -> Optional[List[str]]:
        with open(settings.FILE_SEARCH_CONFIG) as file_search_file:
            file_search_config = yaml.safe_load(file_search_file.read())

        if not machine_code in file_search_config["resources"]:
            return None
        host = file_search_config["resources"][machine_code]

        username = host.get("username", file_search_config["common"]["username"])
        password = host.get("password", file_search_config["common"]["password"])
        server = str(host["address"])
        share_name = host.get("share_name", file_search_config["common"]["share_name"])
        search_path = host.get("search_path", file_search_config["common"]["search_path"])

        formatted = None
        try:
            c = SMBCtl(
                host["username"] if "username" in host else file_search_config["common"]["username"], 
                host["password"] if "password" in host else file_search_config["common"]["password"], 
                host["netbios"], 
                host["address"], 
                139)
            files = c.file_list(
                host["share_name"] if "share_name" in host else file_search_config["common"]["share_name"], 
                host["search_path"] if "search_path" in host else file_search_config["common"]["search_path"]
                )
            matched = list(filter(lambda x: x.startswith(prefix) and x.endswith("rst.csv"), files))
            formatted = [re.sub(r'(\d+)rst', lambda m: f"{int(m.group(1)):02d}rst", name) for name in matched]
        except Exception as e:
        #except (smb.base.NotConnectedError, ConnectionResetError) as sbnce:
            c = SMBProtocolCtl(
                host["username"] if "username" in host else file_search_config["common"]["username"], 
                host["password"] if "password" in host else file_search_config["common"]["password"], 
                host["netbios"], 
                host["address"], 
                445)
            files = c.file_list(
                host["share_name"] if "share_name" in host else file_search_config["common"]["share_name"], 
                host["search_path"] if "search_path" in host else file_search_config["common"]["search_path"]
                )
            matched = list(filter(lambda x: x.startswith(prefix) and x.endswith("rst.csv"), files))
            formatted = [re.sub(r'(\d+)rst', lambda m: f"{int(m.group(1)):02d}rst", name) for name in matched]
        #    raise sbnce
        #except Exception as e:
        #    raise e
        return formatted

    @strawberry.field
    def search_lot(self, lot:str) -> SearchLotType:
        r = requests.get(f"{settings.EXTERNAL_API_ENDPOINT}{settings.EXTERNAL_API_URL_EPR}", params={"lot": lot, "is_ring_lot": 1})
        data = r.json()["data"]
        result = list(filter(lambda x: x["proccd"] == "CBF320500", data))
        #result = list(filter(lambda x: x["proccd"] == "CBF320100", data))
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

        stages = None
        if not result is None:
            r = requests.get(f"{settings.EXTERNAL_API_ENDPOINT}{settings.EXTERNAL_API_URL_TRACE}", params={"coatlot":  result.coatlot})
            #r = requests.get(f"{'http://127.0.0.1:8000'}{settings.EXTERNAL_API_URL_TRACE}", params={"coatlot":  result.coatlot})
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

    
    @strawberry.field
    def search_inspection_sample_request(self, lot:str) -> Optional[InspectionSampleType]:
        client = MongoClient(settings.MONGODB)
        db = client[settings.MONGODB_DATABASE]
        item = db["inspection_sample_request"].find_one({"lot": lot})

        if item is None:
            return None

        response = InspectionSampleType(
            lot=item["lot"],
            stages=item["stages"],
            cross_section_samples=list(map(lambda x: CrossSectionSample(lot=x["lot"]), item["crossSectionSamples"])),
            peel_samples=list(map(lambda x: PeelSample(stage=x["stage"], lots=list(map(lambda y: 
            PeelSampleLot(
                dm_lot = y["dm_lot"],
                dm_code = y["dm_code"],
                dm_stage = y["dm_stage"],
                dm_suffix = y["dm_suffix"],
                ring = y["ring"],
                sequence = y["sequence"],
                is_use = y["is_use"],
                is_validate = y["is_validate"],
                is_pass = y["is_pass"],
            ),x["lots"]))), item["peelSamples"])),
            is_request=item["is_request"] if "is_request" in item else None,
            is_complete=item["is_complete"] if "is_complete" in item else None,
        )
        return response

    @strawberry.field
    def search_inspection_sample_result(self, lot:str) -> Optional[InspectionSampleType]:
        client = MongoClient(settings.MONGODB)
        db = client[settings.MONGODB_DATABASE]
        item = db["inspection_sample_result"].find_one({"lot": lot})

        if item is None:
            return None

        response = InspectionSampleType(
            lot=item["lot"],
            stages=item["stages"],
            cross_section_samples=list(map(lambda x: CrossSectionSample(lot=x["lot"]), item["crossSectionSamples"])),
            peel_samples=list(map(lambda x: PeelSample(stage=x["stage"], lots=list(map(lambda y: 
            PeelSampleLot(
                dm_lot = y["dm_lot"],
                dm_code = y["dm_code"],
                dm_stage = y["dm_stage"],
                dm_suffix = y["dm_suffix"],
                ring = y["ring"],
                sequence = y["sequence"],
                is_use = y["is_use"],
                is_validate = y["is_validate"],
                is_pass = y["is_pass"],
            ),x["lots"]))), item["peelSamples"])),
            is_request=item["is_request"] if "is_request" in item else None,
            is_complete=item["is_complete"] if "is_complete" in item else None,
        )
        return response
