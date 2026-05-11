import { ChatMessage } from '@/types/chat'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const chatApi = createApi({
	reducerPath: 'chatApi',
	baseQuery: fetchBaseQuery({
		baseUrl: '/api/admin/',
	}),
	tagTypes: ['Chat'],
	endpoints: builder => ({
		getOrderMessages: builder.query<ChatMessage[], string>({
			query: orderId => `chat/${orderId}`,
			providesTags: ['Chat'],
		}),
		unreadMessages: builder.query<boolean, string>({
			query: orderId => `chat/${orderId}/unread`,
		}),
	}),
})

export const { useGetOrderMessagesQuery, useUnreadMessagesQuery } = chatApi

export type { ChatMessage }
