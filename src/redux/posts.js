import { createSlice } from '@reduxjs/toolkit'

// We use the posts we got above to set it as the
// default state of the posts to be shown to the user
const initialState = {
    posts: JSON.parse(localStorage.getItem('posts') || null)?.posts || [], // These are posts by the users of the social app
    viewed: JSON.parse(localStorage.getItem('posts') || null)?.viewed || [], // Will contain a list of posts for which the user has viewed
    liked: JSON.parse(localStorage.getItem('posts') || null)?.liked || [],
    unliked: JSON.parse(localStorage.getItem('posts') || null)?.unliked || [], // Holds a list of posts that were previously liked but not any more
    blocked: JSON.parse(localStorage.getItem('posts') || null)?.blocked || []
}

export const counterSlice = createSlice({
  name: 'posts',

  initialState,

  reducers: {
    setPosts: (state, data) => {
        state.posts = data.payload.map(p => {
            return {
                ...p,
                // Because the json placeholder posts
                // don't have likes and views
                likes: Math.floor(Math.random()*50),
                views: Math.floor(Math.random()*5000)
            }
        })

        localStorage.setItem('posts', JSON.stringify(state))
    },

    updatePosts: (state, posts) => {
        state.posts = posts.payload
        localStorage.setItem('posts', JSON.stringify(state))
    },

    addPost: (state, data) => {
        state.posts = [...state.posts, data.payload]
        localStorage.setItem('posts', JSON.stringify(state))
    },

    deletePost: (state, data) => {
        state.posts = state.posts.filter(post => post.id !== data.payload.id)
        localStorage.setItem('posts', JSON.stringify(state))
    },

    block: (state, postId) => {
        state.blocked.push(postId.payload)
        localStorage.setItem('posts', JSON.stringify(state))
    },

    updatePost: (state, data) => {
        state.posts = state.posts.map(post => {
            if(post.id === data.payload.id){
                return {...post, ...data.payload}
            }else {
                return post
            }
        })
        localStorage.setItem('posts', JSON.stringify(state))
    },

    makeViewed: (state, postId) => {
        if(!state.viewed.find(pId => pId === postId.payload)){
            // Update the number of views of that post
            state.posts = state.posts.map(post => {
                if(post.id === postId.payload){
                    const p = post
                    p.views += 1
                    return p
                }else {
                    return post
                }
            })
        }

        const viewedPosts = state.viewed
        viewedPosts.push(postId.payload)

        state.viewed = Array.from(new Set(viewedPosts))
        localStorage.setItem('posts', JSON.stringify(state))
    },

    makeLiked: (state, postId) => {
        if(!state.liked.find(pId => pId === postId.payload)){
            // Update the number of views of that post
            state.posts = state.posts.map(post => {
                if(post.id === postId.payload){
                    const p = post
                    p.likes += 1

                    state.liked.push(postId.payload)
                    state.unliked = state.unliked.filter(lId => lId !== postId.payload)
                    return p
                }else {
                    return post
                }
            })            
        }

        const likedPosts = state.liked
        likedPosts.push(postId.payload)

        state.liked = Array.from(new Set(likedPosts))
        localStorage.setItem('posts', JSON.stringify(state))
    },

    makeUnliked: (state, postId) => {
        if(!state.unliked.find(pId => pId === postId.payload)){
            state.posts = state.posts.map(post => {
                if(post.id === postId.payload){
                    const p = post
                    p.likes -= 1

                    state.unliked.push(postId.payload)
                    state.liked = state.liked.filter(lId => lId !== postId.payload)
                    return p
                }else {
                    return post
                }
            })           
        }

        const unlikedPosts = state.unliked
        unlikedPosts.push(postId.payload)

        state.unliked = Array.from(new Set(unlikedPosts))
        localStorage.setItem('posts', JSON.stringify(state))
    }
  },
})

// Action creators are generated for each case reducer function
export const {setPosts, addPost, deletePost, updatePost,
    setLoggedInUserPosts, makeViewed, makeLiked,
    makeUnliked, block, updatePosts } = counterSlice.actions

export default counterSlice.reducer