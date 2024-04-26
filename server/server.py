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
searching_flag = False
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
    
    for u in users_list:
        if u != user:
            other_user_tags = online_users_tags[u]
            print("OTHER_USER_TAGS:",other_user_tags)
            if user_tags and other_user_tags and set(user_tags) & set(other_user_tags):
                print("MATCH FOUND:",user,u)
                return u
            if not user_tags and not other_user_tags:
                print("MATCH FOUND (no tags):",user,u)
                return u 
    return None

@socketio.on("user-searching")
def handle_user_searching():
    global searching_flag
    searching_flag = True
    sid = request.sid
    unpaired_users.append(sid)
    
    start_time = time.time()  # Tiempo de inicio
    remove_tags_emitted = False  # Bandera para controlar si se emitió el evento de eliminación de etiquetas
    
    while time.time() - start_time <= 10:
        if not searching_flag:
            print("Búsqueda detenida manualmente")
            return None
        
        if len(online_users) > 1:
            match = search_match(sid, unpaired_users)
            if match:
                print("Sending emit match-found...")
                emit("match-found", sid, room=match)
                emit("match-found", match, room=sid)
                try:
                    unpaired_users.remove(sid)
                    unpaired_users.remove(match)
                except ValueError:
                    pass  # El elemento ya ha sido eliminado de la lista
                
                return match # Salir del bucle
            
            # Si han pasado 5 segundos y el evento de eliminación de etiquetas no se ha emitido, emitirlo
            if not remove_tags_emitted and time.time() - start_time >= 5:
                print("No match found within 5 seconds, removing tags")
                online_users_tags[sid] = []
                socketio.emit("removed-tags")
                remove_tags_emitted = True
                
        else:
            print("No match found...esperando a otro usuario")
            
        if time.time() - start_time > 10:
            break
            
    # Si no se encuentra coincidencia dentro del tiempo especificado
    print("Sending emit match-not-found...")
    emit("match-not-found", sid)



@socketio.on("stop-searching")
def handle_stop_searching():
    global searching_flag
    searching_flag = False # Detener la búsqueda manualmente


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
                    
@socketio.on("send-message")
def handle_send_message(data):
    print("Mensaje enviado:", data)
    emit("receive-message", data, room=data["to"])   

    
                


if __name__ == '__main__':
    socketio.run(app)
