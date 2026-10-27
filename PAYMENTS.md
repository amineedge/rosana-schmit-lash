# Encaissement Rosana — recherche du 27 octobre 2026

Choix recommandé : Mercado Pago Checkout Pro, hébergé par le prestataire,
pour démarrer avec Pix et carte. L'inscription peut se faire en personne physique
avec CPF; l'activation réelle et les moyens proposés restent soumis à la validation
du compte de Rosana. Aucun compte créé ni paiement réel activé dans cette démo.

## Encaissement et réservation

La cliente verse uniquement l'acompte. Il est reçu sur le compte Mercado Pago de
Rosana, puis disponible pour utilisation ou transfert bancaire selon les délais
du contrat. Le solde du service est réglé au rendez-vous.

L'intégration réelle exige un serveur et une base de données. Bloquer temporairement
le créneau pendant le paiement avec expiration; confirmer après vérification serveur
du statut payé, du montant, de la devise et de la référence de réservation.
Le retour du navigateur depuis le checkout ne suffit pas. Vérifier les signatures
des webhooks, dédupliquer les événements, utiliser des clés d'idempotence pour
création et remboursement, conserver les références du prestataire et un journal.

Ne jamais conserver les numéros de carte dans le site. Une carte de crédit et
une carte de débit sont des moyens de paiement; vérifier la disponibilité effective
du débit pour le compte/checkout avant de l'afficher comme garanti.

## Remboursement ou avoir

Un remboursement total ou partiel est une opération du prestataire, sur le paiement
initial. Il faut un solde disponible suffisant. La carte est recréditée selon le
circuit de l'émetteur; Pix suit la restitution proposée par le prestataire.
Afficher « remboursement en cours » jusqu'à confirmation effective, et traiter
un échec ou un manque de solde sans afficher « remboursé » prématurément.

Un avoir Rosana est un solde interne utilisable pour une réservation future.
Il faut un registre de crédit et de consommation, sans le compter comme un
remboursement bancaire. Cette consommation n'est pas encore implémentée dans la démo.

En cas d'annulation tardive puis de reprise du créneau, appliquer la décision
d'éligibilité puis demander le remboursement ou créer l'avoir choisi. Ne pas
confondre le paiement d'une remplaçante avec une preuve de prestation réalisée.
La politique doit couvrir un second désistement et les droits légaux prioritaires.

## Comparaison et points à confirmer

Mercado Pago : premier candidat pour Pix/cartes et démarrage en CPF.
Asaas : alternative intéressante pour suivi de trésorerie et recouvrement; son
API documente Pix et cartes de crédit. Stripe : moins direct pour ce projet,
le Pix brésilien étant annoncé sur invitation au moment de la recherche.

Avant activation : compte CPF/CNPJ de Rosana, compte bancaire de réception,
tarifs réels, délai de disponibilité, moyens de carte autorisés, frais conservés
ou restitués lors des remboursements, fenêtre de remboursement, gestion des litiges.
Ne pas figer ces éléments à partir de tarifs promotionnels ou de pages générales.

## Sources officielles

- CPF / vente en ligne : https://www.mercadopago.com.br/blog/vender-online-sem-site-receber-pagamentos
- Paiements : https://www.mercadopago.com.br/developers/pt/docs/checkout-api-payments/overview
- Remboursements : https://www.mercadopago.com.br/developers/pt/docs/checkout-pro-orders/refunds-cancellations?scope=prod
- Notifications : https://www.mercadopago.com.br/developers/en/docs/links-and-debts/additional-content/your-integrations/notifications/webhooks
- Asaas : https://docs.asaas.com/reference/create-new-payment
- Remboursement Asaas : https://docs.asaas.com/reference/refund-payment
- Stripe Brésil : https://support.stripe.com/questions/brazil-specific-information-to-open-a-stripe-account?locale=pt-BR
- Pix Stripe : https://stripe.com/en-br/pricing/local-payment-methods
