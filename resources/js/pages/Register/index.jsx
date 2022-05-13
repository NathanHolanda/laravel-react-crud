import { Card } from "../../components/Card";
import { RiAddLine } from "react-icons/ri";
import styles from "./styles.module.scss";
import { useForm } from "react-hook-form";
import { AddedField } from "../../components/AddedField"
import { useState } from "react"

function Register(){
    const [ countEmails, setCountEmails ] = useState(0)
    const [ countPhoneNumbers, setCountPhoneNumbers ] = useState(0)
    const [ deletedFields, setDeletedFields ] = useState([])

    const { register, handleSubmit, formState: { errors } } = useForm()
    const onSubmit = formData => {
        const { name, surname, cpf, email, phone_number } = formData

        const emails = [email]
        for(let i = 1; i <= countEmails; i++){
            const key = `email${i}`
            if(!deletedFields.includes(key))
                emails.push(formData[key])
        }

        const phone_numbers = [phone_number]
        for(let i = 1; i <= countPhoneNumbers; i++){
            const key = `phone_number${i}`
            if(!deletedFields.includes(key))
                phone_numbers.push(formData[key])
        }

        const data = {
            name,
            surname,
            cpf,
            emails,
            phone_numbers
        }

        console.log(data)
    }

    return (
        <main className={styles.container}>
            <Card>
                <h1>Novo contato</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles.formFields}>
                        <div className={styles.formControl}>
                            <label htmlFor="name">Nome *</label>
                            <input id="name" type="text" {...register("name")}/>
                        </div>

                        <div className={styles.formControl}>
                            <label htmlFor="surname">Sobrenome *</label>
                            <input id="surname" type="text" {...register("surname")}/>
                        </div>

                        <div className={styles.formControl}>
                            <label htmlFor="cpf">CPF *</label>
                            <input id="cpf" type="text" {...register("cpf")}/>
                        </div>

                        <div className={styles.formControl}>
                            <label htmlFor="main_email">E-mail *</label>
                            <div className={styles.inputBox}>
                                <input id="main_email" type="email" {...register("email")}/>
                                <button
                                  className={styles.addField}
                                  onClick={() => {
                                    setCountEmails(countEmails + 1)
                                  }}
                                ><RiAddLine/></button>
                            </div>
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
                            <label htmlFor="main_phone_number">Telefone *</label>
                            <div className={styles.inputBox}>
                                <input id="main_phone_number" type="text" {...register("phone_number")}/>
                                <button
                                  className={styles.addField}
                                  onClick={() => {
                                    setCountPhoneNumbers(countPhoneNumbers + 1)
                                  }}
                                ><RiAddLine/></button>
                            </div>
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
