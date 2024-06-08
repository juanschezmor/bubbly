from flask import Flask, request
from flask_socketio import SocketIO, emit
from gevent import sleep
from models.user import User
from models.user_manager import UserManager
from gevent import spawn
from flask_cors import CORS
import time
import random

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="gevent")

user_manager = UserManager()


@app.route("/test")
def test():
    return "Hello, World!"


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
        if user in user_manager.users_searching:
            user_manager.remove_searching_user(user)
        if user.sid in user_manager.active_pairs:
            partner = user_manager.active_pairs[user.sid]
            user_manager.remove_active_pair(user.sid, partner)
            emit("unpaired", user.sid)
            print("Sending emit partner-disconnected to...", partner)
            emit("partner-disconnected", room=partner)
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


def search(user):
    user_manager.add_searching_user(user)
    print("User started searching:", user.sid)
    print("Users who are searching:", [u.sid for u in user_manager.users_searching])

    start_time = time.time()
    remove_tags_emitted = False

    while time.time() - start_time <= 10:
        elapsed_time = time.time() - start_time
        print("Time elapsed:", elapsed_time)

        if user not in user_manager.users_searching:
            print("Search stopped...")
            return None

        if len(user_manager.online_users) > 1:
            match = user_manager.search_match(user)
            if match:
                print("Sending emit match-found...")
                socketio.emit("match-found", user.sid, room=match.sid)
                socketio.emit("match-found", match.sid, room=user.sid)
                user_manager.remove_searching_user(user)
                user_manager.remove_searching_user(match)
                user_manager.add_active_pair(user.sid, match.sid)
                print("Active pairs:", user_manager.get_pairs())
                return match

            if not remove_tags_emitted and elapsed_time >= 5:
                print("No match found within 5 seconds, removing tags")
                user.clear_tags()
                socketio.emit("removed-tags", room=user.sid)
                remove_tags_emitted = True
        else:
            print("No match found...")

        if elapsed_time > 10:
            break

        sleep(1)

    if user in user_manager.users_searching:
        user_manager.remove_searching_user(user)
    print(f"Sending emit match-not-found to {user.sid}...")
    socketio.emit("match-not-found", room=user.sid)


@socketio.on("user-searching")
def handle_user_searching():
    user_id = request.sid
    user = user_manager.get_user_by_sid(user_id)
    random.shuffle(user_manager.users_searching)
    if user:
        spawn(search, user)


@socketio.on("stop-searching")
def handle_stop_searching():
    user_id = request.sid
    user = user_manager.get_user_by_sid(user_id)
    if user:
        user_manager.remove_searching_user(user)
        print("User stopped searching:", user_id)


@socketio.on("unpair")
def handle_unpair():
    user_id = request.sid
    user = user_manager.get_user_by_sid(user_id)
    if user:
        print("Pairs:", user_manager.get_pairs())
        partner = user_manager.get_partner(user.sid)
        print("Removing pair:", user.sid, partner)
        user_manager.remove_active_pair(user.sid, partner)
        user_manager.remove_searching_user(user)
        user_manager.remove_searching_user(partner)
        print("User removed from searching users:", user.sid)
        print("Users who are searching:", [u.sid for u in user_manager.users_searching])
        emit("unpaired", user.sid)
        print("Sending emit partner-disconnected to...", partner)
        emit("partner-disconnected", room=partner)


@socketio.on("send-message")
def handle_send_message(data):
    print("Message sent:", data)
    emit("receive-message", data, room=data["to"])


if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000)
