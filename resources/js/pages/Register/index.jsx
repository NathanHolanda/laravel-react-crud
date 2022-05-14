import { Layout } from "../../components/Layout";
import { RiAddLine } from "react-icons/ri";
import styles from "./styles.module.scss";
import { AddedField } from "../../components/AddedField"
import { useState } from "react"
import { api } from "../../services/api"
import * as yup from "yup";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SpinnerCircularFixed } from "spinners-react";
import InputMask from "react-input-mask";

function Register(){
    const [form, setForm] = useState({
        name: "",
        surname: "",
        cpf: "",
        email: "",
        phone_number: ""
    })

    const [ countEmails, setCountEmails ] = useState(0)
    const [ countPhoneNumbers, setCountPhoneNumbers ] = useState(0)
    const [ deletedFields, setDeletedFields ] = useState([])

    const schema = yup.object({
        name: yup.string().min(2, "Nome inválido.").required("Nome obrigatório."),
        surname: yup.string().min(2, "Sobrenome inválido.").required("Sobrenome obrigatório."),
        cpf: yup.string().matches(/(\d{3}\.){2}\d{3}\-\d{2}/, "CPF inválido."),
        email: yup.string().email("E-mail inválido.").required("E-mail obrigatório."),
        phone_number: yup.string().matches(/\(\d{2}\) 9\d{4}\-\d{4}/, "Número de telefone inválido.")
    })

    const [errors, setErrors] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isFormSent, setIsFormSent] = useState(false)
    const [submitClicked, setSubmitClicked] = useState(false)
    const onSubmit = formData => {
        setIsLoading(true)
        setIsFormSent(true)

        const { name, surname, cpf, email, phone_number } = formData

        const emails = [email]
        for(let i = 1; i <= countEmails; i++){
            const key = `email${i}`
            if(formData[key] && !deletedFields.includes(key))
                emails.push(formData[key])
        }

        const phone_numbers = [phone_number]
        for(let i = 1; i <= countPhoneNumbers; i++){
            const key = `phone_number${i}`
            if(formData[key] && !deletedFields.includes(key))
                phone_numbers.push(formData[key])
        }

        const data = {
            name,
            surname,
            cpf,
            emails,
            phone_numbers
        }

        api.post("contacts", data)
            .then(response => {
                if(response.status === 201){
                    toast.success("Contato cadastrado com sucesso! 😉", {
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        progress: undefined,
                        onClose: () => location.href = "/",
                        onOpen: () => setIsLoading(false)
                    })
                }

                setIsLoading(false)
            }).catch(() => {
                toast.error("Erro ao cadastrar contato! 😣", {
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    progress: undefined,
                    onClose: () => location.href = "/",
                    onOpen: () => setIsLoading(false)
                })

                setIsLoading(false)
            })
    }

    return (
        <main className={styles.container}>
            <Layout>
                <h1>Novo contato</h1>
                <form onSubmit={event => {
                    event.preventDefault()

                    schema.validate(form, {abortEarly: false})
                        .then(data => onSubmit(data))
                        .catch(data => {
                            const invalid = JSON.parse(JSON.stringify(data))
                            const errors = {}
                            invalid.inner.forEach(item => {
                                errors[item.path] = item.errors[0]
                            })
                            setErrors(errors)
                        })
                }}>
                    <div className={styles.formFields}>
                        <div className={styles.formControl}>
                            <label htmlFor="name">Nome *</label>
                            <input
                              id="name"
                              type="text"
                              className={ submitClicked && errors?.name ? styles.errorFieldBorder : "" }
                              value={form.name}
                              onChange={event => setForm({
                                  ...form,
                                  name: event.target.value
                              })}
                            />
                            { submitClicked && errors?.name && <small className={styles.errorFieldMessage }>{ errors.name }</small> }
                        </div>

                        <div className={styles.formControl}>
                            <label htmlFor="surname">Sobrenome *</label>
                            <input
                              id="surname"
                              type="text"
                              className={ submitClicked && errors?.surname ? styles.errorFieldBorder : "" }
                              value={form.surname}
                              onChange={event => setForm({
                                  ...form,
                                  surname: event.target.value
                              })}
                            />
                            { submitClicked && errors?.surname && <small className={styles.errorFieldMessage}>{ errors.surname }</small> }
                        </div>

                        <div className={styles.formControl}>
                            <label htmlFor="cpf">CPF *</label>
                            <InputMask
                              mask="999.999.999-99"
                              id="cpf"
                              type="text"
                              className={ submitClicked && errors?.cpf ? styles.errorFieldBorder : "" }
                              value={form.cpf}
                              onChange={event => setForm({
                                  ...form,
                                  cpf: event.target.value
                              })}
                            />
                            { submitClicked && errors?.cpf && <small className={styles.errorFieldMessage}>{ errors.cpf }</small> }
                        </div>

                        <div className={styles.formControl}>
                            <label htmlFor="email">E-mail *</label>
                            <div className={styles.inputBox}>
                                <input
                                  id="email"
                                  type="email"
                                  className={ submitClicked && errors?.email ? styles.errorFieldBorder : "" }
                                  value={form.email}
                                  onChange={event => setForm({
                                      ...form,
                                      email: event.target.value
                                  })}
                                />
                                <button
                                  type="button"
                                  className={styles.addField}
                                  onClick={() => {
                                    setCountEmails(countEmails + 1)
                                  }}
                                ><RiAddLine/></button>
                            </div>
                            { submitClicked && errors?.email && <small className={styles.errorFieldMessage}>{ errors.email }</small> }
                        </div>
                        {
                            [...Array(countEmails)].map((_, i) => {
                                return (
                                    <AddedField
                                        key={i + 1}
                                        label="E-mail"
                                        id={`email${i + 1}`}
                                        type="email"
                                        styles={styles}
                                        deleted={{
                                            deletedFields,
                                            setDeletedFields
                                        }}
                                    />
                                )
                            })
                        }

                        <div className={styles.formControl}>
                            <label htmlFor="phone_number">Telefone *</label>
                            <div className={styles.inputBox}>
                                <InputMask
                                  mask="(99) \99999-9999"
                                  id="phone_number"
                                  type="text"
                                  className={ submitClicked && errors?.phone_number ? styles.errorFieldBorder : ""}
                                  value={form.phone_number}
                                  onChange={event => setForm({
                                      ...form,
                                      phone_number: event.target.value
                                  })}
                                />
                                <button
                                  type="button"
                                  className={styles.addField}
                                  onClick={() => {
                                    setCountPhoneNumbers(countPhoneNumbers + 1)
                                  }}
                                ><RiAddLine/></button>
                            </div>
                            { submitClicked && errors?.phone_number && <small className={styles.errorFieldMessage}>{ errors.phone_number }</small> }
                        </div>
                        {
                            [...Array(countPhoneNumbers)].map((_, i) => {
                                return (
                                    <AddedField
                                        key={i + 1}
                                        label="Telefone"
                                        id={`phone_number${i + 1}`}
                                        type="text"
                                        styles={styles}
                                        deleted={{
                                            deletedFields,
                                            setDeletedFields
                                        }}
                                    />
                                )
                            })
                        }
                    </div>
                    <small>* Campos obrigatórios</small>
                    <div className={styles.buttonContainer}>
                        <ToastContainer
                            position="top-right"
                            autoClose={5000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            pauseOnFocusLoss
                            closeButton=""
                            rtl={false}
                            theme="colored"
                        />
                        <button
                          type="submit"
                          disabled={isFormSent}
                          onClick={() => setSubmitClicked(true)}
                        >{
                            isLoading ? <SpinnerCircularFixed size={30} thickness={180} speed={100} color="#dadada" secondaryColor="#0000" /> :
                            "Cadastrar"
                        }</button>
                    </div>
                </form>
            </Layout>
        </main>
    )
}

export { Register }
