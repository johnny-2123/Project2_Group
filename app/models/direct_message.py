from .db import db, environment, SCHEMA
from .direct_message_member import direct_message_member

direct_messages = db.Table(
    'direct_messages',
    db.Column('id', db.Integer, primary_key=True),
    db.Column('topic', db.String),
    db.Column('workspace_id', db.Integer, nullable=False),
    db.Column('last_sent_message_timestamp', db.Date)
)

# class DirectMessage(db.Model):
#     __tablename__ = "direct_messages"

#     if environment == "production":
#         __table_args__ = {"schema": SCHEMA}

#     id = db.Column(db.Integer, primary_key=True)
#     topic = db.Column(db.String(255))
#     workspace_id = db.Column(db.Integer, nullable=False)
#     last_sent_message_timestamp = db.Column(db.Date)

#     #relationship, incluide secondary variable
#     members = db.relationship(
#         "User", secondary=direct_message_member, back_populates="dm_memberships"
#     )

#     def to_dict(self):
#         return {
#             "id": self.id,
#             "topic": self.topic,
#             "workspace_id": self.workspace_id,
#             "last_sent_message_timestamp": self.last_sent_message_timestamp,
#         }
