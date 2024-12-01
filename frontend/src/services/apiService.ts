import axios from 'axios'
const baseUrl = "http://localhost:3001/api/"

const getImage = async (style: string) => {
    console.log('sending get req')
    const response = await axios.get(baseUrl + 'generate/' + style)
    console.log('done')
    return response.data
}
const getScore = async (imgJsons: any) => {
    const response = await axios.post(baseUrl + 'score', imgJsons)
    console.log(response.data)
    return response.data
}

const apiService = {getImage, getScore}
export default apiService