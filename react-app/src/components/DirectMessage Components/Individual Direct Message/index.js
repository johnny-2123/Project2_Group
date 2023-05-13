import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchIndividualDM,
    fetchAddDirectMessage,
} from "../../../store/directMessages";
import ChatComponent from "../../ChatComponent";

function IndividualDirectMessage() {
    const { directMessageId } = useParams();

    const dispatch = useDispatch();

    const sessionUser = useSelector((state) => state.session?.user);
    const currentDM = useSelector(
        (state) => state?.directMessages?.currentIndividualDM
    );
    const dmMessages = useSelector(
        (state) => state?.directMessages?.currentIndividualDM?.messages
    );

    const [messages, setMessages] = useState([]);
    const [content, setContent] = useState("");

    const handleSendMessage = async (event) => {
        event.preventDefault();
        const data = await dispatch(
            fetchAddDirectMessage(directMessageId, content)
        ).catch((data) => console.log(data));
        if (data.error) {
            console.log(
                `data above setErrors in handle submit for new message in IndividualDirectMessage`,
                data.error
            );
        } else {
            setContent("");
            const newMessage = await data;
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
    };

    useEffect(() => {
        // Fetch the individual direct message
        dispatch(fetchIndividualDM(directMessageId));
    }, [dispatch, directMessageId]);

    useEffect(() => {
        // Update the local messages state when dmMessages changes
        setMessages(dmMessages);
    }, [dmMessages]);

    const [names, setNames] = useState("");

    useEffect(() => {
        // get an array of user first names, excluding the session user's name
        const userNames = currentDM?.members
            ?.reduce((x, user) => {
                if (user.first_name !== sessionUser.first_name) {
                    x.push(user.first_name);
                }
                return x;
            }, [])
            .join(", ");

        setNames(userNames);
    }, [currentDM, sessionUser]);

    return (
        <ChatComponent
            messages={messages}
            setMessages={setMessages}
            handleSendMessage={handleSendMessage}
            setContent={setContent}
            content={content}
            name={names}
            chat={currentDM}
        />
    );
}

export default IndividualDirectMessage;
