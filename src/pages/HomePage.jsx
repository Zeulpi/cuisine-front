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
                            cardName="Votre compte"
                            cardImg={null}
                            cardWidth={cardWidth}
                            cardDescription="Accédez a vos informations personnelles et modifiez les. Vous pouvez changer votre nom d'utilisateur, email, votre avatar, et bien sur modifier votre mot de passe"
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
                    <CardComponent cardWidth={cardWidth}>
                        <FeatureComponent
                            cardName="Gestionnaire d'inventaire"
                            cardImg={null}
                            cardWidth={cardWidth}
                            cardDescription="Visualisez et modifiez la liste des ingrédients que vous avez en stock : Ajoutez, modifiez, ou supprimer le contenu de votre inventaire. Vous pouvez stocker des ingrédients avec des unités différentes"
                        />
                    </CardComponent>
                    <CardComponent cardWidth={cardWidth}>
                        <FeatureComponent
                            cardName="Gestionnaire de repas hebdomadaire"
                            cardImg={null}
                            cardWidth={cardWidth}
                            cardDescription="Plannifiez votre menu pour la semaine en cours ou la semaine suivante. Vous pouvez également consulter les menus des semaines passées. Vous pouvez aussi générer la liste de courses pour la semaine que vous consultez, et ajouter cette liste à votre inventaire."
                        />
                    </CardComponent>
                </div>
            </div>
        </>
    )
}