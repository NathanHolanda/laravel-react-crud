import { Card } from "../../components/Card";
import { RiAddLine } from "react-icons/ri";
import styles from "./styles.module.scss";
import { useForm } from "react-hook-form";
import { AddedField } from "../../components/AddedField"
import { useState } from "react"
import { api } from "../../services/api"
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

function Register(){
    const [ countEmails, setCountEmails ] = useState(0)
    const [ countPhoneNumbers, setCountPhoneNumbers ] = useState(0)
    const [ deletedFields, setDeletedFields ] = useState([])

    const schema = yup.object().shape({
        name: yup.string().min(2, "Nome inválido.").required("Nome obrigatório."),
        surname: yup.string().min(2, "Sobrenome inválido.").required("Sobrenome obrigatório."),
        cpf: yup.string().matches(/(\d{3}\.){2}\d{3}\-\d{2}/, "CPF inválido."),
        email: yup.string().email("E-mail inválido.").required("E-mail obrigatório."),
        phone_number: yup.string().matches(/\(\d{2}\) \d \d{4}\-\d{4}/, "Número de telefone inválido.")
    });

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    })
    const onSubmit = formData => {
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
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
            }
        })
    }

    return (
        <main className={styles.container}>
            <Card>
                <h1>Novo contato</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles.formFields}>
                        <div className={styles.formControl}>
                            <label htmlFor="name">Nome *</label>
                            <input
                              id="name"
                              type="text"
                              className={errors.name ? styles.errorFieldBorder : ""}
                              {...register("name")}
                            />
                            { errors.name && <small className={styles.errorFieldMessage}>{ errors.name.message }</small> }
                        </div>

                        <div className={styles.formControl}>
                            <label htmlFor="surname">Sobrenome *</label>
                            <input
                              id="surname"
                              type="text"
                              className={errors.name ? styles.errorFieldBorder : ""}
                              {...register("surname")}
                            />
                            { errors.surname && <small className={styles.errorFieldMessage}>{ errors.surname.message }</small> }
                        </div>

                        <div className={styles.formControl}>
                            <label htmlFor="cpf">CPF *</label>
                            <input
                              id="cpf"
                              type="text"
                              className={errors.name ? styles.errorFieldBorder : ""}
                              {...register("cpf")}
                            />
                            { errors.cpf && <small className={styles.errorFieldMessage}>{ errors.cpf.message }</small> }
                        </div>

                        <div className={styles.formControl}>
                            <label htmlFor="email">E-mail *</label>
                            <div className={styles.inputBox}>
                                <input
                                  id="email"
                                  type="email"
                                  className={errors.name ? styles.errorFieldBorder : ""}
                                  {...register("email")}
                                />
                                <button
                                  className={styles.addField}
                                  onClick={() => {
                                    setCountEmails(countEmails + 1)
                                  }}
                                ><RiAddLine/></button>
                            </div>
                            { errors.email && <small className={styles.errorFieldMessage}>{ errors.email.message }</small> }
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
                                        {...register(`email${i + 1}`)}
                                    />
                                )
                            })
                        }

                        <div className={styles.formControl}>
                            <label htmlFor="phone_number">Telefone *</label>
                            <div className={styles.inputBox}>
                                <input
                                  id="phone_number"
                                  type="text"
                                  className={errors.name ? styles.errorFieldBorder : ""}
                                  {...register("phone_number")}
                                />
                                <button
                                  className={styles.addField}
                                  onClick={() => {
                                    setCountPhoneNumbers(countPhoneNumbers + 1)
                                  }}
                                ><RiAddLine/></button>
                            </div>
                            { errors.phone_number && <small className={styles.errorFieldMessage}>{ errors.phone_number.message }</small> }
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
                                        {...register(`phone_number${i + 1}`)}
                                    />
                                )
                            })
                        }
                    </div>
                    <small>* Campos obrigatórios</small>
                    <div className={styles.buttonContainer}>
                        <button type="submit">Cadastrar</button>
                    </div>
                </form>
            </Card>
        </main>
    )
}

export { Register }
