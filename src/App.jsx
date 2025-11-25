import React from 'react'
import { Header } from '../header/Header'
import Chat from '../componentes/Chat'
import { Banner } from '../componentes/Banner'
import { Itens } from '../componentes/Itens'
import { Categorias } from '../componentes/Categorias'
import { Footer } from '../componentes/Footer'
import { Depoimentos } from '../componentes/Depoimentos'

 const App = () => {
  return (
    <section>
      <Banner/>
      <Categorias/>
      <Itens/>
      <Depoimentos/>
      <Chat/>
      <Footer/>
    </section>
  )
}

export default App
