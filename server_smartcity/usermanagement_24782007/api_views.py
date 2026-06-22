from rest_framework import generics
from drf_spectacular.utils import extend_schema
from .serializers import RegisterSerializer
from .models import User

@extend_schema(exclude=True)
class RegisterView(generics.CreateAPIView):

    queryset = User.objects.all()
    serializer_class = RegisterSerializer