import React, {useEffect, useState} from 'react'
import {FaSearch} from 'react-icons/fa'
import {AnimatePresence, motion} from 'framer-motion'
import {useRouter} from 'next/router'
import QuizLobbyCard from '@/components/QuizLobbyCard'
import Navigation from '@/components/Navigation'
import NameInput from '@/components/NameInput'
import {IQueryListRequest, IQuiz, IQuizListResponse} from '@/types'
import {getQuizListApi} from "@/services/quiz.service";
import {handleResponse} from "@/helpers/fetch-wrapper";
import {alert, generateUniqueId} from "@/helpers/utils";
import {createUserApi} from "@/services/user.service";

const ITEMS_PER_PAGE = 6

const Home = () => {
    const [loading, setLoading] = useState(false)

    const [quizLobbies, setQuizLobbies] = useState<IQuiz[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [filter, setFilter] = useState('all')

    const [participantName, setParticipantName] = useState('')

    const [currentPage, setCurrentPage] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const router = useRouter()

    const fetchQuizLobbies = async (page: number) => {
        setLoading(true)
        try {
            const offset = (page - 1) * ITEMS_PER_PAGE
            let request: IQueryListRequest = {
                limit: ITEMS_PER_PAGE,
                offset: offset,
                s: searchTerm,
            }
            if(filter != "all" ){
                request = {
                    limit: ITEMS_PER_PAGE,
                    offset: offset,
                    s: searchTerm,
                    filter: [{
                        field: "difficulty",
                        operator: "$eq",
                        value: filter,
                    }]
                }
            }

            const response: IQuizListResponse = await getQuizListApi(request)
            handleResponse({
                response: response,
            })

            setQuizLobbies(response.data)
            setTotalItems(response.total)
        } catch (error) {
            console.log(error)
            console.error("Error fetching list quiz data:", error);
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        const storedName = localStorage.getItem('quizParticipantName')

        if (storedName) {
            setParticipantName(storedName)
        }

        fetchQuizLobbies(currentPage)
    }, [currentPage, searchTerm, filter])

    const handleJoin = async (lobbyId: number) => {
        await router.push(`/quiz/${lobbyId}`)
    }

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage)
    }

    const handleNameSubmit = async (name: string) => {
        const generatedUserId = generateUniqueId(name);

        if(name != "" && generatedUserId != "") {
            console.log("generatedUserId:", generatedUserId)
            console.log("name:", name)
            setLoading(true)
            try {
                const response = await createUserApi({name, quizUserId: generatedUserId});

                handleResponse({
                    response: response,
                })

                setParticipantName(name);
                localStorage.setItem("quizParticipantName", name);
                localStorage.setItem("quizUserId", generatedUserId);

                setLoading(false)
            } catch (error) {
                console.error("Error creating user:", error);
                setLoading(false)
            } finally {
                setLoading(false)
            }
        }else{
            alert.error("Please try again input your name!")
        }
    }

    if (!participantName) {
        return (loading ? (
            <div className='flex justify-center items-center h-64'>
                <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500'></div>
            </div>
        ) : <NameInput onNameSubmit={handleNameSubmit}/>)
    }

    return (
        <div className='min-h-screen bg-gray-100'>
            <Navigation participantName={participantName}/>

            <AnimatePresence>
                <motion.div
                    key='joinLobby'
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                    className='container mx-auto p-8'
                >
                    <h1 className='text-4xl font-bold mb-8 text-indigo-800'>Join Quiz Lobby</h1>

                    <div className='mb-6 flex flex-col md:flex-row md:items-center md:space-x-4'>
                        <div className='relative flex-grow mb-4 md:mb-0'>
                            <input
                                type='text'
                                placeholder='Search lobbies...'
                                className='w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500 transition-all duration-300 ease-in-out'
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value)
                                    setCurrentPage(1)
                                }}
                            />
                            <div className='absolute left-3 top-3 text-gray-400'>
                                <FaSearch size={20}/>
                            </div>
                        </div>
                        <select
                            value={filter}
                            onChange={(e) => {
                                setFilter(e.target.value)
                                setCurrentPage(1)
                            }}
                            className='w-full md:w-auto px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500 transition-all duration-300 ease-in-out'
                        >
                            <option value='all'>All Difficulties</option>
                            <option value='Easy'>Easy</option>
                            <option value='Medium'>Medium</option>
                            <option value='Hard'>Hard</option>
                        </select>
                    </div>
                    {loading ? (
                        <div className='flex justify-center items-center h-64'>
                            <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500'></div>
                        </div>
                    ) : (
                        <>
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                                {quizLobbies?.map((lobby) => (
                                    <QuizLobbyCard key={lobby.id} lobby={lobby} onJoin={handleJoin}/>
                                ))}
                            </div>
                            {quizLobbies == null || quizLobbies?.length === 0 && (
                                <p className='text-center text-gray-600 mt-8'>No lobbies found. Try adjusting your
                                    search or filter.</p>
                            )}
                        </>
                    )}

                    {/* Pagination */}
                    <div className='mt-8 flex justify-center'>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className='px-4 py-2 mx-1 bg-indigo-500 text-white rounded disabled:bg-gray-300'
                        >
                            Prev
                        </button>
                        <span className='px-4 py-2 mx-1 bg-white border border-gray-300 rounded'>
              Page {currentPage} of {Math.ceil(totalItems / ITEMS_PER_PAGE)}
            </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === Math.ceil(totalItems / ITEMS_PER_PAGE)}
                            className='px-4 py-2 mx-1 bg-indigo-500 text-white rounded disabled:bg-gray-300'
                        >
                            Next
                        </button>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

export default Home
