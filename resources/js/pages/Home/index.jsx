import { Card } from "../../components/Card";
import styles from './styles.module.scss';
import "./styles.css"
import ReactPaginate from 'react-paginate';
import { useState, useEffect } from "react";
import { RiArrowRightSLine, RiArrowLeftSLine } from "react-icons/ri";
import { api } from "../../services/api"

function Home(){
    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const perPage = 8

    useEffect(() => {
        api.get("contacts")
            .then(response => {
                const total = response.data.total
                const totalPages = Math.ceil(total / perPage)
                setPageCount(totalPages)

                return response.data.contacts
            })
            .then(contacts => setCurrentItems(contacts))
    }, [])

    function handlePageClick(event){
        const page = event.selected + 1

        api.get(`contacts?page=${page}`)
            .then(response => response.data.contacts)
            .then(contacts => setCurrentItems(contacts))
    }

    return (
        <main className={styles.container}>
            <Card>
                <h1>Contatos</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>CPF</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            currentItems.map((item, i) => {
                                return (
                                    <tr key={i + 1}>
                                        <td>{`${item.name} ${item.surname}`}</td>
                                        <td>{item.cpf}</td>
                                        <td></td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
                <div className={styles.paginationContainer}>
                    <ReactPaginate
                        breakLabel="..."
                        nextLabel={<RiArrowRightSLine/>}
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={5}
                        pageCount={pageCount}
                        previousLabel={<RiArrowLeftSLine/>}
                    />
                </div>
            </Card>
        </main>
    )
}

export { Home }
