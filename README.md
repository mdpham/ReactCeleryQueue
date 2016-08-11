# React/Celery Queue
A simple React/Redux/Immutable application for submitting and monitoring [Celery](http://www.celeryproject.org/). Updates are passed back via a [Klein](https://github.com/twisted/klein) server.
This was developed as a demonstration at [OICR](http://oicr.on.ca/) for the Software Engineering Club to showcase the task queueing system implemented by [PGMLab](https://github.com/OICR/PGMLab), a machine learning tool for performing loopy belief propagation over probablistic graphical models (intended for use with [Reactome pathways](http://www.reactome.org/) for drug discovery).

### To run

* You'll need to both npm install and pip install. The requirements.txt file is taken from PGMLab and so has extraneous
packages.


Install dependencies:
```
> $ npm install
> $ pip install -r requirements.txt
```

Run Klein server
```
> $ python server.py
```

Run Celery task management
```
> $ rabbitmq-server
```
```
> $ celery -A tasks.task_queue worker
```

Run React demo
```
> $ npm run dev
```

Open the web browser to `http://localhost:8888/`
