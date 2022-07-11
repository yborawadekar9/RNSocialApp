import { articles_url, _api_key, country_code} from '../config/rest_config';

export const getArticles = async(category='general') => {
    try {
        const URL = `${articles_url}?country=${country_code}&category=${category}&apiKey=${_api_key}`;
        console.log("URL : ", URL);
        return await fetch(URL).then((res) => res.json());
    } catch (error) {
        console.log("Error : ", error);
    }
};


// export async function getArticle() {
//     try {
//         let articles = await fetch(`${articles_url}?country=${country_code}&category=${category}`, {
//             headers: {
//                 'X-API_KEY': _api_key
//             }
//         });
//         // console.log("Articles : ", articles.json());
//         let results = await articles.json();
//         articles = null;
//         // console.log("Results : ", results);

//         return results.articles;
//     } catch (error) {
//         throw(error);
//     }
// }