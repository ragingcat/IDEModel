from django.apps import AppConfig

from django.apps import apps
import logging
logger = logging.getLogger(__name__)

class IDEConfig(AppConfig):
    name = 'ide'
    applist = []
    # def __init__(self, *args, **kwargs):
    #     self.applist = []
    def ready(self):
        print('------------------List apps in %s:------------------------' %(''))
        for app in apps.get_app_configs():
            logger.debug(app.verbose_name)
            # logger.debug(app.__dict__.keys())
            # for k in app.__dict__.keys():
            #     logger.debug('      %s: %s' % (k, app.__dict__[k]))
                # logger.debug(app.__dict__[k])
            if not app.name.startswith('django'):
                self.applist.append({'vname': app.verbose_name, 'mkey': app.name})
        print('-----------end----List apps in %s:------------------------' %(''))
        # logger.debug(self.applist)
