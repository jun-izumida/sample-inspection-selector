import strawberry
#from strawberry_django.optimizer import DjangoOptimizerExtension
from main.schema import Query as MainQuery
#from main.schema import Query as MainQuery, Mutation as MainMutation

#class Query(MainQuery):
@strawberry.type
class Query(MainQuery):
    pass
    #@strawberry.field
    #def msg(self) -> str:
    #    return 'test'

#@strawberry.type
#class Mutation(MainMutation):
#    pass

schema = strawberry.Schema(
    query=Query,
    #mutation=Mutation
    #extensions=[
    #    DjangoOptimizerExtension,  # not required, but highly recommended
    #],
    )
