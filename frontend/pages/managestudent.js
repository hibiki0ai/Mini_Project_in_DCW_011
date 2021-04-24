import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import Layout from '../components/layout'
import Navbar from '../components/navbar'
import styles from '../styles/Home.module.css'
import useSWR, { mutate } from 'swr';
// import styles from '../styles/Articles.module.css'
import withAuth from '../components/withAuth'
import config from '../config/config'
import axios from 'axios';
const URL = `http://localhost/api/articles`
// const fetcher = url => axios.get(url).then(res => res.data);

const admin = ({ token }) => {
    const [user, setUser] = useState({})
    const [articles, setArticles] = useState({ })
    const [article, setArticle] = useState({});
    const [name, setName] = useState('');
    const [topic, setTopic] = useState('');
    const [treatise, setTreatise] = useState('');
    const [score, setScore] = useState(0);
    const [author, setAuthor] = useState('');
    const [search, setSearch] = useState(''); 
    c
    useEffect(() => {
      getArticles();
      profileUser();
    }, []);
    const profileUser = async () => {
        try {
          
          const users = await axios.get(`${config.URL}/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
         
          setUser(users.data);
        } catch (e) {
          console.log(e);
        }
      };
    

      const getArticles = async () => {
              let article = await axios.get(URL)
              setArticles(article.data)
          
      }
      const getArticle = async (id) => {
              let article = await axios.get(`${URL}/${id}`);
              setArticle(article.data)
      }
      const addArticle = async (name,topic,treatise,score,author) => {
        let article = await axios.post(URL, { name,topic,treatise,score,author })
        console.log(article.data);
        getArticles();
       
      }
      const updateArticle = async (id,author) => {
        if(user.username == author){
        let article = await axios.put(`${URL}/${id}`, { name,topic,treatise,score,author })
        setArticles(article.data)
        getArticles();
        }
        else {
          ;
        }
      }
    
      const deleteArticle = async (id,author) => {
        if(user.username == author){
          let article = await axios.delete(`${URL}/${id}`, { name,topic,treatise,score,author })
          getArticles();
        }
        else{
          ;
        }
      }
      function myFunction() {
       
      }
      const proo = async () =>{

         

      }

      const printArticles = () => {
        if (articles.list && articles.list.length) {
           return (<div>

           </div>) 
            articles.list.map((item, index) => {
              return (
                    <Layout>
                  <div className={styles.listItem} key={index}>

                        <div><b>Name:</b>{item.name} </div>
                        <div><b>Topic:</b> {item.topic}  <b>Score:</b> {item.score} <b>Author:</b> {item.author}</div>
                    <div >
                      <button onClick={() => getArticle(item.id)} >Read </button>
                      <button onClick={() => updateArticle(item.id,item.author)}>Update</button>
                      <button onClick={() => deleteArticle(item.id,item.author)}>Delete</button>
                    </div>
                    <br></br>
                  </div>
                </Layout>
              );
            });
          } else {
            return <p>Loading...</p>;
          }
        };


    return (
            
            <Layout>
              <div className={styles.header}> 
              <Navbar />
              </div>
                <div className={styles.row}>
                  <div className={styles.rightcolumn}>
                    <div className={styles.container}>
                        Your Add
                    </div>
                  </div>
                  <div className={styles.leftcolumn}>
                    <div className={styles.container}>
                        Topic:<input type="text"  onChange={(e) => setTopic(e.target.value)}></input>
                        Name:<input type="text"  onChange={(e) => setName(e.target.value)}></input>
                        Score:<input type="number" onChange={(e) => setScore(e.target.value)}></input>
                        <textarea rows="10" cols="100" onChange={(e) => setTreatise(e.target.value)} >{articles.name}</textarea>
                      
                    </div>
                    <button  onClick={() => addArticle(name,topic,treatise,score,user.username)}>Add Articles</button>
                  </div>
                </div>
                        
                        
                        
            <div className={styles.header}>
                <div className={styles.row}>
                    <div className={styles.card}>
                      <h3>Our articles</h3>
                      <ul>{printArticles()}</ul>
                    </div>
                </div>
            </div>
            </Layout>
        
        )


};
      
    
export default withAuth(admin)

export function getServerSideProps({ req, res }) {
    return { props: { token: req.cookies.token || "" } };
}


