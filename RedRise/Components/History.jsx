import { useEffect, useState } from "react";

function History({ onSelectConversation }) {

    const [isOpen, setIsOpen] = useState(false);
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(false);


    // Load conversations when popup opens
    useEffect(() => {

        if (!isOpen) {
            return;
        }

        const loadHistory = async () => {

            setLoading(true);

            try {

                const response = await fetch(
                    "http://localhost:5000/api/conversations"
                );

                if (!response.ok) {
                    throw new Error(
                        "Failed to load conversations"
                    );
                }

                const data = await response.json();

                setConversations(data);

            } catch (error) {

                console.error(
                    "Error loading history:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };

        loadHistory();

    }, [isOpen]);


    // Select a conversation
    const handleSelect = (conversation) => {

        onSelectConversation(conversation);

        setIsOpen(false);

    };


    return (
        <>
            {/* HISTORY BUTTON */}

            <button
                className="historybutton"
                onClick={() => setIsOpen(true)}
            >
                History
            </button>


            {/* POPUP */}

            {isOpen && (

                <div
                    className="historyoverlay"
                    onClick={() => setIsOpen(false)}
                >

                    <div
                        className="historypopup"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        {/* HEADER */}

                        <div className="historyheader">

                            <h2>
                                History
                            </h2>

                            <button
                                className="closehistory"
                                onClick={() =>
                                    setIsOpen(false)
                                }
                            >
                                ×
                            </button>

                        </div>


                        {/* LOADING */}

                        {loading && (
                            <p className="historymessage">
                                Loading conversations...
                            </p>
                        )}


                        {/* EMPTY */}

                        {!loading &&
                            conversations.length === 0 && (

                                <p className="historymessage">
                                    No conversations yet.
                                </p>

                            )
                        }


                        {/* CONVERSATIONS */}

                        {!loading &&
                            conversations.map(
                                (conversation) => (

                                    <button
                                        key={conversation._id}
                                        className="historyitem"
                                        onClick={() =>
                                            handleSelect(
                                                conversation
                                            )
                                        }
                                    >

                                        <strong>
                                            {
                                                conversation.book?.title ||
                                                "Unknown Book"
                                            }
                                        </strong>


                                        <span>
                                            {
                                                conversation.book
                                                    ?.author_name
                                                    ?.join(", ") ||
                                                "Unknown Author"
                                            }
                                        </span>


                                        <small>
                                            {
                                                conversation.messages
                                                    ?.length || 0
                                            }
                                            {" "}
                                            messages
                                        </small>

                                    </button>

                                )
                            )
                        }

                    </div>

                </div>

            )}

        </>
    );
}

export default History;
