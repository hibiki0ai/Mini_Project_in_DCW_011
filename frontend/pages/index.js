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
    return data.list.map((item, index) => {
      return (
                <Layout>
                  <div className={styles.listItem} key={index}>

                        <div><b>Name:</b>{item.name} </div>
                        <div><b>Topic:</b> {item.topic}  <b>Score:</b> {item.score} <b>Author:</b> {item.author}</div>
                    <div >
                      <button onClick={() => getArticle(item.id)} >Read </button>
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
                        Your Ra
                    </div>
                  </div>
                  <div className={styles.leftcolumn}>
                    <div className={styles.container}>
                        Topic:<input type="text" value={article.topic} className="test1" placeholder="Your Read"></input>
                        Title :<input type="text" value={article.name} className="test1" placeholder="Your Read" ></input>
                        author:<input type="text" value={article.author} placeholder="Your Read" ></input>
                        <textarea rows="10" cols="100" value={article.treatise} placeholder="Your Read"></textarea>
                    </div>
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
}

// {/* export function getServerSideProps({ req, res }) {
//   // console.log("token from cookie: ",cookie.get("token")) 
//   // console.log('req: ', req.headers)
//   return { props: { token: req.cookies.token || "" } };
// } */}
