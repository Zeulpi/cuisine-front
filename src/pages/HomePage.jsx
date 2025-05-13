import React from 'react'
import DateDisplay from '../components/Utils/DateDisplay'
import {CardComponent} from '../components/Utils/CardComponent'
import FeatureComponent from '../components/Home/FeatureComponent'
import '../styles/home.css'

export function HomePage() {
    const cardWidth = "20vw";


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
                    <CardComponent cardWidth={cardWidth}>
                        <FeatureComponent
                            cardName="Recherche & navigation"
                            cardImg={null}
                            cardWidth={cardWidth}
                            cardDescription="Naviguez avec les menus, ou effectuez une recherche rapide de recette"
                        />
                    </CardComponent>
                    <CardComponent cardWidth={cardWidth}>
                        <FeatureComponent
                            cardName="Votre compte & Menu hebdo"
                            cardImg={null}
                            cardWidth={cardWidth}
                            cardDescription="Accédez a vos informations personnelles, et vous pouvez les modifier. Vous pouvez aussi accéder a votre menu hebdomadaire : Customiser le menu de la semaine en cours ou de la semaine suivante, et consulter les menus des semaines passées. Pour la semaine en cours et la prochaine, vous pouvez aussi obtenbir la liste des ingrédients nécessaires pour la semaine"
                        />
                    </CardComponent>
                    <CardComponent cardWidth={cardWidth}>
                        <FeatureComponent
                            cardName="Liste de recettes"
                            cardImg={null}
                            cardDescription="Recherchez parmi toutes les recettes de l'application, et filtrez les recettes par nom/tags/..."
                        />
                    </CardComponent>
                    <CardComponent cardWidth={cardWidth}>
                        <FeatureComponent
                            cardName="Recettes détaillées"
                            cardImg={null}
                            cardWidth={cardWidth}
                            cardDescription="Accéder aux détails des recettes et suivez les pas à pas"
                        />
                    </CardComponent>
                </div>
            </div>
        </>
    )
}