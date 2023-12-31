import { configureStore } from '@reduxjs/toolkit'
import userReducer from "./user"
import requestReducer from './request'
import postsReducer from './posts'
import paywallReducer from './paywall'
import viewReducer from './view'

export const store = configureStore({
  reducer: {
    user: userReducer,
    request: requestReducer,
    posts: postsReducer,
    paywall: paywallReducer,
    view: viewReducer
  },
})