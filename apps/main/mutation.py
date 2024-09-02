import datetime
from django.db import transaction
from typing import List, Union
import strawberry
import strawberry_django
from strawberry import auto


@strawberry.type
class Mutation:
    pass