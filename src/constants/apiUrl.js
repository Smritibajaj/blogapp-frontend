
export const BACKEND_URL = `https://bloagapp.herokuapp.com`
export const API_URL = {
    CREATE_BLOG: `${BACKEND_URL}/v1/blog/create`,
    UPDATE_BLOG:`${BACKEND_URL}/v1/blog/update`,
    GET_ALL_BLOG: `${BACKEND_URL}/v1/blog/allblogs`,
    DELETE_BLOG: '${BACKEND_URL}/v1/blog/delete',
    LOGIN:`${BACKEND_URL}/v1/auth/signin`,
    SIGNUP:`${BACKEND_URL}/v1/auth/signup`,
    GET_USER:`${BACKEND_URL}/v1/user/me`,
    UPLOAD_IMAGE:`${BACKEND_URL}/v1/images/uploadImage`
}

