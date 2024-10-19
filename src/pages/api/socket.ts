import { NextApiRequest } from 'next'
import { Server as ServerIO } from 'socket.io'

const SocketHandler = (req: NextApiRequest, res: any) => {
    if (res.socket.server.io) {
        console.log('Socket is already running')
        res.end()
        return
    }

    console.log('Socket is initializing')
    const io = new ServerIO(res.socket.server)
    res.socket.server.io = io

    io.on('connection', (socket: any) => {
        console.log(`New client connected: ${socket.id}`)

        socket.on('join-quiz', (userQuizSessionId: number, userId:string,quizId: string) => {
            console.log(`Client ${socket.id} userQuizSessionId ${userQuizSessionId} userId ${userId} joined quiz: ${quizId}`)
            socket.join(quizId)

            // RULE: If a user joins a quiz again, their previous score will be reset
            // This means we need to update the leaderboard by either:
            // 1. Removing the user's previous entry and adding a new one with zero score, or
            // 2. Updating the user's existing entry to have a zero score
            // Implementation example:
            // resetUserScore(userId, quizId);
            // updateLeaderboard(quizId);
            setTimeout(() => {
                io.to(quizId).emit('answer-result', {
                    correct: Math.random() < 0.5,
                    leaderboard: [
                        { id: 1, name: 'Player 1', score: Math.floor(Math.random() * 100) },
                        { id: 2, name: 'Player 2', score: Math.floor(Math.random() * 100) },
                        { id: 3, name: 'Player 3', score: Math.floor(Math.random() * 100) },
                        { id: 4, name: 'Player 4', score: Math.floor(Math.random() * 100) },
                    ]
                })
            }, 1000)
        })

        socket.on('submit-answer', (userQuizSessionId: number,  userId:string, quizId: string, answer: string, questionIndex: number) => {
            console.log(`Answer submitted for userQuizSessionId ${userQuizSessionId} userId ${userId} quiz ${quizId}: ${answer} - ${questionIndex}`)

            // Your logic for handling submitted answers
            // For example:
            // saveAnswerToDatabase(userQuizSessionId, userId, quizId, questionId, answerId);
            // updateUserScore(userId, quizId, isCorrectAnswer(questionId, answerId));
            setTimeout(() => {
                io.to(quizId).emit('answer-result', {
                    correct: Math.random() < 0.5,
                    leaderboard: [
                        { id: 1, name: 'Player 1', score: Math.floor(Math.random() * 100) },
                        { id: 2, name: 'Player 2', score: Math.floor(Math.random() * 100) },
                        { id: 3, name: 'Player 3', score: Math.floor(Math.random() * 100) },
                        { id: 4, name: 'Player 4', score: Math.floor(Math.random() * 100) },
                        { id: 5, name: 'Player 5', score: Math.floor(Math.random() * 100) },
                    ]
                })
            }, 1000)
        })

        socket.on('disconnect', () => {
            console.log('Client disconnected')
        })
    })

    // Helper functions (to be implemented):
    // function resetUserScore(userId, quizId) { ... }
    // function updateLeaderboard(quizId) { ... }
    // function getUpdatedLeaderboard(quizId) { ... }
    // function isCorrectAnswer(questionId, answerId) { ... }
    // function updateUserScore(userId, quizId, isCorrect) { ... }

    res.end()
}


export default SocketHandler