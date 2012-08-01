import re

from django import template
from django.conf import settings
from django.core.urlresolvers import reverse

register = template.Library()

success_regex = re.compile(r"success", flags=re.I)
important_regex = re.compile(r"(failure)|(revoked)", flags=re.I)


@register.inclusion_tag("bootstrap_field.html")
def bootstrap_field(field, class_=None, label_tag=True):
    input_ = field.as_widget(attrs={'class': class_})
    id_for_label = field.id_for_label
    label_tag = field.label_tag() if not field.is_hidden and label_tag else ''
    help_text = field.help_text
    wrapper_class = 'error' if field.errors else ''
    errors = ' '.join(field.errors)
    return {'label': label_tag, 'input': input_, 'help_text': help_text,
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


@register.simple_tag
def label(text):
    label_class = ''
    if success_regex.match(text):
        label_class = "success"
    elif important_regex.match(text):
        label_class = "important"
    text = '<span class="label %s">%s</span>' % (label_class, text)
    return text


@register.simple_tag
def label_link(taskstate):
    text = label(taskstate.state if taskstate is not None else 'UNKNOWN')
    if taskstate:
        url = reverse('task_detail', args=(taskstate.task_id,))
        text = '<a href="%s">%s</a>' % (url, text)
    return text
