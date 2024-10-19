import {FaMedal} from "react-icons/fa";
import React from "react";
import {ILeaderBoard} from "@/types";

interface IProps {
    players: ILeaderBoard[]
}

const LeaderBoard = ({ players }: IProps) => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-2xl font-bold mb-4 text-indigo-700">Leaderboard</h3>
            <ul>
                {players.map((player, index) => (
                    <li key={player.id} className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                            <span className="mr-2">{index + 1}.</span>
                            <FaMedal className="mr-2 text-yellow-500" />
                            <span>{player.quizUser.name}</span>
                        </div>
                        <span className="font-bold">{player.score}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LeaderBoard;