import React from 'react'
import DateDisplay from '../components/DateDisplay'
import CardComponent from '../components/Utils/CardComponent'
import '../styles/home.css'

const HomePage = () => {
    return (
        <>
            <title>
                {(`${process.env.REACT_APP_APP_NAME}`)}
            </title>

            <div className='home-container'>
                <div className='home-header'>
                <h1 style={{ fontSize: '3em' }}>Fonctionnalités de l&#39;application</h1>
                </div>
                {/* <DateDisplay /> */}
                <div className='home-cards-container'>
                    <CardComponent
                        cardName="Recherche & navigation"
                        cardImg={null}
                        cardWidth="20vw"
                        cardDescription="Naviguez avec les menus, ou effectuez une recherche rapide de recette"
                    />
                    <CardComponent
                        cardName="Votre compte & Menu hebdo"
                        cardImg={null}
                        cardWidth="20vw"
                        cardDescription="Accédez a vos informations personnelles, et vous pouvez les modifier. Vous pouvez aussi accéder a votre menu hebdomadaire : Customiser le menu de la semaine en cours ou de la semaine suivante, et consulter les menus des semaines passées. Pour la semaine en cours et la prochaine, vous pouvez aussi obtenbir la liste des ingrédients nécessaires pour la semaine"
                    />
                    <CardComponent
                        cardName="Liste de recettes"
                        cardImg={null}
                        cardWidth="20vw"
                        cardDescription="Recherchez parmi toutes les recettes de l'application, et filtrez les recettes par nom/tags/..."
                    />
                    <CardComponent
                        cardName="Recettes détaillées"
                        cardImg={null}
                        cardWidth="20vw"
                        cardDescription="Accéder aux détail des recettes et suivez les pas à pas"
                    />
                </div>
            </div>
        </>
    )
}

export default HomePage
