import React from 'react'

function FormButton({
    children,
    onClick,
    type = 'button',
    value
}) {
  return (
    <button>{value}</button>
  )
}

export default FormButton