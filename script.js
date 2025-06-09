// Nombre max de tickets
const maxTickets = 300;

// Essayer de récupérer les tickets restants du localStorage, sinon 300
let ticketsLeft = Number(localStorage.getItem('ticketsLeft')) || maxTickets;

const remainingSpan = document.getElementById('remaining');
const buyBtn = document.getElementById('buy-btn');
const formContainer = document.getElementById('form-container');
const entryForm = document.getElementById('entry-form');
const moncashBtn = document.getElementById('moncash-btn');
const message = document.getElementById('message');

const moncashLink = 'https://payment.moncashbutton.digicelgroup.com/Moncash-middleware/checkout?amount=500&reference=Iwin-tirage';

function updateTicketsUI() {
  remainingSpan.textContent = ticketsLeft;
  if (ticketsLeft <= 0) {
    buyBtn.disabled = true;
    buyBtn.textContent = "Tickets épuisés";
  }
}

// Afficher formulaire au clic sur Acheter
buyBtn.addEventListener('click', () => {
  formContainer.classList.remove('hidden');
  buyBtn.disabled = true;
});

// Redirection vers MonCash
moncashBtn.addEventListener('click', () => {
  window.open(moncashLink, '_blank');
});

// Gestion formulaire de confirmation
entryForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Récupérer les données
  const formData = new FormData(entryForm);
  const name = formData.get('name').trim();
  const phone = formData.get('phone').trim();
  const txid = formData.get('txid').trim();

  if (!name || !phone || !txid) {
    message.textContent = 'Veuillez remplir tous les champs.';
    message.style.color = 'red';
    return;
  }

  // Envoyer les données à Google Sheets via sheet-integration.js
  sendToSheet({ name, phone, txid })
    .then(() => {
      message.textContent = 'Participation enregistrée ! Merci.';
      message.style.color = 'green';
      ticketsLeft--;
      localStorage.setItem('ticketsLeft', ticketsLeft);
      updateTicketsUI();
      formContainer.classList.add('hidden');
      buyBtn.disabled = ticketsLeft <= 0;
      entryForm.reset();
    })
    .catch((err) => {
      message.textContent = 'Erreur lors de l\'enregistrement. Réessayez.';
      message.style.color = 'red';
      console.error(err);
    });
});

updateTicketsUI();
