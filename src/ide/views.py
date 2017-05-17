from django.shortcuts import render
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseServerError, JsonResponse
from django.views.decorators.http import require_POST, require_GET
from django.db.models.base import ModelBase
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.db.models import fields
from django.apps import apps
import os
import pprint
import logging
import inspect
import imp
import importlib
logger = logging.getLogger(__name__)
# logger.setLevel(logging.DEBUG)

print('------------------List apps in %s:------------------------' %(''))
for app in apps.get_app_configs():
    logger.debug(app.verbose_name)
print('-----------end----List apps in %s:------------------------' %(''))

logger.debug("__package__:" + __package__)
# my_module = importlib.import_module('.uploadModels', __package__)
my_module = importlib.import_module('.models', 'cloudtest')
# for name, data in inspect.getmembers(my_module):
#     if name == '__builtins__':
#         continue
#     if inspect.isclass(name):
#         logger.debug("class@ %s" % name)
#     print('@@@@%s %s :' % (type(name), name), repr(data))
print('------------------List elements in %s:------------------------' %(my_module))
ret = {}
for element_name in dir(my_module):
    element = getattr(my_module, element_name)
    # if inspect.isclass(element) and isinstance(element, ModelBase):
    if inspect.isclass(element) and type(element) == ModelBase:
        vn, mkey, rmkey, name = '', '', '', ''
        mkey = element.__module__+ '.' + element.__name__
        logger.debug("%s: %s: %s" % (element_name, type(element), element.__module__+ '.' + element.__name__))
        ret[mkey] = {'relations': {}, 'fields': {}, 'name': element.__name__, 'mkey': mkey, 'verbose_name': element_name}
        for field in element._meta.get_fields():
            if field.auto_created:
                continue
            logger.debug('  %s: %s: %s' % (field, type(field), field.__class__.__name__))
            logger.debug('      auto_created: %s' % field.auto_created)
            logger.debug('      related_model: %s, is_relation: %s' % (str(field.related_model), field.is_relation))
            logger.debug('      many_to_many: %s, many_to_one: %s, one_to_one: %s' % (field.many_to_many, field.many_to_one, field.one_to_one))
            if type(field) == fields.related.ForeignKey:
                logger.debug('      !!! ForeignKey found: %s' %(field))
            logger.debug('  %s: %s' % (field.verbose_name, type(field.verbose_name)))
            if type(field.verbose_name) == str:
                vn = field.verbose_name
                name = str(field)
            else:
                vn = str(field.verbose_name)
                name = str(field)
            ret[mkey]['fields'][name] = {
                'name': name,
                'verbose_name': vn,
                'type': field.get_internal_type()
            }
            # for kk in field:
            # logger.debug(str(field.related_model))
            # logger.debug(str(field.related_model)[len("<class '"):-2])
            # logger.debug(field.related_model)
            if field.related_model:
                aa =  ['many_to_many', 'many_to_one', 'one_to_one'][list(filter(lambda ix: ix[1], enumerate([field.many_to_many, field.many_to_one, field.one_to_one])))[0][0]]
                # ret[element_name]['relations'] = {}
                # logger.debug(str(field.related_model))
                # logger.debug((field.related_model.__name__))
                # logger.debug(type(field.related_model))
                if type(field.related_model) ==  str:
                    # logger.debug(str(field.related_model))
                    # logger.debug(str(field.related_model)[len("<class '"):-2])
                    logger.debug((element.__module__+ '.' + field.related_model))
                    rmkey = element.__module__+ '.' + field.related_model
                    # logger.debug((field.__dict__))
                    # logger.debug((field.related_model)[len("<class '"):-2])
                    ret[mkey]['relations'][rmkey] = {
                        'related_model': rmkey,
                        # 'related_model_vname': field.related_model,
                        # 'related_model': field.related_model.__name__ if field.related_model.__name__ else field.related_model,
                        'relation': aa
                    }
                else:
                    logger.debug(str(field.related_model))
                    logger.debug(str(field.related_model)[len("<class '"):-2])
                    ret[mkey]['relations'][str(field.related_model)[len("<class '"):-2]] = {
                        'related_model': str(field.related_model)[len("<class '"):-2],
                        'relation': aa
                    }
                # logger.debug('  %s, %s' % (field.related_model.__name__, aa))
    elif inspect.ismodule(element):
        # logger.debug("%s: %s" % (element_name, type(element)))
        # logger.debug("module %s" % element_name)
        pass
    elif hasattr(element, '__call__'):
        if inspect.isbuiltin(element):
            sys.stdout.write("builtin_function %s" % element_name)
            data = describe_builtin(element)
            data = data.replace("[", " [")
            data = data.replace("  [", " [")
            data = data.replace(" [, ", " [")
            sys.stdout.write(data.replace(", ", " "))
            print("")
        else:                    
            try:
                data = inspect.getargspec(element)
                sys.stdout.write("function %s" % element_name)
                for a in data.args:
                    sys.stdout.write(" ")
                    sys.stdout.write(a)
                if data.varargs:
                    sys.stdout.write(" *")
                    sys.stdout.write(data.varargs)
                print("")
            except:
                pass
    else:
        # logger.debug("%s: %s" % (element_name, type(element)))
        pass
logger.debug('  %s: %s' % (ret, type(ret)))
print('--------------end List elements in %s:------------------------' %(my_module))

# Create your views here.
@require_GET
def models(rq):
    app = rq.GET.get('app')
    return JsonResponse(ret)

@require_GET
def apps(rq):
    return JsonResponse(ret)

@require_POST
def upload(rq):
    f = rq.FILES.get('modelFile')
    # logger.debug(f)
    if f is None:
        return HttpResponseBadRequest('no file in POST data.')
    # logger.debug('Config file'.format(f.name))
    dest = __package__ + '/uploadModels.py'
    logger.debug(dest)
    if os.path.exists(dest):
        # os.remove(dest)
        logger.debug('file exist!')
    path = default_storage.save(dest, ContentFile(f.read()))

    ret = {}
    logger.debug(path)
    filename = path
    my_module = importlib.import_module('.uploadModels', __package__)
    # for name, data in inspect.getmembers(my_module):
    #     if name == '__builtins__':
    #         continue
    #     if inspect.isclass(name):
    #         logger.debug("class@ %s" % name)
    #     print('@@@@%s %s :' % (type(name), name), repr(data))
    print('------------------List elements in %s:------------------------' %(my_module))
    for element_name in dir(my_module):
        element = getattr(my_module, element_name)
        logger.debug("%s: %s" % (element_name, type(element)))
        if inspect.isclass(element):
            ret[element_name] = {}
            for field in element._meta.get_fields():
                logger.debug('  %s: %s' % (field, type(field)))
                logger.debug('      auto_created: %s' % field.auto_created)
                logger.debug('      related_model: %s, is_relation: %s' % (field.related_model, field.is_relation))
                logger.debug('      many_to_many: %s, many_to_one: %s' % (field.many_to_many, field.many_to_one))
                if type(field) == fields.related.ForeignKey:
                    logger.debug('      !!! ForeignKey found: %s' %(field))

        elif inspect.ismodule(element):
            # logger.debug("%s: %s" % (element_name, type(element)))
            # logger.debug("module %s" % element_name)
            pass
        elif hasattr(element, '__call__'):
            if inspect.isbuiltin(element):
                sys.stdout.write("builtin_function %s" % element_name)
                data = describe_builtin(element)
                data = data.replace("[", " [")
                data = data.replace("  [", " [")
                data = data.replace(" [, ", " [")
                sys.stdout.write(data.replace(", ", " "))
                print("")
            else:                    
                try:
                    data = inspect.getargspec(element)
                    sys.stdout.write("function %s" % element_name)
                    for a in data.args:
                        sys.stdout.write(" ")
                        sys.stdout.write(a)
                    if data.varargs:
                        sys.stdout.write(" *")
                        sys.stdout.write(data.varargs)
                    print("")
                except:
                    pass
        else:
            # logger.debug("%s: %s" % (element_name, type(element)))
            pass
    print('--------------end List elements in %s:------------------------' %(my_module))

    # return JsonResponse({'status': status, 'code': code})

    # config = {}
    # chunks = []
    # while True:
    #     buff = f.read(4096)
    #     if not buff:
    #         break
    #     chunks.append(buff.decode('utf-8'))
    #     logger.debug(buff.decode('utf-8'))
    # config['config'] = chunks
    # code = 200
    # return JsonResponse({'status': status, 'code': code})
