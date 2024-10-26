import strawberry
#from strawberry_django.optimizer import DjangoOptimizerExtension
from main.schema import Query as MainQuery, Mutation as MainMutation

@strawberry.type
class Query(MainQuery):
    pass

@strawberry.type
class Mutation(MainMutation):
    pass

schema = strawberry.Schema(
    query=Query,
    mutation=Mutation
    #extensions=[
    #    DjangoOptimizerExtension,  # not required, but highly recommended
    #],
    )
