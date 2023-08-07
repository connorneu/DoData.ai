from import_export import resources
from .models import KeyValueDataFrame
 
class KeyValueDataFrame(resources.ModelResource):
    class Meta:
        model = KeyValueDataFrame