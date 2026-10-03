const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Conversation = require("./models/Chat");

const app = express();

app.use(cors());
app.use(express.json());


// CREATE CONVERSATION


app.post("/api/conversations", async (req, res) => {
    try {

        console.log("BOOK FROM REACT:");
        console.log(req.body.book);

        const conversation = await Conversation.create({
            book: {
                key: req.body.book.key,
                title: req.body.book.title,
                author_name: req.body.book.author_name || []
            },

            messages: []
        });

        console.log("CONVERSATION CREATED:");
        console.log(conversation);

        res.status(201).json(conversation);

    } catch (error) {

        console.error(
            "Error creating conversation:",
            error
        );

        res.status(500).json({
            message: "Failed to create conversation"
        });
    }
});



// SEND MESSAGE


app.post(
    "/api/conversations/:id/messages",
    async (req, res) => {

        try {

            const { user } = req.body;

            if (!user || !user.trim()) {
                return res.status(400).json({
                    message: "Message cannot be empty"
                });
            }


            // Find conversation
            const conversation =
                await Conversation.findById(req.params.id);


            if (!conversation) {
                return res.status(404).json({
                    message: "Conversation not found"
                });
            }


            
            // BOOK INFORMATION
            

            const bookTitle =
                conversation.book?.title || "Unknown Book";

            const author =
                conversation.book?.author_name?.length
                    ? conversation.book.author_name.join(", ")
                    : "Unknown Author";


            console.log("BOOK TITLE:", bookTitle);
            console.log("AUTHOR:", author);


            
            // BUILD CONVERSATION HISTORY
            

            const previousMessages =
                conversation.messages.map((message) => {

                    return [
                        {
                            role: "user",
                            content: message.user
                        },

                        {
                            role: "assistant",
                            content: message.bot
                        }
                    ];

                }).flat();


            
            // ASK OLLAMA
            

            const ollamaResponse = await fetch(
                "http://localhost:11434/api/chat",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        model: "gemma3:1b-it-q4_K_M",

                        messages: [

                            // SYSTEM PROMPT
                            {
                                role: "system",

                                content: `
                                You are RedRise, a book discussion AI.
                                
                                The user has selected this specific book:
                                
                                Title: ${bookTitle}
                                Author: ${author}
                                
                                IMPORTANT RULES:
                                
                                1. You are discussing ONLY "${bookTitle}" by ${author}.
                                
                                2. Do NOT confuse this book with another book.
                                
                                3. Do NOT invent characters, locations, events, or plot details.
                                
                                4. If you are not certain about a fact, say:
                                "I don't know."
                                
                                5. Never replace the characters or setting with characters
                                from another book.
                                
                                6. The user may ask about characters, plot, themes,
                                events, or other aspects of the selected book.
                                
                                7. Keep your answers clear and concise.
                                
                                Remember:
                                The selected book is "${bookTitle}" by ${author}.
                                `
                            },


                            // PREVIOUS CONVERSATION
                            ...previousMessages,


                            // CURRENT USER MESSAGE
                            {
                                role: "user",
                                content: user
                            }

                        ],

                        stream: false

                    })
                }
            );


            
            // CHECK OLLAMA - CHECKY CHECK

            if (!ollamaResponse.ok) {

                const errorText =
                    await ollamaResponse.text();

                console.error(
                    "Ollama error:",
                    errorText
                );

                throw new Error(
                    `Ollama returned ${ollamaResponse.status}: ${errorText}`
                );
            }
            
            // GET OLLAMA RESPONSE

            const ollamaData =
                await ollamaResponse.json();


            console.log(
                "OLLAMA RESPONSE:",
                ollamaData
            );


            const botResponse =
                ollamaData.message?.content;


            if (!botResponse) {

                throw new Error(
                    "Ollama returned an empty response"
                );
            }

            // SAVE MESSAGE

            conversation.messages.push({

                user: user,

                bot: botResponse

            });


            await conversation.save();


            // RETURN UPDATED CONVERSATION

            res.status(201).json(conversation);


        } catch (error) {

            console.error(
                "Error processing message:",
                error
            );

            res.status(500).json({
                message: "Failed to process message"
            });

        }
    }
);


// GET CONVERSATION


app.get(
    "/api/conversations/:id",
    async (req, res) => {

        try {

            const conversation =
                await Conversation.findById(
                    req.params.id
                );


            if (!conversation) {

                return res.status(404).json({
                    message: "Conversation not found"
                });

            }


            res.json(conversation);

        } catch (error) {

            console.error(
                "Error getting conversation:",
                error
            );

            res.status(500).json({
                message: "Failed to get conversation"
            });
        }
    }
);

app.get("/api/conversations", async (req, res) => {
    try {

        const conversations =
            await Conversation
                .find()
                .sort({
                    createdAt: -1
                });

        res.json(conversations);

    } catch (error) {

        console.error(
            "Error getting conversations:",
            error
        );

        res.status(500).json({
            message: "Failed to get conversations"
        });

    }
});


// MONGODB
mongoose
    .connect(process.env.MONGO_URI)

    .then(() => {

        console.log(
            "Connected to MongoDB"
        );

        app.listen(5000, () => {

            console.log(
                "Server running on port 5000"
            );

        });

    })

    .catch((error) => {

        console.error(
            "MongoDB connection error:",
            error
        );

    });
