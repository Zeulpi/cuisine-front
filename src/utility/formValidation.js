import React from 'react';

// src/utils/passwordValidation.js

export const passwordRules = [
    {id: "rule-length",label: "Minimum 5 caractères",test: (pwd) => pwd.length >= 5,},
    {id: "rule-number",label: "Au moins 1 chiffre",test: (pwd) => /\d/.test(pwd),},
    {id: "rule-uppercase",label: "Au moins 1 majuscule",test: (pwd) => /[A-Z]/.test(pwd),},
    // {id: "rule-special",label: "Au moins 1 caractère spécial",test: (pwd) => /[!@#$%^&*()_+=[\]{};':"\\|,.<>/?-]/.test(pwd),},
    // {id: "rule-lowercase",label: "Au moins 1 minuscule",test: (pwd) => /[a-z]/.test(pwd),},
  ];
  
  // Fonction qui met à jour les règles dans le DOM
  export const updatePasswordRulesUI = (password, icons = { valid: "✅", invalid: "❌" }) => {
    if (password === '') return false;
  
    let allValid = true;
    let rulesChecked = 0; // ← compteur
  
    passwordRules.forEach(rule => {
      const isValid = rule.test(password);
      const el = document.getElementById(rule.id);
      if (!el) return;
  
      rulesChecked++; // ← incrément ici
  
      el.textContent = (isValid ? icons.valid : icons.invalid) + " " + rule.label;
      if (!isValid) allValid = false;
    });
  
    return rulesChecked > 0 && allValid; // ← on ne valide que si au moins une règle a été évaluée
  };
  
  
  
  
  
  // Fonction pure (sans DOM) pour juste valider un mot de passe
  export const isPasswordValid = (password) => {
    return passwordRules.every(rule => rule.test(password));
  };

  export const renderPasswordRules = (password, listType = "ul") => {
    if (password === "") return null;
  
    const ListTag = listType === "ol" ? "ol" : "ul";
  
    return (
      <ListTag className="password-rules-list">
        {passwordRules.map(rule => (
          <li key={rule.id} id={rule.id}>
            ❌ {rule.label}
          </li>
        ))}
      </ListTag>
    );
  };

  export const isAllPassValid = (password, confirmPassword) => {
    return (
      password !== '' &&
      password === confirmPassword &&
      isPasswordValid(password)
    );
  };

  export const isPasswordSectionValid = (password, confirmPassword) => {
    return (
      (password === '' && confirmPassword === '') ||
      isAllPassValid(password, confirmPassword)
    );
  };
  
  export const isFormValid = (formData, password, confirmPassword) => {
    const errors = {};
  
    // Vérif champs obligatoires
    if (!formData.userName || formData.userName.trim() === '') {
      errors.userName = "Le nom est obligatoire";
    }
  
    if (!formData.userEmail || formData.userEmail.trim() === '') {
      errors.userEmail = "L'email est obligatoire";
    } else if (!/\S+@\S+\.\S+/.test(formData.userEmail)) {
      errors.userEmail = "L'email n'est pas valide";
    }
  
    // Vérif mot de passe uniquement si au moins un champ est rempli
    const hasPassword = password !== '' || confirmPassword !== '';
    if (hasPassword && !isAllPassValid(password, confirmPassword)) {
      errors.password = "Mot de passe invalide ou non confirmé";
    }
  
    const isValid = Object.keys(errors).length === 0;
  
    return {
      isValid,
      errors,
    };
  };
  