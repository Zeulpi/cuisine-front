export const findElementWithClass = (element, maxParent, className) => {
    const parent = element.closest(maxParent);
    const elementToReturn = parent.querySelector(className);

    return elementToReturn;
}