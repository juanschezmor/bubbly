class User:
    def __init__(self, sid):
        self.sid = sid
        self.tags = []

    def update_tags(self, tags):
        self.tags = tags

    def clear_tags(self):
        self.tags = []
