import Head from 'next/head'
import Layout from '../components/layout'
import Navbar from '../components/navbar'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'
import axios from 'axios'
import withAuth from '../components/withAuth'
import config from '../config/config'

const Profile1 = ({ token }) => {

    const [user, setUser] = useState({})

    useEffect(() => {
        profileUser()
    }, [])

    const profileUser = async () => {
        try {
            // console.log('token: ', token)
            const users = await axios.get(`${config.URL}/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            console.log('user: ', users.data)
            setUser(users.data)
        }
        catch (e) {
            console.log(e)
        }

    }
 
    return (
        <Layout>
            <Head>
                <title>User profile</title>
            </Head>
            <div className={styles.header}> 
              <Navbar />
              </div>
              <center>
            <div className={styles.container}>
                <h1>User profile</h1>
                <div className={styles.listItem}>
                    <div><b>Username : </b> {user.username}</div>
                    <div><b>ID       : </b> {user.id}</div>
                    <div><b>Email    : </b> {user.email}</div>
                    <b>Token:</b> {token.substring(0, 15)}... <br /><br />
                    
                </div>
            </div></center>
        </Layout>
    )
}

export default withAuth(Profile1)

export function getServerSideProps({ req, res }) {
    return { props: { token: req.cookies.token || "" } };
}
