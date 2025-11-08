import pkgutil
import inspect
from django.apps import apps


def get_all_choices():
    choices_dict = {}

    # get all models of this django app
    for model in apps.get_app_config('library').get_models():  # replace 'library' with your app name
        model_name = model.__name__.lower()
        choices_dict[model_name] = {}

        # inspect class attributes for choices (fields with .choices)
        for field in model._meta.fields:
            if field.choices:
                choices_dict[model_name][field.name] = [
                    {"value": v, "label": l}
                    for v, l in field.choices
                ]
        
        # inspect module-level constants ending with _CHOICES
        module = inspect.getmodule(model)
        for name, value in vars(module).items():
            if name.endswith("_CHOICES") and isinstance(value, (list, tuple)):
                # example: GENDER_CHOICES => gender
                key = name.replace("_CHOICES", "").lower()
                choices_dict[model_name][key] = [
                    {"value": v, "label": l}
                    for v, l in value
                ]

    return choices_dict
