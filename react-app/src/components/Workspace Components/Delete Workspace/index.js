import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { fetchDeleteWorkspace } from '../../../store/workspaces';
import { useModal } from "../../../context/Modal";
import './DeleteWorkspace.css'

function DeleteWorkspace() {
    const history = useHistory()
    const dispatch = useDispatch();
    const [deletedWorkspace, setDeletedWorkspace] = useState(false);
    const [errors, setErrors] = useState([]);

    const { closeModal } = useModal()

    const workspace = useSelector(state => {
        return state?.workspaces?.currentWorkspace
    })

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = await dispatch(fetchDeleteWorkspace(workspace.id))
            .catch(data => setErrors(Object.values(data.errors)))
        if (data.errors) {
            setErrors(Object.values(data.errors))
        } else {
            setDeletedWorkspace(true)
        }
    }

    const handleOkay = async (e) => {
        e.preventDefault();
        closeModal();
        history.push('/')
    }

    const handleNo = (e) => {
        closeModal()
    }

    return (
        <>
            {!deletedWorkspace && <div className="lfform-container" >
                <h1>Are you sure you want to delete Workspace: </h1>
                <h1>{workspace?.name}</h1>
                <form onSubmit={handleSubmit} id='DeleteWorkspaceModalMainDiv'>
                    <ul className="lfform-errors">
                        {errors.map((error, idx) => (
                            <li key={idx} className="lfform-error">{error}</li>
                        ))}
                    </ul>
                    <button type="submit" className={"lfform-button DeleteWorkspaceButton"} id={"DeleteWorkspaceButton"}>Delete Workspace</button>
                </form>
                <button onClick={handleNo} className="lfform-button">No</button>
            </div>}
            {deletedWorkspace && <div className="lfform-container" id='DeleteWorkspaceModalMainDiv'>
                <h1>Succesfully deleted: {workspace?.name}</h1>
                <form onSubmit={handleOkay}>
                    <ul className="lfform-errors">
                        {errors.map((error, idx) => (
                            <li key={idx} className="lfform-error">{error}</li>
                        ))}
                    </ul>
                    <button type="submit" className="lfform-button">Okay</button>
                </form>
            </div>}
        </>
    )
}


export default DeleteWorkspace
