import classNames from 'classnames'
import React from 'react'

interface BackdropElementProps {
  className?: string
}

export const BackdropElement = ({className}: BackdropElementProps) => {
  return (
    <div className={classNames('backdrop-element', className)}>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
      <div className="wave"></div>
    </div>
  )
}
