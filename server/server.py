from klein import route, run
from tasks import demo_task, task_queue
import json
import datetime

@route("/submit", methods=["POST"])
def submit(request):
    print request.args
    task = demo_task.apply_async(kwargs=request.args)
    return json.dumps({
        "id": task.id,
        "status": "task-submitted",
        "datetime": str(datetime.datetime.now())
    })

from twisted.internet import defer
spectators = set()
@route("/tasks")
def stream(request):
    request.setHeader("Content-type", "text/event-stream")
    global spectators
    spectators = set([spec for spec in spectators if not spec.transport.disconnected]+[request])
    print("streams: {}".format(len(spectators)))
    return defer.Deferred()

def update_sse(event):
    global spectators
    update = json.dumps({
        "id": event["uuid"],
        "status": event["type"],
        "datetime": str(datetime.datetime.now())
    })
    for spec in spectators:
        if not spec.transport.disconnected:
            spec.write("event: update\ndata: {}\n\n".format(update))

from threading import Thread
from time import sleep
def monitor():
    print('starting monitor')
    def catch_all(event):
        if event["type"] in ["task-received", "task-started", "task-succeeded"]:
            update_sse(event)
    while True:
        try:
            with task_queue.connection() as connection:
                recv = task_queue.events.Receiver(connection, handlers={"*":catch_all})
                recv.capture(limit=None, timeout=None, wakeup=True)
        except (KeyboardInterrupt, SystemExit):
            raise
        except Exception:
            pass
        sleep(1)

def run_monitor():
    thread = Thread(target=monitor, kwargs={})
    thread.daemon = True
    thread.start()
run_monitor()

run("localhost", 8080)
