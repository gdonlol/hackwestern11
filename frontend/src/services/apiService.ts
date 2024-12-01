import axios from 'axios'
const baseUrl = "http://localhost:3001/api/generate/"

const getImage = async (style: string) => {
    console.log('sending get req')
    const response = await axios.get(baseUrl + style)
    console.log('done')
    return response.data
}

const apiService = {getImage}
export default apiService