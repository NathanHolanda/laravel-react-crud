import { RiDeleteBin5Line } from "react-icons/ri"
import { forwardRef, useState } from "react";

function Base(props, ref){
    const { styles, id, type, label, deleted: {
        deletedFields, setDeletedFields
    }, initialValue, ...rest } = props
    const [ value, setValue ] = useState(initialValue)
    const [ showElement, setShowElement ] = useState(true)

    return showElement && (
        <div className={styles.formControl}>
            <label htmlFor={id}>{label}</label>
            <div className={styles.inputBox}>
                <input
                  {...rest}
                  id={id}
                  type={type}
                  value={value}
                  defaultValue={initialValue}
                  onChange={event => setValue(event.target.value)}
                  ref={ref}
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

const AddedField = forwardRef(Base)

export { AddedField }
