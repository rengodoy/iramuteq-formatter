import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import copy from 'copy-to-clipboard'
import CompositeWordsUrl from './composite-words.txt'
import { readFileSync } from 'fs'

const CompositeWordsBlob = readFileSync(__dirname + '/composite-words.txt', 'utf-8')
const CompositeWords = CompositeWordsBlob.split("\n").filter((word) => word)
const CompositeWordsRegex = new RegExp(CompositeWords.join('|'), 'ig')
const sampleCompositeWord = CompositeWords[Math.round(Math.random() * (CompositeWords.length - 1))]

const IramuteqFormatter = () => {
  const loadedItems = JSON.parse(localStorage.getItem('iramuteq-formatter-cache') || '[]')
  const [currentText, setCurrentText] = useState("")
  const [items, setItems] = useState(loadedItems)

  const addText = () => {
    const newItems = [...items, currentText]
    setItems(newItems)
    setCurrentText("")

    try {
      localStorage.setItem('iramuteq-formatter-cache', JSON.stringify(newItems))
    } catch (e) {
      alert('Não foi possível salvar o progresso. Você pode continuar utilizando normalmente o programa, mas lembre-se que as alterações partir de agora podem ser perdidas.')
    }
  }

  const onRemove = (index) => {
    setItems(items.filter((_, iterIndex) => iterIndex != index))
  }

  const onRemoveAll = () => {
    if (confirm('Você tem certeza que deseja apagar todos os textos inseridos? Essa ação é irreversível.')) {
      setItems([])
      localStorage.setItem('iramuteq-formatter-cache', '[]')
    }
  }

  const formatId = (index) => {
    const num = (index + 1).toString()
    return 'n_' + (num.length < 3 ?  ("0".repeat(3 - num.length) + num) : num)
  }

  const stripText = (text) => {
    return text.replace(/\n/gm, ' ')
               .replace(/([a-zA-Z\u00C0-\u017F]+)-/g, (_, ...args) => `${args[0]}_`)
               .replace(CompositeWordsRegex, (substring) => substring.replace(/\s/g, '_'))
               .replace(/[\"\'\-\$%\*]/g, '')
               .replace(/(^|\s+)(a|o|e|as|os|no|nos|na|nas|do|dos|de|que|em)\s+/g, ' ')
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
            <span>Esta ferramenta processa textos para utilizar no Iramuteq. As seguintes operações são feitas:</span>
            <ul>
              <li>Quebras de linha são removidas</li>
              <li>Os caracteres <code>"</code>, <code>'</code>, <code>-</code> <code>$</code>, <code>%</code> e <code>*</code> são removidos</li>
              <li>As expressões <code>a</code>, <code>o</code>, <code>e</code>, <code>as</code>, <code>os</code>, <code>no</code>, <code>nos</code>, <code>na</code>, <code>nas</code>, <code>do</code>, <code>dos</code>, <code>de</code>, <code>que</code> e <code>em</code> são removidas</li>
              <li>Palavras compostas por hífen, tais como <code>segunda-feira</code> e <code>bem-me-quer</code>, têm seus hífens trocados por <em>underline (_)</em>.</li>
              <li>Locuções substantivas sem hífen, tais como <code>{sampleCompositeWord}</code>, têm seus espaços substituídos por <em>underline (_)</em>. Nem todas as palavras são incluídas. <a href={CompositeWordsUrl} target="_blank">Veja a lista</a>.</li>
            </ul>

            <p>Ao adicionar um texto, ele será incluído na lista de textos, que permite remover um texto caso adicionado erroneamente.</p>
            <p>O resultado parcial é exibido a medida que os textos são adicionados.</p>

            <br/>

            <strong>Cole o texto para processar:</strong>
            <textarea value={currentText} onChange={(event) => setCurrentText(event.target.value)}></textarea>
            <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onClick={addText}>Adicionar</button>
          </div>
        </div>

        <div className="mdl-grid container">
          <div className="mdl-cell mdl-cell--1-col mdl-cell--hide-tablet mdl-cell--hide-phone"></div>
          <div className="content result-container mdl-color--white mdl-shadow--4dp mdl-color-text--grey-800 mdl-cell mdl-cell--5-col mdl-cell--12-col-phone mdl-cell--12-col-tablet">
            <h3>Lista de Textos</h3>

            <ul className="mdl-list result">
              {
                items.map((item, index) => (
                  <li key={index} className="mdl-list__item mdl-list__item--three-line">
                    <span className="mdl-list__item-primary-content">
                      <span>Texto {formatId(index)}</span>
                      <span className="mdl-list__item-text-body">
                        {item}
                      </span>
                    </span>

                    <span className="mdl-list__item-secondary-content">
                      <a onClick={() => onRemove(index)} className="mdl-list__item-scondary-action">
                        <i className="material-icons">delete</i>
                      </a>
                    </span>
                  </li>
                ))
              }
            </ul>

            <div>
              <a onClick={onRemoveAll} className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect">
                Remover todos
              </a>
            </div>
          </div>

          <div className="content result-container mdl-color--white mdl-shadow--4dp mdl-color-text--grey-800 mdl-cell mdl-cell--5-col mdl-cell--12-col-phone mdl-cell--12-col-tablet">
            <h3>Resultado</h3>
            <textarea className="result" value={output} readOnly></textarea>
            <div>
              <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored" onClick={onCopy}>Copiar para área de transferência</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

ReactDOM.render(<IramuteqFormatter />, document.getElementById('root'));
