import { Card } from "../../components/Card";
import styles from './styles.module.scss';

function Home(){
    return (
        <main className={styles.container}>
            <Card>
                <h1>Contatos</h1>
                <table></table>
            </Card>
        </main>
    )
}

export { Home }
