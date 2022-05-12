import styles from './styles.module.scss';
import { Link } from "react-router-dom";
import { RiUserAddLine, RiContactsBookLine } from "react-icons/ri";

function Card(props){
    const path = location.pathname

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <button>
                    <Link to="/"><RiContactsBookLine/></Link>
                </button>
                <button>
                    <Link to={path !== "/cadastrar" ? "/cadastrar" : ""}><RiUserAddLine/></Link>
                </button>
            </div>
            <div>
                { props.children }
            </div>
        </div>
    )
}

export { Card }
