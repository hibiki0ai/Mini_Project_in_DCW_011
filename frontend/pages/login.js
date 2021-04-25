import Head from 'next/head'
import Layout from '../components/layout'
import { useState } from 'react'
import Navbar from '../components/navbar'
import styles from '../styles/Home.module.css'
import axios from 'axios'
import config from '../config/config'

export default function Login({ token }) {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [status, setStatus] = useState('')
    const[remember, setRemember] = useState(false)
    const [email, setEmail] = useState('')

    const login = async (req, res) => {
        try {
            let result = await axios.post(`${config.URL}/login`,
                { username, password, remember },
                { withCredentials: true })
            console.log('result: ', result)
            console.log('result.data:  ', result.data)
            console.log('token:  ', token)
            setStatus(result.status + ': ' + result.data.user.username)
        }
        catch (e) {
            console.log('error: ', JSON.stringify(e.response))
            setStatus(JSON.stringify(e.response).substring(0, 80) + "...")
        }
    }

    const loginForm = () => (
        <div className={styles.gridContainer}>
            <div>
                Username:
            </div>
            <div>
                <input type="text"
                    name="username"
                    placeholder="username"
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                Password:
            </div>
            <div>
                <input type="password"
                    name="password"
                    placeholder="password"
                    onChange={(e) => setPassword(e.target.value)} />
            </div>
            
            <div >
        <input
          id="remember"
          name="remember"
          type="checkbox"
          onClick={rememberStatus}
        />
       
      </div> 
      <div ><label>Remember Me</label></div>
    </div>
       
       
        
    )
    const rememberStatus = async () =>{
        setRemember(true)
    }

    const copyText = () => {
        navigator.clipboard.writeText(token)
    }

    const profileUser = async () => {
        console.log('token: ', token)
        const users = await axios.get(`${config.URL}/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        console.log('user: ', users.data)
    }

    const register = async (req, res) => {
        try {
            let result = await axios.post(`${config.URL}/register`,
                { username, email, password })
            console.log('result: ', result)
            console.log('result.data:  ', result.data)
            console.log('token:  ', token)
            setStatus(result.data.message)
        }
        catch (e) {
            console.log(e)
        }

    }

    const registerForm = () => (
        <div className={styles.gridContainer}>
            <div>
                Username:
            </div>
            <div>
                <input type="text"
                    name="username"
                    placeholder="username"
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                Email:
            </div>
            <div>
                <input type="email"
                    name="email"
                    placeholder="email"
                    onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
                Password:
            </div>
            <div>
                <input type="password"
                    name="password"
                    placeholder="password"
                    onChange={(e) => setPassword(e.target.value)} />
            </div>

        </div>
    )

    return (
        <Layout>
            <Head>
                <title>Login & Register</title>
            </Head>
            
                
                <div className={styles.header}> 
                    <Navbar />
                </div>
                <div className={styles.row}>
                    <center>
                        <div className={styles.container}><b>Token:</b> {token.substring(0, 15)}...
                            
                            <button onClick={copyText}> Copy token </button>
                        </div>
                        <br/>
                        <div>
                            Status:  {status}
                        </div>
                    </center> 
                </div>    
                <div className={styles.row}> 
                    <div className={styles.rightcolumn4}>
                        <div className={styles.container}>
                            <h1>Login</h1>
                            <br />
                            {loginForm()}
                            <div>
                                <button onClick={login}>Login</button>
                            </div>
                        </div>    
                    </div>
                    <div className={styles.leftcolumn4}>
                        <div className={styles.container}>
                        <h1>Register</h1>
                                <div className={styles.content}>
                                    {registerForm()}
                                </div>

                                <div>
                                    <button onClick={register}>Register</button>
                                </div> 
                        </div>
                    </div>
                </div>     
            
        </Layout>
    )
}

export function getServerSideProps({ req, res }) {
    return { props: { token: req.cookies.token || "" } };
}
