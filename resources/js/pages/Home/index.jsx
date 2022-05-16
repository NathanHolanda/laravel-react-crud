import { Layout } from "../../components/Layout";
import styles from './styles.module.scss';
import ReactPaginate from 'react-paginate';
import { useState, useEffect } from "react";
import { RiArrowRightSLine, RiArrowLeftSLine, RiEyeLine, RiDeleteBin5Line, RiEdit2Line, RiCloseLine } from "react-icons/ri";
import { api } from "../../services/api"
import Modal from 'react-modal';
import { EditForm } from "../../components/EditForm";

Modal.setAppElement("#root")

function Home(){
    const [currentItems, setCurrentItems] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const perPage = 8
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true)

        api.get("contacts")
            .then(response => {
                const total = response.data.total
                const totalPages = Math.ceil(total / perPage)
                setPageCount(totalPages)

                return response.data.contacts
            })
            .then(contacts => {
                setIsLoading(false)
                setCurrentItems(contacts)
            })
    }, [])

    function handlePageClick(event){
        const page = event.selected + 1

        api.get(`contacts?page=${page}`)
            .then(response => response.data.contacts)
            .then(contacts => setCurrentItems(contacts))
    }

    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [modalType, setModalType] = useState("")
    const [currentContact, setCurrentContact] = useState(null)
    const [contactIdToDelete, setContactIdToDelete] = useState(0)

    const closeModal = () => setModalIsOpen(false)
    const openModal = (type, id) => {
        setModalType(type)
        api.get(`contacts/${id}`)
            .then(response => response.data)
            .then(data => {
                setCurrentContact(data)
                setModalIsOpen(true)
            })
    }
    const [confirmDeleteIsOpen, setConfirmDeleteIsOpen] = useState(false)
    const closeConfirmDelete = () => setConfirmDeleteIsOpen(false)
    const openConfirmDelete = (id) => {
        setContactIdToDelete(id)

        setConfirmDeleteIsOpen(true)
    }

    return (
        <main className={styles.container}>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                className="react-modal-content"
                overlayClassName="react-modal-overlay"
            >
                <div className="close-modal-container">
                    <button onClick={closeModal}>
                        <RiCloseLine/>
                    </button>
                </div>

                <h1>{
                    modalType === "edit" ? "Editar contato" :
                    currentContact ? `${currentContact.name} ${currentContact.surname}` : ""
                }</h1>
                {
                    currentContact ?
                    modalType === "view" ?
                    <div className="react-modal-body">
                        <p>CPF: { currentContact.cpf ?? "Não informado"}</p>
                        {
                            currentContact.emails.length > 0 ?
                            <>
                                <p>Emails: </p>
                                <ul>
                                    {
                                        currentContact.emails.map((email, i) => {
                                            return <li key={i + 1}>{email.content}</li>
                                        })
                                    }
                                </ul>
                            </> : <p>Nenhum email cadastrado</p>
                        }
                        <p>Telefones: </p>
                        <ul>
                        {
                            currentContact.phone_numbers.map((phone_number, i) => {
                                return <li key={i + 1}>{phone_number.content}</li>
                            })
                        }
                        </ul>
                    </div> : <EditForm contactId={currentContact.id}/>
                    : ""
                }
            </Modal>

            <Modal
                isOpen={confirmDeleteIsOpen}
                onRequestClose={closeConfirmDelete}
                className="react-confirm-delete"
                overlayClassName="react-modal-overlay"
            >
                <div className="close-modal-container">
                    <button onClick={closeConfirmDelete}>
                        <RiCloseLine/>
                    </button>
                </div>
                <p>Deseja realmente excluir o contato?</p>
                <div className="confirm-delete-buttons">
                    <button
                      className="confirm"
                      onClick={() => {
                        api.delete(`contacts/${contactIdToDelete}`)
                            .then(() => {
                                closeConfirmDelete()
                                location.href = "/"
                            })
                      }}
                    >Confirmar</button>
                    <button
                      className="cancel"
                      onClick={closeConfirmDelete}
                    >Cancelar</button>
                </div>
            </Modal>

            <Layout>
                <h1>Contatos</h1>
                {
                    currentItems.length === 0 && !isLoading ?
                    <p>Nenhum contato cadastrado.</p> :
                    <>
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
                                                <td>{item.cpf || "Não informado"}</td>
                                                <td>
                                                    <div className={styles.tableActions}>
                                                        <button
                                                            onClick={() => openModal("view", item.id)}
                                                        ><RiEyeLine/></button>
                                                        <button
                                                            onClick={() => openModal("edit", item.id)}
                                                        ><RiEdit2Line/></button>
                                                        <button
                                                            onClick={() => openConfirmDelete(item.id)}
                                                        ><RiDeleteBin5Line/></button>
                                                    </div>
                                                </td>
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
                    </>
                }
            </Layout>
        </main>
    )
}

export { Home }
