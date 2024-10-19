import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

export const useSocket = (): Socket | null => {
    const [socket, setSocket] = useState<Socket | null>(null)

    useEffect(() => {
        const socketInitializer = () => {
            const newSocket = io(process.env.NEXT_PUBLIC_API_HOST, {
                transports: ['websocket'],
                upgrade: false,
            })

            newSocket.on('connect', () => {
                console.log('Connected to socket')
            })

            newSocket.on('connect_error', (error) => {
                console.error('Socket connection error:', error)
            })

            setSocket(newSocket)
        }

        if (!socket) {
            socketInitializer()
        }

        return () => {
            if (socket) {
                console.log('Disconnecting socket')
                socket.disconnect()
            }
        }
    }, [])  // Remove socket from dependency array

    return socket
}