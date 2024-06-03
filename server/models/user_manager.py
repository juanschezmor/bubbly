class UserManager:
    def __init__(self):
        self.online_users = []
        self.unpaired_users = []
        self.active_pairs = {}

    def add_user(self, user):
        self.online_users.append(user)

    def remove_user(self, user):
        if user in self.online_users:
            self.online_users.remove(user)
        if user in self.unpaired_users:
            self.unpaired_users.remove(user)

    def add_unpaired_user(self, user):
        self.unpaired_users.append(user)

    def remove_unpaired_user(self, user):
        if user in self.unpaired_users:
            self.unpaired_users.remove(user)

    def get_user_by_sid(self, sid):
        return next((u for u in self.online_users if u.sid == sid), None)

    def get_all_user_sids(self):
        return [user.sid for user in self.online_users]

    def search_match(self, user):
        for u in self.unpaired_users:
            if u.sid != user.sid:
                if user.tags and u.tags and set(user.tags) & set(u.tags):
                    return u
                if not user.tags and not u.tags:
                    return u
        return None

    def get_pairs(self):
        return self.active_pairs

    def add_active_pair(self, user1_sid, user2_sid):
        self.active_pairs[user1_sid] = user2_sid
        self.active_pairs[user2_sid] = user1_sid

    def get_partner(self, user_sid):
        partner = self.active_pairs.get(user_sid)
        return partner if partner else None
