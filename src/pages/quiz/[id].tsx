import React, { useState, useEffect } from "react";
import { FaClock } from "react-icons/fa";
import { useRouter } from "next/router";
import { useSocket } from "@/hooks/useSocket";
import LeaderBoard from "@/components/LeaderBoard";
import Navigation from "@/components/Navigation";
import {AnswerResult, ILeaderBoard, IQuiz} from "@/types";
import NameInput from "@/components/NameInput";
import {createQuizSessionApi, getQuizByIdApi} from "@/services/quiz.service";


const QuizPage = () => {
  const router = useRouter();
  const { id: quizId } = router.query;
  const socket = useSocket();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const [quiz, setQuiz] = useState<IQuiz | null>(null);
  const [leaderboard, setLeaderboard] = useState<ILeaderBoard[]>([]);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);

  const [participantName, setParticipantName] = useState("");
  const [userId, setUserId] = useState("");
  const [userQuizSessionId, setUserQuizSessionId] = useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedName = localStorage.getItem("quizParticipantName");
    const quizUserId = localStorage.getItem("quizUserId");
    if (storedName) {
      setParticipantName(storedName);
    }
    if(quizUserId){
      setUserId(quizUserId)
    }

    fetchQuizData();
  }, [quizId,userId]);

  useEffect(() => {
    if (socket && quizId && userQuizSessionId && userId) {
      const data = {
        userQuizSessionId: Number(userQuizSessionId),
        userId: userId,
        quizId: Number(quizId)
      }
      socket.emit('join-quiz',data);



      socket.on('quiz-result', (data: AnswerResult) => {
        setLeaderboard(data.leaderboard);
        const userLeaderboard = data.leaderboard.find((item)=>{
          return item.quizUser.quizUserId === userId
        })
        if(userLeaderboard){
          setScore(userLeaderboard.score)
        }
      });

    }

    return () => {
      if (socket) {
        socket.off('quiz-result');
      }
    };
  }, [socket, quizId, userQuizSessionId, userId]);

  useEffect(() => {
    if (!showScore && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleQuizEnd();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showScore, timeLeft]);

  const fetchQuizData = async () => {
    if (quizId && userId) {
      try {
        const [fetchedQuiz, quizSessionResponse] = await Promise.all([
          getQuizByIdApi({id:Number(quizId)}),
          createQuizSessionApi(({quizId:Number(quizId),quizUserId:userId}))
        ]);
        setQuiz(fetchedQuiz);
        setUserAnswers(new Array(fetchedQuiz.quizQuestions.length).fill(null));
        setUserQuizSessionId(quizSessionResponse.id)

        setTimeLeft(fetchedQuiz.timeLimit)
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const submitAnswer = (questionIndex: number, answerIndex: number | null) => {
    if (socket && quizId && quiz) {
      const questionId = quiz.quizQuestions[questionIndex].id;
      const answerId = answerIndex !== null
          ? quiz.quizQuestions[questionIndex].quizQuestionOptions[answerIndex].id
          : null;

      console.log(`Submitting answer for userQuizSessionId ${userQuizSessionId} quizId ${quizId} userId ${userId}  question ${questionId}:`, answerId);

      const data = {
        userQuizSessionId: Number(userQuizSessionId),
        userId: userId,
        quizId: Number(quizId),
        questionId: Number(questionId),
        answerId: Number(answerId),
      }

      socket.emit('submit-answer',data);
    }
  };

  const handleAnswerOptionClick = (answerIndex: number) => {
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestion] = answerIndex;
    setUserAnswers(newUserAnswers);
    submitAnswer(currentQuestion, answerIndex);
    moveToNextQuestion();
  };

  const handleQuizEnd = () => {
    userAnswers.forEach((answer, index) => {
      if (answer === null) {
        submitAnswer(index, null);
      }
    });
    setShowScore(true);
  };

  const moveToNextQuestion = () => {
    if (quiz && currentQuestion < quiz.quizQuestions.length - 1) {
      setCurrentQuestion(prevQuestion => prevQuestion + 1);
    } else {
      handleQuizEnd();
    }
  };

  const onFinish = async () => {
    await router.push(`/`);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!participantName) {
    return <NameInput onNameSubmit={setParticipantName} />;
  }

  if (loading) {
    return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500"></div>
        </div>
    );
  }

  if (!quiz) {
    return <div>Quiz not found</div>;
  }

  return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Navigation participantName={participantName} />
        <div className="flex-grow flex flex-col items-center p-4">
          <h2 className="text-3xl font-bold mb-8 text-indigo-700 text-center">{quiz.name}</h2>
          <div className="flex flex-col lg:flex-row items-start justify-center w-full">
            <div className="w-full lg:w-2/3 lg:pr-8">
              {showScore ? (
                  <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <h3 className="text-2xl font-bold mb-4">Quiz Completed!</h3>
                    <p className="text-xl mb-6">You scored {score} out of {quiz.quizQuestions.length}</p>
                    <button
                        onClick={onFinish}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out"
                    >
                      Back to Lobby
                    </button>
                  </div>
              ) : (
                  <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-2xl mx-auto">
                    <div className="mb-6 flex justify-between items-center">
                      <span className="text-lg font-semibold">Question {currentQuestion + 1}/{quiz.quizQuestions.length}</span>
                      <div className="flex items-center space-x-2">
                        <FaClock className="text-indigo-600" />
                        <span className="font-bold text-lg">{formatTime(timeLeft)}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-6">{quiz.quizQuestions[currentQuestion].questionText}</h3>
                    <div className="grid grid-cols-1 gap-4 mb-6">
                      {quiz.quizQuestions[currentQuestion].quizQuestionOptions.map((answerOption, index) => (
                          <button
                              key={index}
                              onClick={() => handleAnswerOptionClick(index)}
                              className="bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-semibold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out text-left border-2"
                          >
                            {answerOption.optionText}
                          </button>
                      ))}
                    </div>
                  </div>
              )}
            </div>
            <div className="w-full lg:w-1/3 mt-8 lg:mt-0">
              <LeaderBoard players={leaderboard} />
            </div>
          </div>
        </div>
      </div>
  );
};

export default QuizPage;