import Link from 'next/link'
import styles from '../styles/Home.module.css'
const Navbar = () => (
    <div className={styles.topnav}>
                  <div className={styles.leftcolumn3}>
                        <Link href="/"><a> Home </a></Link> 
            
                        <Link href="/managestudent"><a> Add Articles </a></Link>
                        <Link href="/profile"><a> Profile </a></Link> 
                  </div>
                  <div className={styles.rightcolumn3}>
                      <Link href="/login"><a> Login & Register</a></Link> 
                      <Link href="/logout" style="float:right"><a> Logout </a></Link>   
                  </div>
                
        
        
    </div>
)

export default Navbar