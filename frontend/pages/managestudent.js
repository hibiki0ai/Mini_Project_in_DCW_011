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
    
      const printArticles = () => {
        if (articles.list && articles.list.length) {
          return (
              <div> 
                {articles.list.filter((item)=>{
                  if (search ==""){
                    return ({item});
                  }else if (item.name.toLowerCase().includes(search.toLowerCase())){
                    return item.name;
                  }else if (item.topic.toLowerCase().includes(search.toLowerCase())){
                    return item.topic;
                  }else if (item.author.toLowerCase().includes(search.toLowerCase())){
                    return item.author;
              }
                }).map((item, index) => {
                  return (
                    <Layout>
                      <div className={styles.listItem} key={index}>
                        <div> <b>Topic:</b> {item.topic}</div>
                        <div><b>Title:</b>{item.name} <b>Author:</b> {item.author}</div>
                        <div>
                          <button onClick={() => getArticle(item.id)} >Read </button>
                          <button onClick={() => updateArticle(item.id,item.author)}>Update</button>
                          <button onClick={() => deleteArticle(item.id,item.author)}>Delete</button>
                        </div>
                        <br></br>
                      </div>
                    </Layout>
                  )
                })} 
              </div>
            
          )
        }
        else{
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
                        <h2><b>Your Add </b> </h2>
                        <center><div><b>Search : </b><input type="text"  placeholder="Search..." onChange={(e) => setSearch(e.target.value)}></input>
                        </div></center>
                        <div className={styles.card}>
                          <h3>Our articles</h3>
                          <ul>{printArticles()}</ul>
                        </div>
                    </div>
                    
                  </div>
                  <div className={styles.leftcolumn}>
                    <div className={styles.container}>
                        <b>Topic :</b><input type="text"  onChange={(e) => setTopic(e.target.value)} placeholder="Your Add Topic"></input>
                        <b>Title :</b><input type="text"  onChange={(e) => setName(e.target.value)} placeholder="Your Add Title"></input>
                        <b>Treatise :</b><textarea rows="10" cols="100" onChange={(e) => setTreatise(e.target.value)} placeholder="Your Add Treatise" ></textarea>
<center><button  onClick={() => addArticle(name,topic,treatise,score,user.username)}>Add Articles</button></center>
                        <h2>Your Read</h2>
                        <b>Topic :</b><input type="text" value={article.topic} className="test1" placeholder="Your Read Topic"></input>
                        <b>Title :</b><input type="text" value={article.name} className="test1" placeholder="Your Read Title" ></input>
                        <b>Author :</b> <input type="text" value={article.author} placeholder="Your Read Author" ></input>
                        <b>Treatise :</b><textarea rows="10" cols="100" value={article.treatise} placeholder="Your Read Treatise"></textarea>
                    </div>
                     
                  </div>
                </div>
                        
                        
                        
            <div className={styles.header}>
                <div className={styles.row}>
                   
                </div>
            </div>
            </Layout>
        
        )


};
      
    
export default withAuth(admin)

export function getServerSideProps({ req, res }) {
    return { props: { token: req.cookies.token || "" } };
}


