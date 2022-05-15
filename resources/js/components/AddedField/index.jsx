import { RiDeleteBin5Line } from "react-icons/ri"
import { useState, useEffect } from "react";
import InputMask from "react-input-mask";

function AddedField(props){
    const { styles, id, type, label, formState: {
        form, setForm
    }, deleted: {
        deletedFields, setDeletedFields
    }, mask, isEditForm } = props

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
                  type={type}
                  data-id={form[id]?.id ?? ""}
                  value={form[id]?.content}
                  onChange={event => setForm({
                    ...form,
                    [id]: isEditForm ? {
                        ...form[id],
                        content: event.target.value
                    } : event.target.value
                  })}
                />
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
