# 🌐 Comment Héberger et Tester l'Application Gratuitement

Tu veux partager ton projet comme un lien Netlify ? Voici les 2 meilleures méthodes gratuites.

## Option 1 : La Version Web (Comme Netlify) 🌍
C'est la méthode la plus rapide. Ton application devient un site web accessible via une URL.
**Attention :** Le scanner et la carte peuvent être moins performants sur le web que sur une vraie application mobile.

### Étape 1 : Installer Vercel
1. Crée un compte sur [Vercel.com](https://vercel.com) (c'est gratuit).
2. Installe l'outil de commande :
   ```bash
   npm install -g vercel
   ```

### Étape 2 : Adapter pour le Web
Certaines fonctionnalités (comme la carte) demandent une configuration spéciale pour le web.
Pour l'instant, nous allons générer la version web simple :
```bash
npx expo export --platform web
```
Cela va créer un dossier `dist` (ou `web-build`) avec ton site.

### Étape 3 : Mettre en ligne
Dans ton terminal :
```bash
vercel dist
```
- Réponds aux questions (Appuie sur Entrée pour tout valider).
- À la fin, Vercel te donnera un lien (ex: `https://scan-ma.vercel.app`).
- **C'est tout !** Tu peux envoyer ce lien à tout le monde.

---

## Option 2 : La Vraie Application (APK Android) 📱
C'est la méthode pour tester la *vraie* performance (Scanner ultra rapide, vraie carte Google Maps).

### Étape 1 : Créer le fichier d'installation
Nous allons utiliser les serveurs d'Expo (gratuits) pour fabriquer l'application.
1. Installe EAS CLI (si ce n'est pas fait) :
   ```bash
   npm install -g eas-cli
   ```
2. Connecte-toi à ton compte Expo :
   ```bash
   eas login
   ```
3. Configure le projet :
   ```bash
   eas build:configure
   ```
   (Choisis "Android" si on te demande).

### Étape 2 : Lancer la construction
```bash
eas build -p android --profile preview
```
- Expo va travailler pendant 10-20 minutes.
- À la fin, tu recevras un **lien de téléchargement** (ou un QR Code).

### Étape 3 : Héberger le fichier APK
Le lien d'Expo expire après un moment. Pour garder ton fichier "à vie" :
1. Télécharge le fichier `.apk`.
2. Mets-le sur **Google Drive** (en mode "Public") ou sur **GitHub Releases**.
3. Envoie ce lien à tes testeurs. Ils n'ont qu'à cliquer pour installer !

---

## 🍎 Et pour iPhone (iOS) ?
⚠️ **Attention :** Le lien ci-dessus (`.apk`) **ne marche QUE sur Android**.
Apple est beaucoup plus strict que Google. Pour installer une application sur iPhone sans passer par l'ordinateur, il y a deux conditions :
1.  Payer l'abonnement **Apple Developer** (99$ / an).
2.  Utiliser **TestFlight** (l'outil de test d'Apple).

**Sans payer les 99$**, la seule façon d'utiliser l'app sur iPhone est de garder ton PC allumé et d'utiliser **Expo Go** (comme pendant le développement).

---

## Résumé
| Méthode | Avantage | Inconvénient | Outil |
| :--- | :--- | :--- | :--- |
| **Option 1 (Web)** | Lien instantané, pas d'installation | Scanner/Carte moins fluides | Vercel / Netlify |
| **Option 2 (APK)** | Vraie expérience mobile parfaite | Nécessite d'installer un fichier | EAS Build |
