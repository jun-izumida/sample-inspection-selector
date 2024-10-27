import datetime
from django.conf import settings
from django.db import transaction
from typing import List, Union
from pymongo import MongoClient
import strawberry
import strawberry_django
from strawberry import auto
from .types import *



@strawberry.type
class Mutation:
    @strawberry.mutation
    def update_inspection_sample_lots(self, input: InspectionSampleInput) -> str:
        client = MongoClient(settings.MONGODB)
        db = client[settings.MONGODB_DATABASE]
        print(input.__dict__)

        mongo_data = {
            'lot': input.lot,
            'crossSectionSamples': [sample.to_dict() for sample in input.cross_section_samples],
            'peelSamples': [sample.to_dict() for sample in input.peel_samples],
            'stages': input.stages
        }

        result = db[settings.MONGODB_COLLECTION].replace_one({'lot': input.lot}, mongo_data, upsert=True)
        print(result)
        return str(result.upserted_id)