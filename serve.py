import gevent
import psutil

from socketio import socketio_manage
from socketio.server import SocketIOServer
from socketio.namespace import BaseNamespace
from socketio.mixins import BroadcastMixin


class CPUNamespace(BaseNamespace, BroadcastMixin):
    def recv_connect(self):
        def sendcpu():
            while True:
                val = psutil.cpu_percent()
                self.emit('cpu_data', {'point': val})
                gevent.sleep(5.0)
        self.spawn(sendcpu)


class MemoryNamespace(BaseNamespace, BroadcastMixin):
    def recv_connect(self):
        def sendmem():
            while True:
                val = psutil.phymem_usage().percent
                self.emit('mem_data', {'point': val})
                gevent.sleep(5.0)
        self.spawn(sendmem)


class Application(object):
    def __init__(self):
        self.buffer = []

    def __call__(self, environ, start_response):
        path = environ['PATH_INFO'].strip('/') or 'index.html'

        if path.startswith('static/') or path == 'index.html':
            try:
                data = open(path).read()
            except Exception:
                return not_found(start_response)

            if path.endswith(".js"):
                content_type = "text/javascript"
            elif path.endswith(".css"):
                content_type = "text/css"
            elif path.endswith(".swf"):
                content_type = "application/x-shockwave-flash"
            elif path.endswith(".png"):
                content_type = "image/png"
            else:
                content_type = "text/html"

            start_response('200 OK', [('Content-Type', content_type)])
            return [data]

        if path.startswith("socket.io"):
            socketio_manage(environ, {'/cpu': CPUNamespace, 
                                      '/mem': MemoryNamespace, 
                                     })

        else:
            return not_found(start_response)


def not_found(start_response):
    start_response('404 Not Found', [])
    return ['<h1>Not Found</h1>']


if __name__ == '__main__':
    print 'Listening on port http://0.0.0.0:8080'
    # SocketIOServer(('0.0.0.0', 8080), Application(),
    #     resource="socket.io", policy_server=True,
    #     policy_listener=('0.0.0.0', 10843)).serve_forever()

    SocketIOServer(('0.0.0.0', 8080), Application(),
        resource="socket.io", policy_server=True ).serve_forever()

