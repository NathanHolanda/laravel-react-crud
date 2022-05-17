import { RiAddLine } from "react-icons/ri";
import styles from "./styles.module.scss";
import { AddedField } from "../AddedField"
import { useState, useEffect } from "react"
import { api } from "../../services/api"
import * as yup from "yup";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SpinnerCircularFixed } from "spinners-react";
import InputMask from "react-input-mask";
import { cpf as cpfValidator } from 'cpf-cnpj-validator';

function EditForm(props) {
    const [ countEmails, setCountEmails ] = useState(0)
    const [ countPhoneNumbers, setCountPhoneNumbers ] = useState(0)
    const [ deletedFields, setDeletedFields ] = useState([])

    const { contactId } = props
    const [form, setForm] = useState({
        name: "",
        surname: "",
        cpf: "",
        email: "",
        phone_number: ""
    })
    useEffect(() => {
        api.get(`contacts/${contactId}`)
            .then(response => response.data)
            .then(data => {
                const { name, surname, cpf, emails, phone_numbers } = data

                const initialData = {
                    name,
                    surname,
                    cpf,
                    email: data.emails.length > 0 ? {
                        id: emails[0].id,
                        content: emails[0].content
                    } : {
                        content: ""
                    },
                    phone_number: {
                        id: phone_numbers[0].id,
                        content: phone_numbers[0].content
                    },
                }

                setCountEmails(
                    emails.length > 0 ? emails.length - 1 : 0
                )
                emails.forEach((item, i) => {
                    if(i !== 0){
                        const { id, content } = item

                        initialData[`email${i}`] = {
                            id,
                            content
                        }

                        setForm({...initialData})
                    }
                })
                setCountPhoneNumbers(phone_numbers.length - 1)
                phone_numbers.forEach((item, i) => {
                    if(i !== 0){
                        const { id, content } = item

                        initialData[`phone_number${i}`] = {
                            id,
                            content
                        }

                        setForm({...initialData})
                    }
                })

                setForm({...initialData})
            })
    }, [])

    const schema = yup.object({
        name: yup.string().min(2, "Nome inválido.").required("Nome obrigatório."),
        surname: yup.string().min(2, "Sobrenome inválido.").required("Sobrenome obrigatório."),
        phone_number: yup.string().matches(/\(\d{2}\) 9\d{4}\-\d{4}/, "Número de telefone inválido.").required("Número de telefone obrigatório.")
    })

    const [errors, setErrors] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isFormSent, setIsFormSent] = useState(false)
    const [submitClicked, setSubmitClicked] = useState(false)

    const onSubmit = formData => {
        setIsLoading(true)
        setIsFormSent(true)

        const { name, surname, cpf } = formData
        const email = {
            id: document.getElementById("email").dataset.id,
            content: formData.email.content
        }
        const phone_number = {
            id: document.getElementById("phone_number").dataset.id,
            content: formData.phone_number.content
        }

        const emails = email ? [email] : []
        for(let i = 1; i <= countEmails; i++){
            const key = `email${i}`
            if(formData[key] && !deletedFields.includes(key)){
                const email = {
                    id: document.getElementById(key).dataset.id,
                    content: formData[key].content
                }

                emails.push(email)
            }
        }

        const phone_numbers = [phone_number]
        for(let i = 1; i <= countPhoneNumbers; i++){
            const key = `phone_number${i}`
            if(formData[key] && !deletedFields.includes(key)){
                const phone_number = {
                    id: document.getElementById(key).dataset.id,
                    content: formData[key].content
                }

                phone_numbers.push(phone_number)
            }
        }

        const data = {
            name,
            surname,
            cpf,
            emails,
            phone_numbers
        }

        api.put(`contacts/${contactId}`, data)
            .then(response => {
                if(response.status === 201){
                    toast.success("Contato atualizado com sucesso! 😉", {
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
                toast.error("Erro ao atualizar contato! 😣", {
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
    const validateForm = async (event) => {
        event.preventDefault()

        const { name, surname, cpf } = form
        const email = form.email.content
        const data = {
            name,
            surname,
            phone_number: form.phone_number.content
        }

        let isCpfValid = true
        let isEmailValid = true
        if(cpf !== "" && cpf !== null){
            const cpfNumbers = cpf.replace(".", "").replace("-", "")
            isCpfValid = cpfValidator.isValid(cpfNumbers)
        }
        if(email !== "" && email !== null)
            isEmailValid = email.match(/[^\s]+@[^\s]+\.[^\s]+/)

        const invalidEmails = []
        const invalidPhoneNumbers = []
        Array(countEmails).fill(0).forEach((_, i) => {
            let valid = true
            const key = `email${i + 1}`

            if( form[key] && !deletedFields.includes(key) )
                valid = form[key].content.match(/[^\s]+@[^\s]+\.[^\s]+/)

            if( !valid ) invalidEmails.push(key)
        })
        Array(countPhoneNumbers).fill(0).forEach((_, i) => {
            let valid = true
            const key = `phone_number${i + 1}`

            if( form[key] && !deletedFields.includes(key) )
                valid = form[key].content.match(/\(\d{2}\) 9\d{4}\-\d{4}/)

            if( !valid ) invalidPhoneNumbers.push(key)
        })

        const errorsFound = {}

        if(!isCpfValid)
            errorsFound.cpf = "CPF inválido."
        if(!isEmailValid)
            errorsFound.email = "E-mail inválido."

        if(invalidEmails.length > 0)
            invalidEmails.forEach(item => errorsFound[item] = "E-mail inválido.")
        if(invalidPhoneNumbers.length > 0)
            invalidPhoneNumbers.forEach(item => errorsFound[item] = "Número de telefone inválido.")

        try{
            await schema.validate(data, {abortEarly: false})
        }catch(errors){
            const invalid = JSON.parse(JSON.stringify(errors))

            invalid.inner.forEach(item => {
                errorsFound[item.path] = item.errors[0]
            })
        }

        setErrors(errorsFound)

        /* console.log(errorsFound, errors) */
        /* if( !errors || Object.keys(errors).length === 0 )
            onSubmit(form) */
    }

    useEffect(() => {
        if(
            submitClicked &&
            (!errors || Object.keys(errors).length === 0)
        )
            onSubmit(form)
    }, [errors])

    return (
        <form onSubmit={validateForm}>
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
                            data-id={form.email.id}
                            type="text"
                            className={ submitClicked && errors?.email ? styles.errorFieldBorder : "" }
                            value={form.email.content}
                            onChange={event => setForm({
                                ...form,
                                email: {
                                    ...form.email,
                                    content: event.target.value
                                }
                            })}
                        />
                        <button
                            type="button"
                            className={styles.addField}
                            onClick={() => {
                                const key = `email${countEmails + 1}`

                                if( !form[key] )
                                    setForm({
                                        ...form,
                                        [key]: {
                                            content: ""
                                        }
                                    })

                                setCountEmails(countEmails + 1)
                            }}
                        ><RiAddLine/></button>
                    </div>
                    { submitClicked && errors?.email && <small className={styles.errorFieldMessage}>{ errors.email }</small> }
                </div>
                {
                    [...Array(countEmails)].map((_, i) => {
                        const key = `email${i + 1}`
                        const error = submitClicked && errors && errors[key] ? errors[key] : null

                        return (
                            <AddedField
                                key={i + 1}
                                label="E-mail"
                                id={key}
                                error={error}
                                styles={styles}
                                deleted={{
                                    deletedFields,
                                    setDeletedFields
                                }}
                                isEditForm={true}
                                formState={{ form, setForm }}
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
                            data-id={form.phone_number.id}
                            className={ submitClicked && errors?.phone_number ? styles.errorFieldBorder : ""}
                            value={form.phone_number.content}
                            onChange={event => setForm({
                                ...form,
                                phone_number: {
                                    ...form.phone_number,
                                    content: event.target.value
                                }
                            })}
                        />
                        <button
                            type="button"
                            className={styles.addField}
                            onClick={() => {
                                const key = `phone_number${countPhoneNumbers + 1}`

                                if( !form[key] )
                                    setForm({
                                        ...form,
                                        [key]: {
                                            content: ""
                                        }
                                    })

                                setCountPhoneNumbers(countPhoneNumbers + 1)
                            }}
                        ><RiAddLine/></button>
                    </div>
                    { submitClicked && errors?.phone_number && <small className={styles.errorFieldMessage}>{ errors.phone_number }</small> }
                </div>
                {
                    [...Array(countPhoneNumbers)].map((_, i) => {
                        const key = `phone_number${i + 1}`
                        const error = submitClicked && errors && errors[key] ? errors[key] : null

                        return (
                            <AddedField
                                key={i + 1}
                                mask="(99) \99999-9999"
                                label="Telefone"
                                id={key}
                                error={error}
                                styles={styles}
                                deleted={{
                                    deletedFields,
                                    setDeletedFields
                                }}
                                isEditForm={true}
                                formState={{ form, setForm }}
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
                    "Atualizar"
                }</button>
            </div>
        </form>
    )
}

export { EditForm }
