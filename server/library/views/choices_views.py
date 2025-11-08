# views/choices_view.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..utils.choices_loader import get_all_choices


class DynamicChoicesAPIView(APIView):
    def get(self, request):
        models_param = request.GET.get("model")

        all_choices = get_all_choices()

        # filter by query ?model=user,book
        if models_param:
            models_list = [m.strip().lower() for m in models_param.split(",")]
            filtered = {
                m: choices for m, choices in all_choices.items() if m in models_list
            }
            return Response(filtered, status=status.HTTP_200_OK)

        # return all if no filter
        return Response(all_choices, status=status.HTTP_200_OK)
