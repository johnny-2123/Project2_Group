const GET_DIRECT_MESSAGES = "direct_messages/GET_DIRECT_MESSAGES"

const getDirectMessages = directMessages => ({
    type: GET_DIRECT_MESSAGES,
    payload: directMessages
})

export const fetchDirectMessages = () => async dispatch => {
    console.log(`fetching Direct Messages`)

    const response = await fetch(`/api/direct_messages/`)

    console.log(`response from fetchDirectMessages in redux store:`, response)

    if (response.ok) {
        const directMessages = await response.json()
        console.log(`data returned from direct messages fetch:`, directMessages)
        dispatch(getDirectMessages(directMessages))
        return directMessages
    }
}


const initialState = {
    workspaceDirectMessages: []
}

const directMessages = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case GET_DIRECT_MESSAGES:
            return {
                ...state, workspaceDirectMessages: [...action.payload]
            }
        default:
            return state
    }
}


export default directMessages;
