import axios from 'axios';


export const getCommunesOfWilaya = async (wilaya) => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/location/get-communes-of-wilaya`, {
            params: {wilaya: wilaya}
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching communes:', error);
        throw error;
    }
};


export const getWilayas = async (keyword) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/location/get-wilayas`, {
            params : {keyword: keyword}
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching communes:', error);
        throw error;
    }
};
