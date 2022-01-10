import axios from 'axios';


export const  fetchData = async (url) => {

    const responseData = await axios({
        method: 'get',
        url: url,
      }).then(response => {
          return response.data
      })

      return responseData;
    
}
