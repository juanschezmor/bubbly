from flask import Flask, request
from flask_socketio import SocketIO, emit
import time
from models.user import User
from models.user_manager import UserManager

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

user_manager = UserManager()


@socketio.on("connect")
def handle_connect():
    user_id = request.sid
    user = User(user_id)
    user_manager.add_user(user)
    print("New online user:", user_id)
    print("Online users:", user_manager.get_all_user_sids())
    socketio.emit("get-online-users", user_manager.get_all_user_sids())
    emit("user-id", user_id, room=user_id)


@socketio.on("disconnect")
def handle_disconnect():
    user_id = request.sid
    user = user_manager.get_user_by_sid(user_id)
    if user:
        partner_sid = user_manager.get_partner(user)
        if partner_sid:
            print("Notifying partner about disconnection:", partner_sid)
            emit("partner-disconnected", room=partner_sid)
        user_manager.remove_user(user)
        print("User disconnected:", user_id)
        print("Online users:", user_manager.get_all_user_sids())
        socketio.emit("get-online-users", user_manager.get_all_user_sids())


@socketio.on("online-users")
def send_online_users():
    socketio.emit("get-online-users", user_manager.get_all_user_sids())


@socketio.on("update-tags")
def handle_update_tags(tags):
    user_id = request.sid
    user = user_manager.get_user_by_sid(user_id)
    if user:
        user.update_tags(tags)
    print("USERS_TAGS:", {u.sid: u.tags for u in user_manager.online_users})


@socketio.on("user-searching")
def handle_user_searching():
    global searching_flag
    searching_flag = True
    user_id = request.sid
    user = user_manager.get_user_by_sid(user_id)
    if user:
        user_manager.add_unpaired_user(user)

    start_time = time.time()
    remove_tags_emitted = False

    while time.time() - start_time <= 10:
        if not searching_flag:
            print("Búsqueda detenida manualmente")
            return None

        if len(user_manager.online_users) > 1:
            match = user_manager.search_match(user)
            if match:
                print("Sending emit match-found...")
                emit("match-found", user.sid, room=match.sid)
                emit("match-found", match.sid, room=user.sid)
                user_manager.remove_unpaired_user(user)
                user_manager.remove_unpaired_user(match)
                user_manager.add_active_pair(user.sid, match.sid)
                print("Active pairs:", user_manager.get_pairs())
                return match

            if not remove_tags_emitted and time.time() - start_time >= 5:
                print("No match found within 5 seconds, removing tags")
                user.clear_tags()
                socketio.emit("removed-tags")
                remove_tags_emitted = True
        else:
            print("No match found...esperando a otro usuario")

        if time.time() - start_time > 10:
            break

    print("Sending emit match-not-found...")
    emit("match-not-found", user.sid)


@socketio.on("stop-searching")
def handle_stop_searching():
    global searching_flag
    searching_flag = False


@socketio.on("unpair")
def handle_unpair():
    user_id = request.sid
    user = user_manager.get_user_by_sid(user_id)
    if user:
        print("Pairs:", user_manager.get_pairs())
        partner = user_manager.get_partner(user.sid)
        print("Removing pair:", user.sid, partner)
        user_manager.add_unpaired_user(user)
        print("User unpaired:", user.sid)
        print("Unpaired users:", [u.sid for u in user_manager.unpaired_users])
        emit("unpaired", user.sid)
        print("Sending emit partner-disconnected to...", partner)
        emit("partner-disconnected", room=partner)


@socketio.on("send-message")
def handle_send_message(data):
    print("Mensaje enviado:", data)
    emit("receive-message", data, room=data["to"])


if __name__ == "__main__":
    socketio.run(app)
