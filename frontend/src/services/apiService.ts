import axios from 'axios'
const baseUrl = "http://localhost:3000/api/generate"

const getImage = async () => {
    console.log('sent req')
    const response = (await axios.get(baseUrl, { responseType: 'blob' }))
    const url = URL.createObjectURL(response.data);
    return url
}

const apiService = {getImage}
export default apiService