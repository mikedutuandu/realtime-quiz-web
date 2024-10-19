import {motion} from "framer-motion";
import {FaClock, FaTrophy, FaUsers} from "react-icons/fa";
import React from "react";
import {IQuiz} from "@/types";

interface IProps {
    lobby: IQuiz
    onJoin: (id: number) => void
}

const QuizLobbyCard = ({ lobby, onJoin }: IProps) => {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-lg shadow-md p-6 mb-6 transition-all duration-300 ease-in-out"
        >
            <h3 className="text-2xl font-bold mb-3 text-indigo-700">{lobby.name}</h3>
            <div className="flex items-center mb-3 text-gray-600">
                <FaUsers className="mr-2" />
                <p>Participants: {lobby.participants}</p>
            </div>
            <div className="flex items-center mb-3 text-gray-600">
                <FaClock className="mr-2" />
                <p>Time Limit: {lobby.timeLimit} seconds</p>
            </div>
            <div className="flex items-center mb-4 text-gray-600">
                <FaTrophy className="mr-2" />
                <p>Difficulty: {lobby.difficulty}</p>
            </div>
            <button
                onClick={() => onJoin(lobby.id)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out"
                aria-label={`Join ${lobby.name} lobby`}
            >
                Join Lobby
            </button>
        </motion.div>
    );
};

export default QuizLobbyCard;