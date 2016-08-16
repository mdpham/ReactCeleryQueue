from celery import Celery, states
from time import sleep
from random import randint

task_queue = Celery("demo", backend="amqp", broker="amqp://guest@localhost//")
task_queue.conf.CELERY_SEND_EVENTS = True
@task_queue.task(bind=True)
def demo_task(self, **kwargs):
    #Access data passed to task via *args, **kwargs
    duration = randint(5,10)
    print("Task {} will run for {} seconds".format(self.request.id, duration))
    sleep(duration)
