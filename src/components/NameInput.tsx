import React, {useState} from "react";


interface IProps {
    onNameSubmit: (name: string) => void
}
const NameInput = ({ onNameSubmit }: IProps) => {
    const [name, setName] = useState("");

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (name.trim()) {
            onNameSubmit(name.trim());
        }
    };


    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">Welcome to Quiz Platform</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
                    >
                        Start Quizzing
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NameInput;