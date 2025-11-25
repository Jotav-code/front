  import React from 'react'
  // Certifique-se de que os caminhos dos imports estão corretos
  import { Banner } from '../componentes/Banner'
  import { Itens } from '../componentes/Itens'
  import { Categorias } from '../componentes/Categorias'
  import { Footer } from '../componentes/Footer'
  import { Depoimentos } from '../componentes/Depoimentos'
  import Chat from '../componentes/Chat'

  const App = () => {
    return (
      <section className="relative">
        <Banner/>
        <Categorias/>
        <Itens/>
        <Depoimentos/>
        <Footer/>
        
        {/* O Chat flutua, então pode ficar aqui no final */}
        <Chat/>
      </section>
    )
  }

  export default App