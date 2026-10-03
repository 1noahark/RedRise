import { useState } from "react";
import { IoSend } from "react-icons/io5";

function InputField({ onSend, disabled }) {

    const [input, setInput] = useState("");

    const handleSend = () => {
        if (input.trim() === "" || disabled) {
            return;
        }

        onSend(input);
        setInput("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSend();
        }
    };

    return (
        <div className="inputcontainer">

            <input
                type="text"
                className="chatinput"
                placeholder={
                    disabled
                        ? "Starting conversation..."
                        : "Ask RedRise"
                }
                value={input}
                disabled={disabled}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
            />

            <button
                className="sendbutton"
                onClick={handleSend}
                disabled={disabled}
            >
                <IoSend className="sendicon" />
            </button>

        </div>
    );
}

export default InputField;
