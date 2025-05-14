export const findElementWithClass = (element, maxParent, className) => {
    const parent = element.closest(maxParent);
    const elementToReturn = parent.querySelector(className);

    return elementToReturn;
}

export const normalizeAllowedUnits = (units) => {
    // Si c’est un tableau
    if (Array.isArray(units)) {
        const first = units[0];

        if (Array.isArray(first)) {
            // [["g"]] → ["g"]
            return first;
        } else if (typeof first === 'object' && first !== null) {
            // [{"0": "litre", "2": "cL"}] → ["litre", "cL"]
            return Object.values(first);
        } else {
            // ["g", "kg"]
            return units;
        }
    }

    // Si c’est un objet direct → {"0": "litre", "2": "cL"}
    if (typeof units === 'object' && units !== null) {
        return Object.values(units);
    }

    // Autres cas : on renvoie tableau vide
    return [];
}
