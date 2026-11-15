# MVP - Dimora degli Ulivi

## Prodotto
Sito dimostrativo per un agriturismo fittizio. Funzionalita' distintiva: ricerca simulata disponibilita' camere con calendario e risultati coerenti.

## Pagine
Home; Camere; Esperienze; Territorio; Galleria; Ricerca disponibilita'; Contatti.

## Flusso verticale prioritario
Ricerca mock con check-in, check-out, ospiti, camere; dati di inventario simulati e regole semplici ma coerenti. Mostra risultati, prezzo totale indicativo, stati di nessuna disponibilita' e dettagli camera. Nessuna prenotazione o pagamento reale.

## Criteri di accettazione
Date con check-out successivo al check-in; limiti ospiti rispettati; risultati riproducibili per identici input; interfaccia responsive e accessibile; simulazione chiaramente segnalata.

## Vincoli di scope
- Niente backend, credenziali, integrazioni terze reali, pagamenti o comunicazioni spedite.
- Dati mock mantenuti nel codice e identificati come tali.
- Esperienza completa e dimostrabile anche offline dopo build statico.
- Design originale, non copia di siti reali; contenuto leggibile e funzionante, non placeholder generici.
- Deploy futuro: Cloudflare Pages; master produzione, preview staging da proteggere con Access; develop senza promozione automatica.

## Checklist della prima milestone
- [ ] Scaffold React/Vite/TypeScript strict/Tailwind configurato.
- [ ] Navigazione, layout responsive, tema e componenti base.
- [ ] Typecheck, lint, test essenziale e build.
- [ ] README e documentazione iniziale aggiornati.
- [ ] Nessun deploy remoto o modifica a servizi esterni.
