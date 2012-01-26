from django import template
from django.conf import settings

register = template.Library()


@register.inclusion_tag("bootstrap_field.html")
def bootstrap_field(field, class_=None, label=True):
    input_ = field.as_widget(attrs={'class': class_})
    id_for_label = field.id_for_label
    label = field.label_tag() if not field.is_hidden and label else ''
    help_text = field.help_text
    wrapper_class = 'error' if field.errors else ''
    errors = ' '.join(field.errors)
    return {'label': label, 'input': input_, 'help_text': help_text,
            'wrapper_class': wrapper_class, 'errors': errors,
            'hidden': field.is_hidden, 'id_for_label': id_for_label,
            'use_twipsy': settings.BOOTSTRAP_TWIPSY_FORMS}


@register.inclusion_tag("bootstrap_form.html")
def bootstrap_form(form):
    return {'form': form}


@register.inclusion_tag("bootstrap_form_wizard.html")
def bootstrap_form_wizard(form, submit_value):
    return {'form': form, 'submit_value': submit_value}


@register.filter
def form_verb(obj):
    return "Update" if obj else "Add"
