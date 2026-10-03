import './App.css';

import Userchat from '../Components/Userchat';
import AIchat from '../Components/AIchat';
import BookSelector from '../Components/BookSelector';
import InputField from '../Components/InputField';
import History from '../Components/History';

import { useState } from "react";


function App() {

    const [conversationId, setConversationId] =
        useState(null);

    const [messages, setMessages] =
        useState([]);

    const [selectedBook, setSelectedBook] =
        useState(null);

    // SELECT BOOK

    const selectBook = async (book) => {

        console.log(
            "BOOK SELECTED:",
            book
        );

        setSelectedBook(book);

        try {

            const response = await fetch(
                "http://localhost:5000/api/conversations",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        book: {

                            key: book.key,

                            title: book.title,

                            author_name:
                                book.author_name || []

                        }

                    })
                }
            );


            if (!response.ok) {

                throw new Error(
                    "Failed to create conversation"
                );

            }


            const data =
                await response.json();


            console.log(
                "CONVERSATION CREATED:",
                data
            );


            setConversationId(
                data._id
            );


            setMessages([]);


        } catch (error) {

            console.error(
                "Error creating conversation:",
                error
            );

            setConversationId(null);

        }

    };


    
    // LOAD CONVERSATION FROM HISTORY
    

    const loadConversation = (conversation) => {

        console.log(
            "LOADING CONVERSATION:",
            conversation
        );


        // Set conversation ID

        setConversationId(
            conversation._id
        );


        // Set selected book

        setSelectedBook(
            conversation.book
        );


        // Load messages

        setMessages(
            conversation.messages || []
        );

    };


    
    // SEND MESSAGE
    

    const handleSend = async (userMessage) => {

        if (!conversationId) {

            console.log(
                "Please select a book first."
            );

            return;

        }


        try {

            const response = await fetch(

                `http://localhost:5000/api/conversations/${conversationId}/messages`,

                {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        user: userMessage

                    })

                }

            );


            if (!response.ok) {

                throw new Error(
                    "Failed to send message"
                );

            }


            const data =
                await response.json();


            console.log(
                "UPDATED CONVERSATION:",
                data
            );


            setMessages(
                data.messages
            );


        } catch (error) {

            console.error(
                "Error sending message:",
                error
            );

        }

    };

    return (

        <div>

            <div className="chatcontainer">


                {/* BOOK SELECTOR + HISTORY */}

                <div className="topbuttons">

                    <BookSelector
                        selectedBook={selectedBook}
                        setSelectedBook={selectBook}
                    />


                    <History
                        onSelectConversation={
                            loadConversation
                        }
                    />

                </div>


                {/* MESSAGES */}

                {messages.map((message) => (

                    <div key={message._id}>

                        <Userchat
                            MainValue={message.user}
                        />

                        <AIchat
                            MainValue={message.bot}
                        />

                    </div>

                ))}


            </div>

            <InputField
                onSend={handleSend}
                disabled={!conversationId}
            />

        </div>

    );

}


export default App;
