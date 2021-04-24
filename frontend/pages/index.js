import Head from 'next/head'
import Layout from '../components/layout'
import Navbar from '../components/navbar'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import axios from 'axios'
import withAuth from '../components/withAuth'
import config from '../config/config'
import useSWR, { mutate } from 'swr';

const URL  = `http://localhost/api/articles`;
const fetcher = url => axios.get(url).then(res => res.data);

export default function Home({ token }) {
  const [user, setUser] = useState({})
  const {data} = useSWR(URL,fetcher);
  const [articles, setArticles] = useState({ })
  const [article, setArticle] = useState({});
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('');
  const [treatise, setTreatise] = useState('');
  const [score, setScore] = useState(0);
  const [author, setAuthor] = useState('');
  const [search, setSearch] = useState(''); 

if (!data) {
      console.log(data);
      return <div><h1>Loading...</h1></div>
 }
 const getArticle = async(id) =>{
  let article = await axios.get(`${URL}/${id}`);
  setArticle(article.data)
  mutate(URL);

 }
 const getArticles = async () =>{
  let article = await axios.get(`${URL}`);
  mutate(URL);

 }
 const printArticles = () => {
  if (data.list && data.list.length) {
    return (
      
        <div>
          {data.list.filter((item)=>{
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
                  <div><b>Name:</b>{item.name} </div>
                  <div><b>Topic:</b> {item.topic}  <b>Score:</b> {item.score} <b>Author:</b> {item.author}</div>
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
                        <b>Your Read </b>
                       <center><div><b>Search : </b><input type="text"  onChange={(e) => setSearch(e.target.value)}></input>
                       </div></center> 
                      <div className={styles.card}>
                      <h3>Our articles</h3>
                      <ul>{printArticles()}</ul>
                    </div> 
                  </div>
                </div>
                  <div className={styles.leftcolumn}>
                    <div className={styles.container}>
                    <b>Topic :</b><input type="text" value={article.topic} className="test1" placeholder="Your Read"></input>
                      <b>Title :</b><input type="text" value={article.name} className="test1" placeholder="Your Read" ></input>
                       <b>Author :</b> <input type="text" value={article.author} placeholder="Your Read" ></input>
                        <b>Treatise :</b><textarea rows="10" cols="100" value={article.treatise} placeholder="Your Read"></textarea>
                    </div>
                  </div>
                </div>
                 
                        
                        
            <div className={styles.header}>
                <div className={styles.row}>
                    
                </div>
            </div>
            </Layout>
  )
}

// {/* export function getServerSideProps({ req, res }) {
//   // console.log("token from cookie: ",cookie.get("token")) 
//   // console.log('req: ', req.headers)
//   return { props: { token: req.cookies.token || "" } };
// } */}
