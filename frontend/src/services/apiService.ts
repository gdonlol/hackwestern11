import axios from 'axios'
const baseUrl = "http://localhost:3000/api/generate/"
const baseUrlLineart = "http://localhost:3000/api/lineart/"

const getImage = async (style: string) => {
    console.log('sent req')
    const response = (await axios.get(baseUrl + style, { responseType: 'blob' }))
    const url = URL.createObjectURL(response.data);
    return url
}

const getLineart = async (style: string) => {
    console.log('sent req')
    const response = (await axios.get(baseUrlLineart + style, { responseType: 'blob'}))
    const url = URL.createObjectURL(response.data)
    return url
}

const apiService = {getImage, getLineart}
export default apiService