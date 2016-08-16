from klein import route, run
from tasks import demo_task, task_queue
import json
import datetime

# Route for submitting task start
@route("/submit", methods=["POST"])
def submit(request):
    print request.args
    task = demo_task.apply_async(kwargs=request.args)
    return json.dumps({
        "id": task.id,
        "status": "task-submitted",
        "datetime": str(datetime.datetime.now())
    })

# Route for SSE, hook into this clientside via EventStream
from twisted.internet import defer
spectators = set()
@route("/tasks")
def stream(request):
    request.setHeader("Content-type", "text/event-stream")
    global spectators
    spectators = set([spec for spec in spectators if not spec.transport.disconnected]+[request])
    print("streams: {}".format(len(spectators)))
    # Never actually returned, this is why Klein is useful
    return defer.Deferred()
# Send an SSE
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

# Thread monitoring celery tasks
from threading import Thread
from time import sleep
def monitor():
    print('starting monitor')
    # Event handler
    def catch_all(event):
        if event["type"] in ["task-received", "task-started", "task-succeeded"]:
            update_sse(event)
    # Listen forever and ever
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
