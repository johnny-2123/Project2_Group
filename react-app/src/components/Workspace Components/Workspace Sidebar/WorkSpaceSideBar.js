import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import CreateIndidualDMChatModal from "../../DirectMessage Components/Create Direct Message Modal";
import OpenModalButton from "../../OpenModalButton"
import "./WorkspaceSideBar.css";

function WorkspaceSideBar({ channels, directMessages, url, currentWorkspace }) {
    const [userIsOrganizer, setUserIsOrganizer] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const sessionUser = useSelector((state) => state.session?.user);
    useEffect(() => {
        sessionUser?.id === currentWorkspace?.owner?.id
            ? setUserIsOrganizer(true)
            : setUserIsOrganizer(false);
        if (sessionUser && currentWorkspace?.name) {
            setLoaded(true);
        }
    }, [sessionUser, currentWorkspace, directMessages]);

    let channelsMapped = Object.values(channels)?.map((channel, idx) => {
        return (
            <div key={idx}>
                <NavLink to={`${url}/channels/${channel.id}`}>
                    <i className="fa-solid fa-hashtag"></i> {channel.name}
                </NavLink>
            </div>
        );
    });

    let directMessagesMapped = directMessages?.map((dm, idx) => {
        const names = dm?.members
            ?.reduce((x, user) => {
                if (user?.first_name !== sessionUser?.first_name) {
                    x.push(user.first_name);
                }
                return x;
            }, [])
            .join(", ");
        return (
            <div key={idx}>
                <NavLink to={`${url}/direct_messages/${dm?.id}`}>
                    <i className="fa-solid fa-message"></i> {names}
                </NavLink>
            </div>
        );
    });

    return (
        <>
            {!loaded && <div className="workspaceSideBarMainDiv"></div>}
            {loaded && (
                <div className="workspaceSideBarMainDiv">
                    <h1 className="workspaceSidebarName">
                        {currentWorkspace?.name}
                    </h1>
                    <div className="channelsListDiv">
                        {userIsOrganizer && (
                            <NavLink to={`${url}/edit`}>
                                <i className="fa-solid fa-gear"></i> Edit
                                Workspace
                            </NavLink>
                        )}
                        <NavLink to={`${url}/members`}>
                            {" "}
                            <i className="fa-solid fa-users peopleIconWorkspaceSidebar" />{" "}
                            People
                        </NavLink>
                    </div>
                    <div className="channelsListDiv">{channelsMapped}</div>
                    <div className="channelsListDiv">
                        <OpenModalButton
                            modalComponent={<CreateIndidualDMChatModal />}
                            buttonText="New DM"
                            currentWorkspace={currentWorkspace}
                        />
                        {directMessagesMapped}
                    </div>
                </div>
            )}
        </>
    );
}

export default WorkspaceSideBar;
