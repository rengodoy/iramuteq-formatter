import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import copy from 'copy-to-clipboard'

const IramuteqFormatter = () => {
  const [currentText, setCurrentText] = useState("")
  const [items, setItems] = useState([])

  const addText = () => {
    setItems([...items, currentText])
    setCurrentText("")
  }

  const onRemove = (index) => {
    setItems(items.filter((_, iterIndex) => iterIndex != index))
  }

  const formatId = (index) => {
    const num = (index + 1).toString()
    return 'n_' + (num.length < 3 ?  ("0".repeat(3 - num.length) + num) : num)
  }

  const stripText = (text) => {
    return text.replace(/\n/gm, ' ')
               .replace(/[\"\'\-\$%\*]/g, '')
  }

  const output = items.reduce((output, item, index) => (
    output + `**** *${formatId(index)}\n${stripText(item)}\n\n`
  ), '')

  const onCopy = () => {
    copy(output)
    alert('Copiado')
  }

  return (
    <div className="mdl-layout">
      <header className="mdl-layout__header mdl-layout__header--scroll mdl-color--grey-100 mdl-color-text--grey-800">
        <div className="mdl-layout__header-row">
          <h1 className="mdl-layout-title">Iramuteq Formatter</h1>
        </div>
      </header>

      <div className="ribbon"></div>

      <main className="mdl-layout__content">
        <div className="mdl-grid container">
          <div className="mdl-cell mdl-cell--1-col mdl-cell--hide-tablet mdl-cell--hide-phone"></div>
          <div className="content mdl-color--white mdl-shadow--4dp mdl-color-text--grey-800 mdl-cell mdl-cell--10-col">
            <strong>Cole o texto para processar:</strong>
            <textarea value={currentText} onChange={(event) => setCurrentText(event.target.value)}></textarea>
            <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onClick={addText}>Adicionar</button>
          </div>
        </div>

        <div className="mdl-grid container">
          <div className="mdl-cell mdl-cell--1-col mdl-cell--hide-tablet mdl-cell--hide-phone"></div>
          <div className="content text-list mdl-color--white mdl-shadow--4dp mdl-color-text--grey-800 mdl-cell mdl-cell--5-col mdl-cell--12-col-phone mdl-cell--12-col-tablet">
            <strong>Lista de Textos:</strong>
            <ul className="mdl-list">
              {
                items.map((item, index) => (
                  <li key={index} className="mdl-list__item mdl-list__item--three-line">
                    <span className="mdl-list__item-primary-content">
                      <span>Texto {formatId(index)}</span>
                      <span className="mdl-list__item-text-body">
                        {item}
                      </span>
                    </span>

                    <span className="mdl-list__item-scondary-content">
                      <a onClick={() => onRemove(index)} className="mdl-list__item-scondary-action">
                        <i className="material-icons">delete</i>
                      </a>
                    </span>
                  </li>
                ))
              }
            </ul>
          </div>

          <div className="content mdl-color--white mdl-shadow--4dp mdl-color-text--grey-800 mdl-cell mdl-cell--5-col mdl-cell--12-col-phone mdl-cell--12-col-tablet">
            <strong>Resultado:</strong>
            <textarea value={output} readOnly></textarea>
            <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored" onClick={onCopy}>Copiar para área de transferência</button>
          </div>
        </div>
      </main>
    </div>
  )
}

ReactDOM.render(<IramuteqFormatter />, document.getElementById('root'));
