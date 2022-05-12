import { Card } from "../../components/Card";
import { RiAddLine } from "react-icons/ri";
import styles from "./styles.module.scss";

function Register(){
    return (
        <main className={styles.container}>
            <Card>
                <h1>Cadastrar contato</h1>
                <form>
                    <div className={styles.formControl}>
                        <label htmlFor="name">Nome</label>
                        <input id="name" type="text" name="name"/>
                    </div>
                    <div className={styles.formControl}>
                        <label htmlFor="surname">Sobrenome</label>
                        <input id="surname" type="text" name="surname"/>
                    </div>
                    <div className={styles.formControl}>
                        <label htmlFor="cpf">CPF</label>
                        <input id="cpf" type="text" name="cpf"/>
                    </div>
                    <div className={styles.formControl}>
                        <label htmlFor="main_email">E-mail</label>
                        <div className={styles.inputBox}>
                            <input id="main_email" type="text" name="main_email"/>
                            <button className={styles.addField}><RiAddLine/></button>
                        </div>
                    </div>
                    <div className={styles.formControl}>
                        <label htmlFor="main_phone_number">Telefone</label>
                        <div className={styles.inputBox}>
                            <input id="main_phone_number" type="text" name="main_phone_number"/>
                            <button className={styles.addField}><RiAddLine/></button>
                        </div>
                    </div>
                </form>
            </Card>
        </main>
    )
}

export { Register }
