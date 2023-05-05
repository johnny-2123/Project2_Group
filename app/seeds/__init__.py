from flask.cli import AppGroup
from .users import seed_users, undo_users
from .workspace import seed_workspaces, undo_workspaces
from .workspace_member import seed_workspace_members, undo_workspace_members
from .channels import seed_channels, undo_channels
from .message import seed_messages, undo_messages
from .direct_message import seed_direct_messages, undo_direct_messages
from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo
        # command, which will  truncate all tables prefixed with
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_users()
        undo_workspaces()
        undo_workspace_members()
        undo_channels()
        undo_direct_messages()
        undo_messages()
    seed_users()
    seed_workspaces()
    seed_workspace_members()
    seed_channels()
    seed_direct_messages()
    seed_messages()


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    undo_workspaces()
    undo_workspace_members()
    undo_direct_messages()
    undo_messages()
