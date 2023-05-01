from .db import db, environment, SCHEMA

class MessageReaction(db.Model):
    __table__name = "message_reactions"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    message_id = db.Column(db.Integer, db.ForeignKey('messages.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    reaction_id = db.Column(db.Integer, db.ForeignKey('reactions.id'), nullable=False)

    message = db.relationship('Message', back_populates='message_reactions')
    user = db.relationship('User', back_populates='message_reactions')
    reaction = db.relationship('Reaction', back_populates='message_reactions')
