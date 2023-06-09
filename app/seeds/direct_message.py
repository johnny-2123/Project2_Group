from app.models import db, DirectMessage, Workspace, User, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime
def seed_direct_messages():
    # get some workspaces and users
    acme_workspace = Workspace.query.filter_by(name='Acme Corporation').first()
    stark_workspace = Workspace.query.filter_by(name="Stark Industries").first()
    wayne_workspace = Workspace.query.filter_by(name="Wayne Enterprises").first()
    demo = User.query.filter_by(username="Demo").first()
    luke = User.query.filter_by(username="luke").first()
    bruce = User.query.filter_by(username="WayneBruce").first()
    # create some direct messages and add members
    dm1 = DirectMessage(
        topic="Project X",
        workspace_id=acme_workspace.id,
        last_sent_message_timestamp=datetime.utcnow()
    )
    dm2 = DirectMessage(
        topic="Budget",
        workspace_id=stark_workspace.id,
        last_sent_message_timestamp=datetime.utcnow()
    )
    dm3 = DirectMessage(
        topic="Marketing Strategy",
        workspace_id=wayne_workspace.id,
        last_sent_message_timestamp=datetime.utcnow()
    )
    dm4 = DirectMessage(
        topic="New Project",
        workspace_id=acme_workspace.id,
        last_sent_message_timestamp=datetime.utcnow()
    )
    dm1.members.extend([demo, luke])
    dm2.members.extend([demo, bruce])
    dm3.members.extend([luke, bruce])
    dm4.members.extend([bruce, luke, demo])
    # add the direct messages to the session and commit
    db.session.add_all([dm1, dm2, dm3, dm4])
    db.session.commit()
#UNDO
def undo_direct_messages():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.direct_messages RESTART IDENTITY CASCADE;"
        )
    else:
        db.session.execute(text("DELETE FROM direct_messages"))
