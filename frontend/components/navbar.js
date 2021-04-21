import Link from 'next/link'
import styles from '../styles/Home.module.css'
const Navbar = () => (
    <div className={styles.topnav}>
        <Link href="/"><a> Home </a></Link> 
        <Link href="/register"><a> Register </a></Link>  
        <Link href="/login"><a> Login </a></Link> 
        <Link href="/profile"><a> Profile </a></Link> 
        <Link href="/getConfig"><a> Config </a></Link> 
        <Link href="/foo"><a> Foo </a></Link> 
        <Link href="/managestudent"><a>Manage Student</a></Link>
        <Link href="/logout" style="float:right"><a> Logout </a></Link> 
    </div>
)

export default Navbar