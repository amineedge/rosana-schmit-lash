# Rosana Schmit — Lash Designer

Site vitrine trilingue de Rosana Schmit, Lash Artist à Florianópolis. La page
présente ses deux procédures, ses lieux de rendez-vous, son portrait et une
sélection récente de son travail sans inventer les informations ou témoignages
encore manquants.

## Lancer localement

```bash
npm run dev
```

Ouvrir <http://localhost:4173>. Les langues peuvent être testées avec `?lang=pt`,
`?lang=en` et `?lang=es`.

## Démonstration de réservation

Ouvrir <http://localhost:4173/agendar.html>. Les onglets « Sou cliente » et
« Agenda de Rosana » partagent les réservations dans ce navigateur. Tester une
réservation, simuler le paiement de l'acompte, puis ouvrir ses options pour
tester une annulation anticipée, tardive ou un remboursement autorisé.
Une nouvelle réservation couvrant le même créneau annulé déclenche la restitution
du signal retenu. Le bouton de pied de page réinitialise uniquement cette démo.
Prix temporaires, aucune transaction réelle, aucun envoi de message.

## Vérifier

```bash
npm test
```

Les emplacements marqués « em breve » ou « a confirmar » doivent être remplacés
uniquement avec du contenu validé par Rosana.

Les sources exactes des médias intégrés sont consignées dans
`assets/instagram/PROVENANCE.md`.
