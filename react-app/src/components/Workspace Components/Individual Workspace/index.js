import React, { useEffect, useState } from 'react';
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import WorkspaceSideBar from './WorkSpaceSideBar';
import WorkspaceMembers from '../WorkspaceMembers'
import IndividualChannel from '../../Channel Components/Individual Channel';
import ThreadSidebar from '../../Thread Components/ThreadSideBar';
import IndividualDirectMessage from '../../DirectMessage Components/Individual Direct Message'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { fetchIndividualWorkspace } from '../../../store/workspaces';
import { fetchDirectMessages } from '../../../store/directMessages';
import { fetchChannels } from '../../../store/channels';
import './IndividualWorkspace.css'
import './WorkspaceSideBar.css'

function IndividualWorkspace() {
    const { workspaceId } = useParams()
    console.log(`workspaceId:`, workspaceId)

    const { url, path } = useRouteMatch()
    console.log(`IndividualWorkspace url`, url)
    console.log(`IndividualWorkspace path`, path)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchIndividualWorkspace(workspaceId))
        dispatch(fetchChannels)
    }, [dispatch])

    const currentWorkspace = useSelector(state => {
        return state.workspaces.currentWorkspace
    })
    console.log(`currentWorkspace*:`, currentWorkspace)

    const channels = currentWorkspace.channels
    console.log(`channels**********:`, channels)

    // const [workspaceWidth, setWorkspaceWidth] = useState(20);
    // const [threadWidth, setThreadWidth] = useState(20);
    const [showWorkspaceSideBar, setShowWorkspaceSidebar] = useState(true);
    // const [showThread, setShowThread] = useState(false);

    // const handleWorkspaceResize = (newWidth) => {
    //     if (newWidth < 10) {
    //         setShowWorkspace(false);
    //     } else {
    //         setShowWorkspace(true);
    //         setWorkspaceWidth(newWidth);
    //     }
    // };

    // const handleThreadResize = (newWidth) => {
    //     if (newWidth < 10) {
    //         setShowThread(false);
    //     } else {
    //         setShowThread(true);
    //         setThreadWidth(newWidth);
    //     }
    // };

    return (

        <div className='IndividualWorkspaceMainDiv'>
            {showWorkspaceSideBar &&
                <WorkspaceSideBar channels={channels} url={url} />
            }
            <Switch>
                <Route path={`${path}/channels/:channelId`} >
                    <IndividualChannel />
                </Route>
                <Route path={`/channels/:channelId/threads/:threadId`}>
                    <ThreadSidebar />
                </Route>
                <Route path={`${path}/members`}>
                    <WorkspaceMembers url={url} />
                </Route>
            </Switch>
        </div>

    )

}

export default IndividualWorkspace
