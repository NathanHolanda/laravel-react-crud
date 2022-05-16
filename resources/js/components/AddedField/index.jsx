import { RiDeleteBin5Line } from "react-icons/ri"
import { useState, useEffect } from "react";
import InputMask from "react-input-mask";

function AddedField(props){
    const { styles, id, label, formState: {
        form, setForm
    }, deleted: {
        deletedFields, setDeletedFields
    }, mask, isEditForm, error } = props

    const [value, setValue] = useState("")
    useEffect(() => {
        if(!isEditForm)
            setForm({
                ...form,
                [id]: ""
            })
    }, [])

    const [ showElement, setShowElement ] = useState(true)

    return showElement && (
        <div className={styles.formControl}>
            <label htmlFor={id}>{label}</label>
            <div className={styles.inputBox}>
                <InputMask
                  mask={mask ?? ""}
                  id={id}
                  type="text"
                  data-id={form[id]?.id ?? ""}
                  className={ error ? styles.errorFieldBorder : "" }
                  value={form[id]?.content ?? value}
                  onChange={event => {
                        setValue(event.target.value)

                        if(isEditForm)
                            setForm({
                                ...form,
                                [id]: {
                                    ...form[id],
                                    content: event.target.value
                                }
                            })
                        else{
                            setForm({
                                ...form,
                                [id]: event.target.value
                            })
                        }
                    }
                  }
                />
                { error && <small className={styles.errorFieldMessage }>{ error }</small> }
                <button
                  type="button"
                  className={styles.removeField}
                  onClick={() => {
                    setDeletedFields([
                        ...deletedFields,
                        id
                    ])
                    setShowElement(false)
                  }}
                ><RiDeleteBin5Line/></button>
            </div>
        </div>
    )
}

export { AddedField }
