from functools import wraps
from flask import Blueprint, g, jsonify, request
from flask_login import login_required, current_user
from app.api.auth_routes import validation_errors_to_error_messages
from app.forms.channel_form import ChannelForm
from app.models import Workspace, User, Channel, Message, db
from sqlalchemy import or_
from sqlalchemy.exc import IntegrityError
from .message_routes import chat_messages

channel_routes = Blueprint("channels", __name__)
workspace_channels = Blueprint("workspace_channels", __name__)

# Routes 'api/channels/:channelId/messages' to message_routes.py
channel_routes.register_blueprint(chat_messages, url_prefix="/messages")

#
# HELPER FUNCTIONS
#


# Checks if a workspace exists, and that the current user
# is a member of that workspace before proceeding
@workspace_channels.before_request
@login_required
def check_workspace():
    workspace_id = request.view_args.get("workspace_id")
    workspace = Workspace.query.get(workspace_id)
    if not workspace:
        return {"error": "Workspace not found"}, 404
    if not current_user in workspace.members:
        return {"error": "User is not a member of this workspace"}, 403
    request.workspace = workspace


# Checks if a channel exists, and if the current user
# has permissions to view it before proceeding
@channel_routes.before_request
@login_required
def check_channel():
    print("channel_routes.before_request")
    channel_id = request.view_args.get("channel_id")
    channel = Channel.query.get(channel_id)
    if not channel:
        return {"error": "channel not found"}, 404
    if not current_user in channel.workspace.members:
        return {"error": "User is not a member of this workspace"}, 403
    if channel.private and (not current_user in channel.members):
        return {"error": "User does not have access to this channel"}, 403
    request.channel = channel
    request.workspace = channel.workspace


# Checks if the current user has permissions to perform an action
def needs_permission(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        workspace = request.workspace
        if current_user.id is not workspace.owner.id:
            return {"error": "user does not have permission perform that action"}, 403
        return f(*args, **kwargs)

    return wrapper


#
# ROUTES
#


# Gets all channels in a workspace that are
# not private, or that the current user is a member of
@workspace_channels.route("/")
def get_channels(workspace_id):
    channels = (
        Channel.query.filter(Channel.workspace_id == workspace_id)
        .filter(
            or_(
                Channel.private == False,
                (Channel.members.contains(current_user)),
            )
        )
        .all()
    )
    return {"Channels": {channel.id: channel.to_dict() for channel in channels}}


# Get a single channel
@channel_routes.route("/")
def get_channel_by_id(channel_id):
    channel = request.channel
    channel_dict = channel.to_dict()
    channel_dict["owner"] = channel.owner.to_dict()
    return channel_dict


# Create a channel
@workspace_channels.route("/", methods=["POST"])
@needs_permission
def create_channel(workspace_id):
    workspace = request.workspace
    form = ChannelForm()
    form["csrf_token"].data = request.cookies["csrf_token"]
    if form.validate_on_submit():
        new_channel = Channel(
            name=form.data["name"],
            description=form.data["description"],
            topic=form.data["topic"],
            private=form.data["private"],
            owner=current_user,
            workspace=workspace,
        )
        if form.data["private"]:
            new_channel.members.append(current_user)
        db.session.add(new_channel)
        try:
            db.session.commit()
            return new_channel.to_dict()
        except IntegrityError as e:
            db.session.rollback()
            error_info = e.orig.args
            return {"error": "IntegrityError", "info": error_info}
    return {"errors": validation_errors_to_error_messages(form.errors)}, 401


# Update a channel
@channel_routes.route("/", methods=["PUT"])
@needs_permission
def update_channel(channel_id):
    channel = request.channel
    form = ChannelForm()
    form["csrf_token"].data = request.cookies["csrf_token"]
    if form.validate_on_submit():
        channel.name = form.data["name"]
        channel.description = form.data["description"]
        channel.topic = form.data["topic"]
        if channel.private != form.data["private"]:
            channel.private = form.data["private"]
            channel.members.clear()
            if form.data["private"]:
                channel.members.append(current_user)
        db.session.add(channel)
        try:
            db.session.commit()
            return channel.to_dict()
        except IntegrityError as e:
            db.session.rollback()
            error_info = e.orig.args
            return {"error": "IntegrityError", "info": error_info}
    return {"errors": validation_errors_to_error_messages(form.errors)}, 401


# Delete a channel
@channel_routes.route("/", methods=["DELETE"])
@needs_permission
def delete_channel(channel_id):
    channel = request.channel
    db.session.delete(channel)
    db.session.commit()
    return {"message": "Channel deleted successfully"}
