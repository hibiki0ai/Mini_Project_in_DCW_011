import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import Layout from '../components/layout'
import Navbar from '../components/navbar'
import styles from '../styles/Home.module.css'
import useSWR, { mutate } from 'swr';
// import styles from '../styles/Student.module.css'
import withAuth from '../components/withAuth'
import config from '../config/config'
import axios from 'axios';
const URL = `http://localhost/api/students`
// const fetcher = url => axios.get(url).then(res => res.data);

const admin = ({ token }) => {
  
    const [students, setStudents] = useState({ })
    const [student, setStudent] = useState({});
    const [name, setName] = useState('');
    const [major, setMajor] = useState('');
    const [gpa, setGpa] = useState(0);
    useEffect(() => {
      getStudents();
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
    

const getStudents = async () => {
        let student = await axios.get(URL)
        setStudents(student.data)
    
}
const getStudent = async (id) => {
        let student = await axios.get(`${URL}/${id}`);
        setStudent(student.data)
}
      const addStudent = async (name, major, gpa) => {
        let student = await axios.post(URL, { name, major, gpa })
        console.log(student.data);
        getStudents();
       
      }
      const updateStudent = async (id) => {
        let student = await axios.put(`${URL}/${id}`, { name, major, gpa })
        setStudents(student.data)
        getStudents();
      }
    
      const deleteStudent = async (id) => {
        let student = await axios.delete(`${URL}/${id}`, { name, major, gpa })
        getStudents();
      }
    
      const printStudents = () => {
        if (students.list && students.list.length) {
            return students.list.map((item, index) => {
              return (
                <div className={styles.listItem} key={index}>
                    {index+1}
                  <b> Name:</b> {item.name} <br />
                  <b>Major:</b> {item.major} <br />
                  <b>GPA:</b> {item.gpa}
                  <div >

                    <button onClick={() => getStudent(item.id)} >
                      Get
                    </button>
                    <button onClick={() => updateStudent(item.id)} >
                      Update
                    </button>
                    <button onClick={() => deleteStudent(item.id)}>
                      Delete
                    </button>
                  </div>
                  <br></br>
                </div>
              );
            });
          } else {
            return <p>Loading...</p>;
          }
        };


    return (
            
            <Layout>
              <div className={styles.header}> 
              header
              </div>
              <div className={styles.header}> 
              <Navbar />
              </div>
            <div className={styles.container}>
                
            <h1>Your Student</h1>
            
            Selected Student: name:{student.name}, major:{student.major}, GPA:{student.gpa}
            <h2>Add Student</h2>
            Name:<input type="text" value={student.name} onChange={(e) => setName(e.target.value)}></input>
            Major:<input type="text" onChange={(e) => setMajor(e.target.value)}></input>
            GPA:<input type="number" onChange={(e) => setGpa(e.target.value)}></input>
            <br></br>
            <button  onClick={() => addStudent(name, major, gpa)}>Add Student</button>
            <h3>Our Student</h3>
            <ul>{printStudents()}</ul>
            </div>
            </Layout>
        
        )


};
      
    
export default withAuth(admin)

export function getServerSideProps({ req, res }) {
    return { props: { token: req.cookies.token || "" } };
}


