from flask import Flask,request, render_template
from flask_socketio import SocketIO
from flask_socketio import emit
import random
import time 

app = Flask(__name__)

socketio = SocketIO(app,cors_allowed_origins="*")

online_users = []
num_online_users = len(online_users)
online_users_tags = dict()

unpaired_users = []


@socketio.on('connect')
def handle_connect():
    global online_users
    user_id = request.sid
    online_users.append(user_id)
    print('New online user:', user_id)
    print('Online users:', online_users)
    # Emitir la lista de usuarios en línea a todos los clientes
    socketio.emit('get-online-users', online_users)
    emit('user-id', user_id, room=user_id)

@socketio.on('disconnect')
def handle_disconnect():
    global online_users
    user_id = request.sid
    if user_id in online_users:
        online_users.remove(user_id)
        if user_id in unpaired_users:
            unpaired_users.remove(user_id)
        print('User disconnected:', user_id)
        print('Online users:', online_users)
        # Emitir la lista de usuarios en línea a todos los clientes
        socketio.emit('get-online-users', online_users)

@socketio.on('online-users')
def send_online_users():
    socketio.emit('get-online-users', online_users)

@socketio.on("update-tags")
def handle_update_tags(tags):
    # Obtener el SID del cliente que envió los tags
    sid = request.sid
    # Actualizar el diccionario con los tags asociados al SID
    online_users_tags[sid] = tags
    print("USERS_TAGS:",online_users_tags)



def search_match(user, users_list):
    
    user_tags = online_users_tags[user]
    print( "USER_TAGS:",user_tags)
    for u in users_list:
        if u != user:
            other_user_tags = online_users_tags[u]
            print("OTHER_USER_TAGS:",other_user_tags)
            if user_tags and other_user_tags and set(user_tags) & set(other_user_tags):
                print("MATCH FOUND:",user,u)
                return u
            if not user_tags and not other_user_tags:
                print("MATCH FOUND:",user,u)
                return u 
    return None

@socketio.on("user-searching")
def handle_user_searching():
    sid = request.sid
    unpaired_users.append(sid)
    print("Unpaired users antes del match:", unpaired_users)
    start_time = time.time()  # Tiempo de inicio
    while time.time() - start_time <= 5:
        if len(unpaired_users) > 1:
            match = search_match(sid, unpaired_users)
            print("Unpaired users despues del match:", unpaired_users)
            if match:
                print("Sending emit match-found...")
                # Emitir el evento "match-found" al usuario con el SID correspondiente
                emit("match-found", sid, room=match)
                emit("match-found", match, room=sid)
                try:
                    unpaired_users.remove(sid)
                    unpaired_users.remove(match)
                except ValueError:
                    pass  # El elemento ya ha sido eliminado de la lista
                return  # Salir del bucle
            else:
                # Eliminar las etiquetas del usuario y realizar una nueva búsqueda
                online_users_tags[sid] = []
                start_time = time.time()  # Reiniciar el tiempo de inicio
    # Si no se encuentra coincidencia dentro del tiempo especificado
    print("Sending emit match-not-found...")
    emit("match-not-found", sid)

@socketio.on("unpair")
def handle_unpair():
    sid = request.sid
    if sid in online_users:
        try:
            unpaired_users.remove(sid)
                    
        except ValueError:
            pass  # El elemento ya ha sido eliminado de la lista
        print("User unpaired:", sid)
        print("Unpaired users:", unpaired_users)
        emit("unpaired", sid)
                    
            
    
                


if __name__ == '__main__':
    socketio.run(app)
