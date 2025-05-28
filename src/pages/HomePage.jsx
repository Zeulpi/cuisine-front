import React from 'react'
import {CardComponent} from '../components/Utils/CardComponent'
import FeatureComponent from '../components/Home/FeatureComponent'
import '../styles/home.css'

export function HomePage() {
    const featureWidth = "100%";
    const featureRatio = "3/2";


    return (
        <>
            <title>
                {(`${process.env.REACT_APP_APP_NAME}`)}
            </title>

            <div className='home-container'>
                <div className='home-header'>
                <h1>Fonctionnalités de l&#39;application</h1>
                </div>
                <div className='home-cards-container'>
                    <CardComponent cardWidth={featureWidth} cardRatio={featureRatio}>
                        <FeatureComponent
                            cardName="Recherche & navigation"
                            cardImg={null}
                            cardDescription="Naviguez avec les menus, ou effectuez une recherche rapide de recette"
                        />
                    </CardComponent>
                    <CardComponent cardWidth={featureWidth} cardRatio={featureRatio}>
                        <FeatureComponent
                            cardName="Votre compte"
                            cardImg={null}
                            cardDescription="Accédez a vos informations personnelles et modifiez les. Vous pouvez changer votre nom d'utilisateur, email, votre avatar, et bien sur modifier votre mot de passe"
                        />
                    </CardComponent>
                    <CardComponent cardWidth={featureWidth} cardRatio={featureRatio}>
                        <FeatureComponent
                            cardName="Liste de recettes"
                            cardImg={null}
                            cardDescription="Recherchez parmi toutes les recettes de l'application, et filtrez les recettes par nom/tags/ingrédients/..."
                        />
                    </CardComponent>
                    <CardComponent cardWidth={featureWidth} cardRatio={featureRatio}>
                        <FeatureComponent
                            cardName="Recettes détaillées"
                            cardImg={null}
                            cardDescription="Accéder aux détails des recettes et suivez les pas à pas"
                        />
                    </CardComponent>
                    <CardComponent cardWidth={featureWidth} cardRatio={featureRatio}>
                        <FeatureComponent
                            cardName="Gestionnaire d'inventaire"
                            cardImg={null}
                            cardDescription="Ajoutez, modifiez, ou supprimer le contenu de votre inventaire. Vous pouvez stocker des ingrédients avec des unités différentes. Vous pouvez aussi rechercher des recettes qui correspondent aux ingrédients dont vous disposez."
                        />
                    </CardComponent>
                    <CardComponent cardWidth={featureWidth} cardRatio={featureRatio}>
                        <FeatureComponent
                            cardName="Gestionnaire de repas hebdomadaire"
                            cardImg={null}
                            cardDescription="Plannifiez votre menu pour la semaine en cours ou la semaine suivante. Vous pouvez également consulter les menus des semaines passées. Vous pouvez aussi générer la liste de courses pour la semaine que vous consultez, et ajouter cette liste à votre inventaire."
                        />
                    </CardComponent>
                </div>
            </div>
        </>
    )
}