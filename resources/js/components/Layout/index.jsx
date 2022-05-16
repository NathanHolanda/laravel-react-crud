import styles from './styles.module.scss';
import { Link } from "react-router-dom";
import { useState } from "react";
import { RiUserAddLine, RiContactsBookLine, RiSearchLine } from "react-icons/ri";

function Layout(props){
    const path = location.pathname
    const { query, setQuery } = useState("")

    return (
        <div className={styles.layout}>
            <div className={styles.layoutHeader}>
                <div className={styles.layoutButtons}>
                    <button className={
                        path === "/" ? styles.selected : ""
                    }>
                        <Link to="/"><RiContactsBookLine/></Link>
                    </button>
                    <button className={
                        path === "/cadastrar" ? styles.selected : ""
                    }>
                        <Link to={path !== "/cadastrar" ? "/cadastrar" : ""}><RiUserAddLine/></Link>
                    </button>
                </div>
                <form action="/pesquisar" method="GET" className={styles.searchBox}>
                    <input
                        name="q"
                        placeholder="Procurar contato..."
                        id="search"
                        type="text"
                        value={query}
                        onChange={event => setQuery(event.target.value)}
                    />
                    <button
                      type="submit"
                      htmlFor="search"
                    ><RiSearchLine/></button>
                </form>
            </div>
            <div>
                { props.children }
            </div>
        </div>
    )
}

export { Layout }
