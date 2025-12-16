# 🚀 SCAN.MA - Roadmap vers la Production (Maroc)

Ce guide détaille les étapes pour transformer ce prototype en une véritable application utilisée par des milliers de Marocains sur iOS et Android.

## 1. Données Réelles (Le Carburent) 🛢️
Actuellement, nous utilisons des "données fictives". Pour la réalité, il faut de vraies données.

### A. Crowdsourcing (La méthode Waze)
C'est ce que nous avons commencé.
- **Stratégie :** Inciter les utilisateurs à scanner et ajouter des prix.
- **Gamification :** Offrir des points ou des badges pour chaque prix ajouté ("Chasseur de prix").
- **Validation :** Un système de vote (pouce haut/bas) pour confirmer si un prix est juste.

### B. Web Scraping (Automatique)
Créer des robots qui visitent les sites de e-commerce marocains chaque nuit pour mettre à jour les prix.
- **Cibles :** Marjane Market (Glovo/Site web), Carrefour.ma, Jumia Food.
- **Outils :** Python (BeautifulSoup, Selenium) ou Node.js (Puppeteer).
- **Attention :** Vérifier la légalité et les conditions d'utilisation des sites.

### C. Partenariats
- Contacter les petites supérettes pour qu'elles envoient leurs promotions (en échange de visibilité).

---

## 2. Infrastructure Technique (Le Moteur) ⚙️
`ProductContext` (mémoire du téléphone) ne suffit plus. Il faut une base de données cloud commune à tous.

### A. Backend (Cerveau)
- **Option Facile (Recommandée) :** **Supabase** ou **Firebase**.
    - Gère les utilisateurs (Authentification).
    - Base de données temps réel (PostgreSQL pour Supabase).
    - Stockage des images (Bucket).
- **Option Robuste :** Node.js/NestJS + PostgreSQL hébergé sur AWS ou DigitalOcean.

### B. Images
- Utiliser **Cloudinary** ou **AWS S3** pour stocker et optimiser les photos des produits prises par les utilisateurs.

---

## 3. Déploiement Mobile (La Vitrine) 📲
Avec **Expo**, c'est simplifié, mais il y a des étapes administratives.

### A. Comptes Développeurs
- **Google Play Console (Android) :** ~25$ (paiement unique).
- **Apple Developer Program (iOS) :** ~99$ / an.

### B. EAS (Expo Application Services)
Nous utiliserons `EAS Build` pour générer les fichiers `.apk` (Android) et `.ipa` (iOS) sans avoir besoin d'un Mac.
1. `npm install -g eas-cli`
2. `eas login`
3. `eas build --profile production`

---

## 4. Juridique & Business (Maroc) 🇲🇦
- **CNDP :** Déclarer la collecte de données personnelles au Maroc.
- **Monétisation :**
    - **Publicité :** Bannières discrètes.
    - **Abonnement Premium :** Pas de pub, scan illimité, alertes de promotions.
    - **Affiliation :** "Acheter ce panier" via un lien vers Marjane/Carrefour (commission).

---

## 5. Plan d'Action Immédiat
1. **Migration DB :** Remplacer le contexte local par Supabase (Gratuit pour commencer).
2. **Bot Scraper :** Écrire un petit script Python pour récupérer 1000 produits de base (Lait, Huile, Farine) sur les sites marocains.
3. **Beta Test :** Lancer sur TestFlight (iOS) et Play Console (Test interne) avec 50 amis pour tester les bugs.
